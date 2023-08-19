'use client'

import { useRef, useEffect, Ref, useCallback, useMemo } from "react"
import { GuideSheet, getFormattedGuideSheet } from "../model/guidesheet"
import { draw } from './drawGuidesheet';

export function PagePreview(props: {gs: GuideSheet}) {
  const canvasRef: Ref<HTMLCanvasElement> = useRef(null);
  const initTransformRef = useRef<DOMMatrix | null>(null);
  const lastPinchDistanceRef = useRef(0);
  const isMovementStarted = useRef(false);
  const lastTouch = useRef({x: 0, y: 0});
  const lastPinchCenter = useRef({x: 0, y: 0});
  const firstRender = useRef(true);
  let gs = useMemo(() => getFormattedGuideSheet(props.gs), [props.gs]);
  
  const clear = () => {
    let ctx = canvasRef.current!!.getContext('2d')!!;
    let inverse = ctx.getTransform().inverse();
    let start = inverse.transformPoint({x: 0, y: 0});
    let end = inverse.transformPoint({x: canvasRef.current!!.width, y: canvasRef.current!!.height})
    ctx.clearRect(start.x, start.y, end.x - start.x, end.y - start.y);
  }

  const _handleMovement = useCallback((e: React.UIEvent | UIEvent, movementX: number, movementY: number) => {
    if (!isMovementStarted.current)
      return;
    e.stopPropagation();
    e.preventDefault();
    clear();
    let ctx = canvasRef.current?.getContext('2d')!!;
    let currentScale = ctx.getTransform().a;
    let deltaX = movementX / currentScale;
    let deltaY = movementY / currentScale;
    ctx.translate(deltaX, deltaY);
    draw(gs, canvasRef.current!!);
  }, [gs]);
  
  const handleMovementStart = useCallback((e: React.MouseEvent | TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isMovementStarted.current = true;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length == 1) {
      let touch = e.touches.item(0)!!;
      lastTouch.current = { x: touch.clientX, y: touch.clientY }
      handleMovementStart(e)
    } else if (e.touches.length == 2) {
      lastPinchDistanceRef.current = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      )
    }
  }, [handleMovementStart])

  const handleMovementEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isMovementStarted.current = false;
  }, []);

  const _handleZooming = useCallback((centerX: number, centerY: number, zoom: number, scaleFactor: number) => {
    clear();
    let scaleAmount = zoom * (zoom < 1 ? 1 / scaleFactor : scaleFactor);
    let ctx = canvasRef.current!!.getContext('2d')!!;
    let zoomPoint = ctx.getTransform().invertSelf().transformPoint({
      x: centerX,
      y: centerY
    });
    ctx.translate(zoomPoint.x, zoomPoint.y);
    ctx.scale(scaleAmount, scaleAmount);
    ctx.translate(-zoomPoint.x, -zoomPoint.y);
    draw(gs, canvasRef.current!!);
    lastPinchCenter.current = { x: zoomPoint.x, y: zoomPoint.y};
    console.log(`scaleAmount: ${scaleAmount}`)
  }, [gs, canvasRef]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length == 0 || e.changedTouches.item(0) == null) return;
    if (e.touches.length == 1) {
      let touch = e.touches.item(0)!!;
      let movementX = lastTouch.current.x - touch.clientX;
      let movementY = lastTouch.current.y - touch.clientY;
      lastTouch.current = {x: touch.clientX, y: touch.clientY}
      _handleMovement(e, -movementX, -movementY);
    } else if (e.touches.length == 2){
      let rect = canvasRef.current!!.getBoundingClientRect();
      let p0 = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
      let p1 = {
        x: e.touches[1].clientX - rect.left,
        y: e.touches[1].clientY - rect.top
      }
      let w = p1.x - p0.x;
      let h = p1.y - p0.y;
      let hyp = Math.hypot(w, h);
      _handleZooming(
        (p0.x + p1.x) / 2,
        (p0.y + p1.y) / 2,
        hyp / lastPinchDistanceRef.current,
        1
      ); 
      lastPinchDistanceRef.current = hyp
    }
  }, [_handleMovement, _handleZooming]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => 
    _handleMovement(e, e.movementX, e.movementY
    ), [_handleMovement]);

  const handleMovementLeave = useCallback(() => {
    isMovementStarted.current = false;
  }, []);

  const handleScrolling = useCallback((e: WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let rect = canvasRef.current!!.getBoundingClientRect();
    _handleZooming(
      e.clientX - rect.left, 
      e.clientY - rect.top, 
      e.deltaY > 0 ? 1 - 1/e.deltaY : 1 + 1 / Math.abs(e.deltaY),
      1.1
    );
  }, [_handleZooming, canvasRef])

  const centerView = useCallback(() => {
    let ctx = canvasRef.current?.getContext('2d');
    if (initTransformRef.current == null)
      return;
    ctx?.setTransform(initTransformRef.current!!);
    clear();
    draw(gs, canvasRef.current!!);
  }, [gs]);

  let pageWidth = gs.pageLayout.width;
  let pageHeight = gs.pageLayout.height;
  useEffect(() => {
    if (!canvasRef.current) return;
    console.log("Resizing");
    let cv = canvasRef.current!!;
    let ctx = cv.getContext('2d')!!;
    let pxRatio = window.devicePixelRatio;
    let w = cv.parentElement!!.clientWidth;
    let h = cv.parentElement!!.clientHeight;
    cv.width = w * pxRatio;
    cv.height = h * pxRatio;
    cv.style.width = `${w}px`;
    cv.style.height = `${h}px`;
    if (!firstRender.current) return;

    let s = Math.min(cv.clientWidth / pageWidth, cv.clientHeight / pageHeight);
    let initialScale = s - s * 0.05; // * dpi;
    ctx.scale(initialScale, initialScale);
    let center = ctx.getTransform().inverse().transformPoint({
      x: cv.width / 2, 
      y: cv.height / 2
    });
    let pageCenter = {x: pageWidth / 2, y: pageHeight / 2};
    ctx.translate(
      center.x - pageCenter.x,
      center.y - pageCenter.y
    );
    initTransformRef.current = ctx.getTransform();
    firstRender.current = false;
    draw(gs, cv);
  }, [canvasRef, pageWidth, pageHeight]);

  useEffect(() => {
    let cv = canvasRef.current!!;
    cv.addEventListener('wheel', handleScrolling, {passive: false});
    cv.addEventListener('touchstart', handleTouchStart, {passive: false});
    cv.addEventListener('touchmove', handleTouchMove, {passive: false})
  }, [gs, handleScrolling, handleTouchStart, handleTouchMove]);

  return (
    <div className="PagePreview">
      <div className="preview-container">
        <canvas id="preview" className="PagePreview" ref={canvasRef} 
          onMouseUp={handleMovementEnd}
          onMouseDown={handleMovementStart}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMovementLeave}
          onTouchEnd={handleMovementEnd}
          />
          <button className="button is-info" onClick={centerView}>Center</button>
      </div>
    </div>
  )

}

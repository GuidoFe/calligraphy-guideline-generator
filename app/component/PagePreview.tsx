'use client'

import React, { useLayoutEffect, useRef, useEffect, Ref} from "react"
import { GuideSheet, getFormattedGuideSheet } from "../model/guidesheet"
import {draw} from './drawGuidesheet';

export function PagePreview(props: {gs: GuideSheet}) {
  const canvasRef: Ref<HTMLCanvasElement> = useRef(null);
  const initTransformRef = useRef<DOMMatrix | null>(null);
  const lastPinchDistanceRef = useRef(0);
  const isMovementStarted = useRef(false);
  const lastTouch = useRef({x: 0, y: 0});
  let gs = getFormattedGuideSheet(props.gs);
  
  const clear = () => {
    let ctx = canvasRef.current!!.getContext('2d')!!;
    let inverse = ctx.getTransform().inverse();
    let start = inverse.transformPoint({x: 0, y: 0});
    let end = inverse.transformPoint({x: canvasRef.current!!.width, y: canvasRef.current!!.height})
    ctx.clearRect(start.x, start.y, end.x - start.x, end.y - start.y);
  }

  const handleTouchStart = (e: TouchEvent) => {
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
  }
  const handleMovementStart = (e: React.MouseEvent | TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isMovementStarted.current = true;
  }

  const handleMovementEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isMovementStarted.current = false;
  }

  const handleTouchMove = (e: TouchEvent) => {
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
      let w = Math.abs(p0.x - p1.x);
      let h = Math.abs(p0.y - p1.y);
      let hyp = Math.hypot(w, h);
      _handleZooming(
        Math.min(p0.x, p1.x) + w / 2,
        Math.min(p0.y, p1.y) + h / 2,
        (hyp - lastPinchDistanceRef.current) / lastPinchDistanceRef.current,
        1
      ); 
      lastPinchDistanceRef.current = hyp
    }
  }
  const handleMouseMove = (e: React.MouseEvent) => _handleMovement(e, e.movementX, e.movementY)

  const _handleMovement = (e: React.UIEvent | UIEvent, movementX: number, movementY: number) => {
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
  }
  
  const handleMovementLeave = () => {
    isMovementStarted.current = false;
  }

  
  const handleScrolling = (e: WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let rect = canvasRef.current!!.getBoundingClientRect();
    _handleZooming(
      e.clientX - rect.left, 
      e.clientY - rect.top, 
      e.deltaY > 0 ? 1 - 1/e.deltaY : 1 + 1 / Math.abs(e.deltaY),
      1.1
    );
  }

  const _handleZooming = (centerX: number, centerY: number, zoom: number, scaleFactor: number) => {
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
  }

  const centerView = () => {
    let ctx = canvasRef.current?.getContext('2d');
    if (initTransformRef.current == null)
      return;
    ctx?.setTransform(initTransformRef.current!!);
    clear();
    draw(gs, canvasRef.current!!);
  };

  const resetView = () => {

  }

  useLayoutEffect(() => {
    let cv = canvasRef.current!!;
    let ctx = cv.getContext('2d')!!;
    if (initTransformRef.current != null) {
      return;
    }
    let s = Math.min(cv.clientWidth / gs.pageLayout.width, cv.clientHeight / gs.pageLayout.height);
    cv.width = cv.parentElement!!.clientWidth;
    cv.height = cv.parentElement!!.clientHeight;
    let initialScale = s - s * 0.05; // * dpi;
    ctx.scale(initialScale, initialScale);
    let center = ctx.getTransform().inverse().transformPoint({
      x: cv.width / 2, 
      y: cv.height / 2
    });
    let pageCenter = {x: gs.pageLayout.width / 2, y: gs.pageLayout.height / 2};
    ctx.translate(
      center.x - pageCenter.x,
      center.y - pageCenter.y
    );
    initTransformRef.current = ctx.getTransform();
  });

  useEffect(() => {
    let cv = canvasRef.current!!;
    cv.addEventListener('wheel', handleScrolling, {passive: false});
    cv.addEventListener('touchstart', handleTouchStart, {passive: false});
    cv.addEventListener('touchmove', handleTouchMove, {passive: false})
    clear();
    draw(gs, cv)
  }, [gs]);

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

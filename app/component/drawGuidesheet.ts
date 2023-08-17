import { FormattedGuideSheet, FormattedLine, FormattedLineStyle } from "../model/guidesheet"
import { Stroke } from "@/types";

function setStyleForLine(ls: FormattedLineStyle, ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = ls.color;
    ctx.lineCap = 'butt';
    if (ls.stroke == Stroke.Dash) {
        ctx.setLineDash([ls.dashLength ?? 3, ls.gap ?? 3]);
    } else if (ls.stroke == Stroke.Dotted) {
        ctx.lineCap = 'round';
        ctx.setLineDash([0, ls.gap ?? 3])
    } else ctx.setLineDash([])
    ctx.lineWidth = ls.width
}

function drawNibLadder(
    ctx: CanvasRenderingContext2D, 
    x: number,
    y: number,
    h: number,
    baseLineOffset: number,
    nw: number
){
    ctx.save();
    ctx.fillStyle = "black";
    ctx.beginPath();
    let nibsOverBaseline = Math.ceil(baseLineOffset / nw);
    let totalNibs = Math.ceil(h / nw);
    // -1 left, 1 right
    let side = nibsOverBaseline % 2 == 0 ? 1 : -1;
    ctx.translate(x + nw, y + baseLineOffset - nw * nibsOverBaseline);
    for (let i = 0; i < totalNibs; i++) {
        ctx.rect(0, i * nw, nw * side, nw);
        side = -side;
    }
    let clipPath = new Path2D();
    clipPath.rect(-nw, nw * nibsOverBaseline - baseLineOffset, 2 * nw, h);
    ctx.clip(clipPath);
    ctx.fill();
    ctx.restore();
}

function drawRow(
    ctx: CanvasRenderingContext2D, 
    gs: FormattedGuideSheet,
    x: number, 
    y: number, 
    width: number, 
    height: number,
    baseLineOffset: number,
    topLine: FormattedLine,
    bottomLine: FormattedLine
) {
    ctx.save();
    ctx.translate(x, y);
    // Nib stair
    if (gs.showNibDecoration) {
        drawNibLadder(ctx, 0, 0, height, baseLineOffset, gs.nibWidth)
    } 
    // Baseline
    setStyleForLine(gs.style[gs.row.baseline.style], ctx)
    ctx.beginPath();
    ctx.moveTo(0, baseLineOffset);
    ctx.lineTo(width, baseLineOffset)
    ctx.stroke();

    // Parallel lines
    ctx.save(); 
    ctx.translate(0, baseLineOffset)
    for (var line of gs.row.lines) {
        ctx.beginPath();
        setStyleForLine(gs.style[line.style], ctx);
        ctx.moveTo(0, line.offset);
        ctx.lineTo(width, line.offset);
        ctx.stroke();
    }
    ctx.restore();
    
    // LineEnds
    if (gs.row.lineEnds.isActive) {
        let topLineStyle = gs.style[topLine.style];
        let bottomLineStyle = gs.style[bottomLine.style];
        ctx.beginPath();
        setStyleForLine(gs.style[gs.row.lineEnds.style], ctx);
        ctx.moveTo(0, -topLineStyle.width/2);
        ctx.lineTo(0, height + bottomLineStyle.width / 2);
        ctx.moveTo(width, -topLineStyle.width/2);
        ctx.lineTo(width, height + bottomLineStyle.width / 2);
        ctx.stroke();
    }


    ctx.restore();

}

function drawRows(ctx: CanvasRenderingContext2D, gs: FormattedGuideSheet) {
    ctx.save();
    let minOffset = Number.MAX_VALUE;
    let maxOffset = Number.MIN_VALUE;
    let topLine = gs.row.baseline
    let bottomLine = gs.row.baseline
    for (var l of gs.row.lines) {
        if (l.offset < minOffset) {
            minOffset = l.offset
            topLine = l
        }
        else if (l.offset > maxOffset) {
            maxOffset = l.offset
            bottomLine = l
        }
    }
    let height = 0;
    if (minOffset < 0 && maxOffset > 0)
        height = - minOffset + maxOffset;
    else if (maxOffset < 0)
        height = - minOffset
    else height = maxOffset;
    let baseLineOffset = minOffset < 0 ? -minOffset : 0;
    let width = gs.pageLayout.width - gs.pageLayout.margin.right - gs.pageLayout.margin.left
    let yLimit = gs.pageLayout.height - gs.pageLayout.margin.bottom
    let x = gs.pageLayout.margin.left
    let y = gs.pageLayout.margin.top
    let clipPath = new Path2D();
    while (y + height <= yLimit) {
        clipPath.rect(x, y, width, height);
        drawRow(ctx, gs, x, y, width, height, baseLineOffset, topLine, bottomLine)
        y += height + gs.lineSpacing
    }

    // Diagonals
    if (gs.row.diagonals.isActive) {
        ctx.beginPath();
        setStyleForLine(gs.style[gs.row.diagonals.style], ctx);
        let gap = gs.row.diagonals.gap;
        let angleRad = gs.row.diagonals.angle * Math.PI / 180
        let sin = Math.sin(angleRad);
        let cos = Math.cos(angleRad);
        let w = Math.abs(gs.pageLayout.height * cos / sin);
        let margins = gs.pageLayout.margin;
        let xLow = cos > 0 ? margins. left - w : margins.left;
        let xHigh = cos > 0 ? margins.left : margins.left - w;
        while(xLow < gs.pageLayout.width - margins.right + gap) {
            ctx.moveTo(xLow, gs.pageLayout.height - margins.bottom);
            ctx.lineTo(xHigh, margins.top);
            xLow += gap;
            xHigh += gap;
        }
        ctx.clip(clipPath);
        ctx.stroke();
    } else {console.log("no diagonals")}
    ctx.restore();
}

function mmToVh(ctx: CanvasRenderingContext2D, value: number) {
    return value * 100 / ctx.canvas.clientHeight;
}

function drawTitleAndDate(ctx: CanvasRenderingContext2D, gs: FormattedGuideSheet) {
    if (!gs.showTitle && !gs.showDateLine)
        return;
    ctx.save();
    ctx.font = `${mmToVh(ctx, gs.titleTextSize)}vh ${gs.font}`;
    ctx.fillStyle = 'black';
    let padding = gs.titleBaselinePadding;
    if (gs.showTitle) {
        ctx.textAlign = 'left';
        ctx.fillText(
            gs.title ?? '', 
            gs.pageLayout.margin.left, 
            gs.pageLayout.margin.top - padding
        );
    }
    if (gs.showDateLine) {
        let dateOffset = gs.dateLineLength;
        let dateX = gs.pageLayout.width - gs.pageLayout.margin.right - dateOffset;
        let dateY = gs.pageLayout.margin.top - padding;
        ctx.textAlign = 'right';
        ctx.font = `${mmToVh(ctx, gs.dateTextSize)}vh Itim`;
        ctx.fillText('Date ', dateX, dateY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = gs.dateTextSize * 0.05;
        ctx.beginPath();
        ctx.lineCap = 'butt';
        ctx.moveTo(dateX, dateY);
        ctx.lineTo(gs.pageLayout.width - gs.pageLayout.margin.right, dateY);
        ctx.stroke();
    }
    ctx.restore();

}

export function draw(
    gs: FormattedGuideSheet, 
    cv: HTMLCanvasElement
) {
    let ctx = cv.getContext("2d")!!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, gs.pageLayout.width, gs.pageLayout.height);
    drawRows(ctx, gs);
    drawTitleAndDate(ctx, gs);
}


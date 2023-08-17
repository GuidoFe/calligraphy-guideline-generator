import { rgb,PDFPage, Color, LineCapStyle, pushGraphicsState, rectangle, clipEvenOdd, endPath, popGraphicsState, PDFOperator, PDFFont } from "pdf-lib";
import { FormattedGuideSheet, FormattedLine, FormattedLineStyle } from "../model/guidesheet"
import { Stroke } from "@/types";
import { hexToRgb} from "@/utils/ColorUtil"
import { RelativePoint } from "@/utils/RelativePoint";

function getColor(c: string): Color | null {
    let color = hexToRgb(c);
    if (color != null)
        return rgb(color.r / 255, color.g / 255, color.b / 255);
    else return null
}

function getStyleForLine(ls: FormattedLineStyle): {
        color: Color,
        dashArray?: number[],
        lineCap: LineCapStyle,
        thickness: number
} {
    return {
        color: getColor(ls.color) ?? rgb(0, 0, 0),
        dashArray: ls.stroke == Stroke.Dash ? [ls.dashLength ?? 3, ls.gap ?? 3] : undefined,
        lineCap: ls.stroke == Stroke.Dotted ? LineCapStyle.Round : LineCapStyle.Butt,
        thickness: ls.width
    }
}

function drawNibLadder(
        ctx: PDFPage, 
        x: number,
        y: number,
        h: number,
        baseLineOffset: number,
        nw: number
){
        let nibsUnderBaseline = Math.ceil(baseLineOffset / nw);
        // -1 left, 1 right
        let side = nibsUnderBaseline % 2 == 0 ? 1 : -1;
        let rp = new RelativePoint();
        rp.setOrigin(x + nw, y + baseLineOffset - nw * nibsUnderBaseline);
        let py = 0;
        ctx.pushOperators(
            pushGraphicsState(),
            rectangle(x, y, nw * 2, h),
            clipEvenOdd(),
            endPath()
        );
        while (py < y + h) {
            ctx.drawRectangle({
                ...rp.get({x: 0, y: py}),
                width: side * nw,
                height: nw,
                color: rgb(0, 0, 0)
            });
            py += nw;
            side *= -1;
        }
        ctx.pushOperators(popGraphicsState());
}

function drawRow(
    ctx: PDFPage, 
    gs: FormattedGuideSheet,
    x: number, 
    y: number, 
    width: number, 
    height: number,
    baseLineOffset: number,
    topLine: FormattedLine,
    bottomLine: FormattedLine
) {
    // Nib ladder
    if (gs.showNibDecoration) {
        drawNibLadder(ctx, x, y, height, baseLineOffset, gs.nibWidth)
    } 
    // Baseline
    ctx.drawLine({
        start: {x: x, y: y + baseLineOffset},
        end: {x: x + width, y: y + baseLineOffset},
        ...getStyleForLine(gs.style[gs.row.baseline.style])
    });

    // Parallel lines
    for (var line of gs.row.lines) {
        ctx.drawLine({
            start: {x: x, y: y + baseLineOffset + line.offset},
            end: {x: x + width, y: y + baseLineOffset + line.offset},
            ...getStyleForLine(gs.style[line.style])
        });
    }
    
    // LineEnds
    if (gs.row.lineEnds.isActive) {
        let topLineStyle = gs.style[topLine.style];
        let bottomLineStyle = gs.style[bottomLine.style];
        ctx.drawLine({
            start: {x: x, y: y - bottomLineStyle.width / 2},
            end: {x: x, y: y + height + topLineStyle.width / 2},
            ...getStyleForLine(gs.style[gs.row.lineEnds.style])
        }),
        ctx.drawLine({
            start: {x: x + width, y: y - bottomLineStyle.width / 2},
            end: {x: x + width, y: y + height + topLineStyle.width / 2},
            ...getStyleForLine(gs.style[gs.row.lineEnds.style])
        })
    }


}

function drawRows(ctx: PDFPage, gs: FormattedGuideSheet) {
    let minOffset = Number.MAX_VALUE;
    let maxOffset = Number.MIN_VALUE;
    let topLine = gs.row.baseline
    let bottomLine = gs.row.baseline
    let clips: PDFOperator[] = [];
    for (var l of gs.row.lines) {
        if (l.offset < minOffset) {
            minOffset = l.offset
            bottomLine = l
        }
        else if (l.offset > maxOffset) {
            maxOffset = l.offset
            topLine = l
        }
    }
    let height = maxOffset - minOffset;
    let baseLineOffset = -minOffset;
    let width = gs.pageLayout.width - gs.pageLayout.margin.right - gs.pageLayout.margin.left
    let x = gs.pageLayout.margin.left
    let y = gs.pageLayout.height - gs.pageLayout.margin.top - height;
    while (y >= gs.pageLayout.margin.bottom) {
        clips.push(rectangle(x, y, width, height));
        drawRow(ctx, gs, x, y, width, height, baseLineOffset, topLine, bottomLine)
        y -= (height + gs.lineSpacing);
    }

    // Diagonals
    if (gs.row.diagonals.isActive) {

        let gap = gs.row.diagonals.gap;
        let angleRad = gs.row.diagonals.angle * Math.PI / 180
        let sin = Math.sin(angleRad);
        let cos = Math.cos(angleRad);
        let w = Math.abs(gs.pageLayout.height * cos / sin);
        let margins = gs.pageLayout.margin;
        let xLow = cos > 0 ? margins. left - w : margins.left;
        let xHigh = cos > 0 ? margins.left : margins.left - w;
        let diagonalStyle = getStyleForLine(gs.style[gs.row.diagonals.style]);
        ctx.pushOperators(
            pushGraphicsState(),
            ...clips,
            clipEvenOdd(),
            endPath()
        )
        while(xLow < gs.pageLayout.width - margins.right + gap) {
            ctx.drawLine({
                start: {
                    x: xLow,
                    y: margins.bottom
                },
                end: {
                    x: xHigh,
                    y: gs.pageLayout.height - margins.top
                },
                ...diagonalStyle
            })
            xLow += gap;
            xHigh += gap;
        }
        ctx.pushOperators(popGraphicsState());
    }
}

function drawTitleAndDate(ctx: PDFPage, gs: FormattedGuideSheet, font: PDFFont) {
    if (!gs.showTitle && !gs.showDateLine) return;
    let padding = gs.titleBaselinePadding;
    let baseline = gs.pageLayout.height - gs.pageLayout.margin.top + padding;
    if (gs.showTitle) {
        ctx.drawText(gs.title ?? "", {
            x: gs.pageLayout.margin.left,
            y: baseline,
            size: gs.titleTextSize,
            font: font,
            color: rgb(0, 0, 0)
        })
    }
    if (gs.showDateLine) {
        let dateOffset = gs.dateLineLength;
        let dateX = gs.pageLayout.width - gs.pageLayout.margin.right - dateOffset;
        let dateY = baseline;
        let dateString = "Date ";
        ctx.drawText(dateString, {
            x: dateX - font.widthOfTextAtSize(dateString, gs.dateTextSize),
            y: dateY,
            color: rgb(0, 0, 0),
            font: font,
            size: gs.dateTextSize,
            
        });
        ctx.drawLine({
            start: {
                x: gs.pageLayout.width - gs.pageLayout.margin.right - dateOffset,
                y: baseline
            },
            end: {
                x: gs.pageLayout.width - gs.pageLayout.margin.right,
                y: baseline
            },
            thickness: gs.dateTextSize * 0.05,
            color: rgb(0, 0, 0),
            lineCap: LineCapStyle.Butt
        })
    }
}

export function draw(
   gs: FormattedGuideSheet, 
   ctx: PDFPage,
   font: PDFFont
) {
    ctx.drawRectangle({
        x: 0, 
        y: 0, 
        width: gs.pageLayout.width,
        height: gs.pageLayout.height,
        color: rgb(1, 1, 1)
    });
    drawRows(ctx, gs);
    drawTitleAndDate(ctx, gs, font);
}


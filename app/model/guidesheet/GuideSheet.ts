import { convertToMm } from '@/utils'
import {PageLayout, ParallelLine, DiagonalLine, Line, LineStyle, FormattedPageLayout, FormattedParallelLine, FormattedLine, FormattedDiagonalLine, FormattedLineStyle, getFormattedPageLayout, getFormattedLine, getFormattedLineStyle} from '.'
import { Measure, Unit } from '@/types'

export interface GuideSheet {
    showTitle: boolean,
    title?: string,
    showDateLine: boolean,
    pageLayout: PageLayout,
    lineSpacing: Measure,
    nibWidth: number,
    showNibDecoration: boolean,
    row: {
        ascender: ParallelLine,
        capline: ParallelLine,
        waistline: ParallelLine,
        baseline: Line,
        secondaryDescender: ParallelLine,
        descender: ParallelLine,
        diagonals: DiagonalLine,
        lineEnds: Line
    }
    style: Array<LineStyle>,
    titleTextSize: number,
    dateTextSize: number,
    font: string
}

export interface FormattedGuideSheet {
    showTitle: boolean,
    title?: string,
    showDateLine: boolean,
    pageLayout: FormattedPageLayout,
    lineSpacing: number,
    nibWidth: number,
    showNibDecoration: boolean,
    row: {
        lines: FormattedParallelLine[],
        baseline: FormattedLine,
        diagonals: FormattedDiagonalLine,
        lineEnds: FormattedLine
    }
    style: {[name: string]: FormattedLineStyle},
    titleBaselinePadding: number,
    dateLineLength: number,
    titleTextSize: number,
    dateTextSize: number,
    font: string
}

export function getFormattedGuideSheet(gs: GuideSheet): FormattedGuideSheet {
    let nw = gs.nibWidth;
    let styles: {[name: string]: FormattedLineStyle} = {};
    for (let style of gs.style) {
        styles[style.name] = getFormattedLineStyle(style, nw)
    }
    let xHeight = convertToMm(gs.row.waistline.offset.value, gs.row.waistline.offset.unit, nw);
    let waistLine: ParallelLine = {
        ...gs.row.waistline,
        //So xHeight will be added to the calculations, ending up with the previous offset value
        isOffsetFromBaseline: false,
        offset: {
            ...gs.row.waistline.offset,
            unit: Unit.mm,
            value: 0
        }
    }
    return {
        ...gs,
        pageLayout: getFormattedPageLayout(gs.pageLayout, nw),
        lineSpacing: convertToMm(gs.lineSpacing.value, gs.lineSpacing.unit, gs.nibWidth),
        row: {
            lines: [gs.row.ascender, gs.row.capline, waistLine, gs.row.secondaryDescender, gs.row.descender]
                .filter(l => l.isActive)
                .map(l => getFormattedLine(l, nw, xHeight) as FormattedParallelLine),
            baseline: getFormattedLine(gs.row.baseline, nw, xHeight),
            diagonals: getFormattedLine(gs.row.diagonals, nw, xHeight) as FormattedDiagonalLine,
            lineEnds: getFormattedLine(gs.row.lineEnds, nw, xHeight)
        },
        style: styles,
        titleBaselinePadding: 3,
        dateLineLength: 40,
    }
}

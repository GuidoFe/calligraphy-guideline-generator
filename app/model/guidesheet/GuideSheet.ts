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
        baseLine: Line,
        secondaryDescender: ParallelLine,
        descender: ParallelLine,
        diagonals: DiagonalLine,
        lineEnds: Line
    }
    style: LineStyle[]
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
    style: {[name: string]: FormattedLineStyle}
}

export function getFormattedGuideSheet(gs: GuideSheet): FormattedGuideSheet {
    let styles: {[name: string]: FormattedLineStyle} = {};
    for (let style of gs.style) {
        styles[style.name] = getFormattedLineStyle(style)
    }
    let xHeight = convertToMm(gs.row.waistline.offset.value, gs.row.waistline.offset.unit);
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
        pageLayout: getFormattedPageLayout(gs.pageLayout),
        lineSpacing: convertToMm(gs.lineSpacing.value, gs.lineSpacing.unit, gs.nibWidth),
        row: {
            lines: [gs.row.ascender, gs.row.capline, waistLine, gs.row.secondaryDescender, gs.row.descender]
                .filter(l => l.isActive)
                .map(l => getFormattedLine(l, gs.nibWidth, xHeight) as FormattedParallelLine),
            baseline: getFormattedLine(gs.row.baseline, gs.nibWidth, xHeight),
            diagonals: getFormattedLine(gs.row.diagonals, gs.nibWidth, xHeight) as FormattedDiagonalLine,
            lineEnds: getFormattedLine(gs.row.lineEnds, gs.nibWidth, xHeight)
        },
        style: styles
    }
}

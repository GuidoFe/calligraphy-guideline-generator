import {Color, Stroke, Measure} from '@/types'
import { convertToMm } from '@/utils'
export interface LineStyle {
    name: string,
    width: Measure,
    color: Color,
    stroke: Stroke,
    gap?: Measure,
    dashLength?: Measure
}

export interface FormattedLineStyle {
    name: string,
    width: number,
    color: Color,
    stroke: Stroke,
    gap?: number,
    dashLength?: number
}

export function getFormattedLineStyle(ls: LineStyle, nw: number): FormattedLineStyle {
    return {
        ...ls,
        width: convertToMm(ls.width.value, ls.width.unit, nw),
        gap: ls.gap !== undefined ? convertToMm(ls.gap.value, ls.gap.unit, nw) : undefined,
        dashLength: ls.dashLength !== undefined ? convertToMm(ls.dashLength.value, ls.dashLength.unit, nw) : undefined
    }
}

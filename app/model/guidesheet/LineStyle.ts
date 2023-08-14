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

export function getFormattedLineStyle(ls: LineStyle): FormattedLineStyle {
    return {
        ...ls,
        width: convertToMm(ls.width.value, ls.width.unit),
        gap: ls.gap !== undefined ? convertToMm(ls.gap.value, ls.gap.unit) : undefined,
        dashLength: ls.dashLength !== undefined ? convertToMm(ls.dashLength.value, ls.dashLength.unit) : undefined
    }
}

import {Measure} from "@/types";
import { convertToMm } from "@/utils";
export interface Line {
    name: string,
    isOptional: boolean,
    isActive: boolean,
    style: string
    possibleStyles: string[]
}

export interface ParallelLine extends Line {
    isOffsetFromBaseline: boolean
    offset: Measure,
    customOffsetName?: string
}

export interface DiagonalLine extends Line {
    angle: number,
    gap: Measure
}

export interface FormattedLine {
    name: string,
    isOptional: boolean,
    isActive: boolean,
    style: string
}

export interface FormattedParallelLine extends FormattedLine {
    //offset from baseline. Negative if it's over the baseline.
    offset: number,
}

export interface FormattedDiagonalLine extends FormattedLine {
    angle: number,
    gap: number
}

export function getFormattedLine(line: Line, nb: number, xHeight: number): FormattedLine {
    let p = line as ParallelLine
    if (p.isOffsetFromBaseline != undefined) {
        return {
            ...p,
            offset: (p.isOffsetFromBaseline ? 1 : -1) * (convertToMm(p.offset.value, p.offset.unit, nb) + (p.isOffsetFromBaseline ? 0 : xHeight)),
            isOffsetFromBaseline: undefined
        } as FormattedParallelLine;
    }
    let d = line as DiagonalLine;
    if (d.gap != undefined) {
        return {
            ...d,
            angle: d.angle,
            gap: convertToMm(d.gap.value, d.gap.unit, nb)
        } as FormattedDiagonalLine;
    }
    return {
        ...line,
        possibleStyles: undefined
    } as FormattedLine;
}

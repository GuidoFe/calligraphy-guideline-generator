import {Unit} from '@/types/Unit'
export function convertToMm(value: number, from: Unit, pw: number): number {
    switch(from) {
        case Unit.mm: return value
        case Unit.cm: return value * 10
        case Unit.in: return value / 0.0393700787
        case Unit.pt: return value / 2.8346438836889 
        case Unit.nw: return value * pw
    }
}

export function convertFromMm(value: number, to: Unit, pw: number) {
    switch(to) {
        case Unit.mm: return value
        case Unit.cm: return value / 10 
        case Unit.in: return value * 0.0393700787
        case Unit.pt: return value * 2.8346438836889
        case Unit.nw: return value / pw
    }
}

export function convertUnit(value: number, from: Unit, to: Unit, pw: number): number {
    return convertFromMm(convertToMm(value, from, pw), to, pw);
}

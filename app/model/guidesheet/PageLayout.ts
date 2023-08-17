import {Measure, Unit} from '@/types'
import {convertToMm} from '@/utils'

export enum PageDimension {A5 = "A5", A4 = "A4", Letter = "Letter", A3 = "A3", Custom = "Custom"}

export function getPageDimension(layout: PageLayout, nw: number): {w: number, h: number} {
    let d: {w: number, h: number} = {w: 0, h: 0}
    switch(layout.dimensions) {
        case PageDimension.A5: 
            d = {
                w: 148,
                h: 210
            }; break;
        case PageDimension.A4: 
            d = {
                w: 210,
                h: 297
            }; break;
        case PageDimension.Letter: 
            d = {
                w: 216,
                h: 279
            }; break;
        case PageDimension.A3: 
            d = {
                w: 297,
                h: 420
            }; break;
        case PageDimension.Custom: 
            d = {
                w: convertToMm(layout.width.value, layout.width.unit, nw),
                h: convertToMm(layout.height.value, layout.height.unit, nw),
            }; break;
    }
    let min = Math.min(d.w, d.h);
    let max = Math.max(d.w, d.h);
    return {
        w: layout.isPortrait ? min : max,
        h: layout.isPortrait ? max : min
    };

}

export interface Margins {
    left: number,
    right: number,
    top: number,
    bottom: number,
    unit: Unit 
}

export interface FormattedMargins {
    left: number,
    right: number,
    top: number,
    bottom: number,
}

export interface PageLayout {
    dimensions: PageDimension
    width: Measure,
    height: Measure,
    isPortrait: boolean,
    margin: Margins,
}

export interface FormattedPageLayout {
    width: number,
    height: number,
    isPortrait: boolean,
    margin: FormattedMargins
}

export function getFormattedPageLayout(p: PageLayout, nw: number): FormattedPageLayout {
    let dimensions = getPageDimension(p, nw);
    return {
        isPortrait: p.isPortrait,
        width: dimensions.w,
        height: dimensions.h,
        margin: {
            left: convertToMm(p.margin.left, p.margin.unit, nw),
            right: convertToMm(p.margin.right, p.margin.unit, nw),
            top: convertToMm(p.margin.top, p.margin.unit, nw),
            bottom: convertToMm(p.margin.bottom, p.margin.unit, nw)
        }
    }
}

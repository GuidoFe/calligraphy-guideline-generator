import { PageDimension, PageLayout } from "@/app/model/guidesheet";

export function pageTypeToDimensions(p: PageDimension): {w: number, h: number} {
    switch(p) {
        case PageDimension.A3: return {w: 297, h:420};
        case PageDimension.A4: return {w: 210, h: 297};
        case PageDimension.A5: return {w: 148.5, h: 210};
        case PageDimension.Letter: return {w: 216, h: 279};
        default: return {w: 0, h: 0}
    }
}

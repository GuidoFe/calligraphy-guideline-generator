'use client'
import { GuideSheet, LineStyle, PageDimension } from '@/app/model/guidesheet';
import { Stroke, Unit } from '@/types';

let styles: LineStyle[] = [
        {
            name: "Thick Line",
            width: { value: 0.5, unit: Unit.mm, allowPW: false},
            color: "#000000",
            stroke: Stroke.Solid,
        },
        {
            name: "Medium Line",
            width: { value: 0.3, unit: Unit.mm, allowPW: false},
            color: "#000000",
            stroke: Stroke.Solid,
        },
        {
            name: "Thin Line",
            width: { value: 0.1, unit: Unit.mm, allowPW: false},
            color: "#000000",
            stroke: Stroke.Solid,
        },
        {
            name: "Custom A",
            width: { value: 0.5, unit: Unit.mm, allowPW: false},
            color: "#000000",
            stroke: Stroke.Dash,
            gap: { value: 3, unit: Unit.mm, allowPW: true},
            dashLength: { value: 3, unit: Unit.mm, allowPW: true}
            
        },
        {
            name: "Custom B",
            width: { value: 0.5, unit: Unit.mm, allowPW: false},
            color: "#000000",
            stroke: Stroke.Dotted,
            gap: { value: 3, unit: Unit.mm, allowPW: true}
        },
    ]

let styleNames: string[] = styles.map(s => s.name);

let defaultGuideSheet: GuideSheet = {
    showTitle: false,
    showDateLine: false,
    pageLayout: {
        dimensions: PageDimension.A4,
        width: { value: 21, unit: Unit.cm, allowPW: false},
        height: { value: 29.7, unit: Unit.cm, allowPW: false},
        isPortrait: true,
        margin: {
            left: 10,
            right: 10,
            top: 15,
            bottom: 10,
            unit: Unit.mm
        }
    },
    lineSpacing: {
        value: 2,
        unit: Unit.nw,
        allowPW: true
    },
    nibWidth: 3.8,
    showNibDecoration: true,
    row: {
        ascender: {
            name: "Ascender",
            isOptional: true,
            isActive: true,
            style: "Medium Line",
            isOffsetFromBaseline: false,
            offset: {value: 2, unit: Unit.nw, allowPW: true},
            possibleStyles: styleNames
        },
        capline: {
            name: "Capline",
            isOptional: true,
            isActive: false,
            style: "Medium Line",
            isOffsetFromBaseline: false,
            offset: {value: 1, unit: Unit.nw, allowPW: true},
            possibleStyles: styleNames
        },
        waistline: {
            name: "Waistline",
            isOptional: false,
            isActive: true,
            style: "Medium Line",
            isOffsetFromBaseline: true,
            offset: {value: 5, unit: Unit.nw, allowPW: true},
            possibleStyles: styleNames
        },
        baseline: {
            name: "Baseline",
            isOptional: false,
            isActive: true,
            style: "Medium Line",
            possibleStyles: styleNames
        },
        secondaryDescender: {
            name: "Secondary Descender",
            isOptional: true,
            isActive: false,
            style: "Medium Line",
            isOffsetFromBaseline: true,
            offset: {value: 1, unit: Unit.nw, allowPW: true},
            possibleStyles: styleNames
        },
        descender: {
            name: "Descender",
            isOptional: true,
            isActive: true,
            style: "Medium Line",
            isOffsetFromBaseline: true,
            offset: {value: 2, unit: Unit.nw, allowPW: true},
            possibleStyles: styleNames
        },
        diagonals: {
            name: "Diagonals",
            isOptional: true,
            isActive: true,
            style: "Thin Line",
            angle: 45,
            gap: { value: 3, unit: Unit.cm, allowPW: true},
            possibleStyles: styleNames
        },
        lineEnds: {
            name: "Line Ends",
            isOptional: true,
            isActive: true,
            style: "Medium Line", 
            possibleStyles: styleNames
        }
    },
    style: styles,
    font: "Libre Baskerville",
    titleTextSize: 6,
    dateTextSize: 6
}

export default defaultGuideSheet;

import { GuideSheet, getFormattedGuideSheet } from '@/app/model/guidesheet/GuideSheet';
import { draw } from './drawPdfGuidesheet';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import * as fs from 'fs';

export async function generatePdf( gs: GuideSheet ): Promise<Uint8Array> {
    let fgs = getFormattedGuideSheet(gs);
    let doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);
    let page = doc.addPage([fgs.pageLayout.width, fgs.pageLayout.height])
    let scaleFactor = 1 / 0.352777777552;
    page.scale(scaleFactor, scaleFactor);
    let font = await doc.embedFont(fs.readFileSync('./public/fonts/LibreBaskerville-Regular.ttf'));
    draw(fgs, page, font);
    return doc.save();
}

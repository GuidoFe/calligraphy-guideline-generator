import { GuideSheet, getFormattedGuideSheet } from '@/app/model/guidesheet/GuideSheet';
import { draw } from './drawPdfGuidesheet';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generatePdf( gs: GuideSheet ): Promise<Uint8Array> {
    let fgs = getFormattedGuideSheet(gs);
    let doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);
    let page = doc.addPage([fgs.pageLayout.width, fgs.pageLayout.height])
    let scaleFactor = 1 / 0.352777777552;
    page.scale(scaleFactor, scaleFactor);
    let absoluteUrl = window.location.protocol + "//" + window.location.host;
    let fontUrl = new URL(`${absoluteUrl}/fonts/LibreBaskerville-Regular.ttf`);
    let font = await doc.embedFont(
        await fetch(fontUrl).then(res => res.arrayBuffer()),
        {
            //subset: true,
            //features: {"kern": true, "rvrn": true, "calt": true, "liga": false, "dlig": false}
            //features: {"kern": false, "rvrn": false, "calt": false, "liga": false, "dlig": false}
        }
    );
    draw(fgs, page, font);
    return doc.save();
}

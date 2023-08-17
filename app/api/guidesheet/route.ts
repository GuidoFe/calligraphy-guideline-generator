import {DocumentFactory} from '@/app/factory/DocumentFactory';
import { GuideSheet } from '@/app/model/guidesheet';
import { NextApiResponse } from 'next';

export async function POST(request: Request, response: NextApiResponse) {
    //let gs = (await request.json()) as GuideSheet;
    //let doc = new pdfkit.PDFDocument();
    //doc.pipe(response);
    //let factory = new DocumentFactory(doc);
    //factory.generate(gs);
    //doc.end();
    return response;
}

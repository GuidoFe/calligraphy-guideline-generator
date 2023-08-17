import { generatePdf } from '@/app/service/DocumentService';
import { GuideSheet } from '@/app/model/guidesheet';
import filenamify from 'filenamify/browser';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    let obj = await req.json();
    if (obj.lineSpacing === undefined) {
        return NextResponse.json({error: "Object is not valid"}, {status: 400})
    }
    let gs = obj as GuideSheet;
    let array = await generatePdf(gs);
    let title = "guideline";
    if (gs.title !== undefined) {
        title = filenamify(gs.title, {replacement: "_"});
    }
    return new Response(array, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${title}.pdf`
        }
    });
}

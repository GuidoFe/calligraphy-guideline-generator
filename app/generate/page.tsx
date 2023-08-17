'use client'
import {useState} from 'react'
import { PagePreview } from '@/app/component/PagePreview';
import { GuideSheetForm } from '../component/FormComponents';
import '@/app/sass/form.scss'
import defaultGuideSheet from './defaultConfig';
import { draw } from '../component/drawGuidesheet';
import { getFormattedGuideSheet } from '../model/guidesheet';
import { DocumentFactory, generatePdf } from '../factory/DocumentFactory';


export default function Page() { 
  const [guideSheet, setGuideSheet] = useState(defaultGuideSheet);
  const generate = () => {
    generatePdf(guideSheet).then(arr => {
      const blob = new Blob([arr], {type: 'application/pdf'});
      const a = document.createElement("a");
      a.href=window.URL.createObjectURL(blob);
      a.download = "guidesheet.pdf";
      a.style.position = "fixed";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  return (
  <main className="min-h-screen">
    <div className="generator-page columns">
      <div className="form-column column is-gapless">
        <div>
          <div className="title is-2">Guidesheet Generator</div>
          <GuideSheetForm node={guideSheet} updateNode={(n) => setGuideSheet(n)}/>
        </div>
      </div>
      <div className="preview-column column is-three-fifths">
        <PagePreview gs={guideSheet}/>
      </div>
    </div>
    <button id="generate-button" className="button is-primary" onClick={generate}>
      Generate
    </button>
  </main>
  );
}

'use client'
import {useState} from 'react'
import { PagePreview } from '@/app/component/PagePreview';
import { GuideSheetForm } from './component/FormComponents';
import '@/app/sass/form.scss'
import defaultGuideSheet from '@/conf/defaultConfig';

export default function Page() { 
  const [guideSheet, setGuideSheet] = useState(defaultGuideSheet);
  const generate = () => {
    if (window === undefined) return;
    fetch("/api/guidesheet", {
      method: "POST", 
      body: JSON.stringify(guideSheet),
      headers: new Headers([
        ["Accept", "application/pdf"],
        ["Content-Type", "application/json"]
      ])
    }).then(res => res.blob()).then(blob => {
      let file = URL.createObjectURL(blob);
      window.open(file, "_blank");
    });
  }

  return (
  <main className="min-h-screen">
    <div className="generator-page columns">
      <div className="form-column column is-gapless">
        <div>
          <div className="title is-2">Guidesheet Generator</div>
          <GuideSheetForm 
            node={guideSheet} 
            updateNode={(n) => setGuideSheet(n)} 
            nw={guideSheet.nibWidth} 
            setNw={(n: number) => setGuideSheet({...guideSheet, nibWidth: n})}
          />
        </div>
      </div>
      <button id="generate-button" className="button is-primary is-large" onClick={generate}>
        Generate
      </button>
      <div className="preview-column column is-three-fifths">
        <PagePreview gs={guideSheet}/>
      </div>
    </div>
  </main>
  );
}

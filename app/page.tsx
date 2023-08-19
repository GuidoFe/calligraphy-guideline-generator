'use client'
import {useState} from 'react'
import { Footer } from './component/Footer';
import { PagePreview } from '@/app/component/PagePreview';
import { GuideSheetForm } from './component/FormComponents';
import '@/app/sass/form.scss'
import defaultGuideSheet from '@/conf/defaultConfig';
import NavBar from './component/NavBar';
import { StylesForm } from './component/FormComponents/StylesForm';

export default function Page() { 
  const [guideSheet, setGuideSheet] = useState(defaultGuideSheet);
  const [isLoading, setIsLoading] = useState(false);
  const generate = () => {
    if (window === undefined) return;
    setIsLoading(true);
    fetch("/api/guidesheet", {
      method: "POST", 
      body: JSON.stringify(guideSheet),
      headers: new Headers([
        ["Accept", "application/pdf"],
        ["Content-Type", "application/json"]
      ])
    }).then(res => res.blob()).then(blob => {
      let file = URL.createObjectURL(blob);
      setIsLoading(false);
      window.open(file, "_blank");
    });
  }

  return (
  <div>
  <main>
    <div className="generator-page">
      <div className="">
        <NavBar generate={generate} isLoading={isLoading} />
        <div className="main-column-group">
          <div className="form-column">
            <div>
              <GuideSheetForm 
                node={guideSheet} 
                updateNode={(n) => setGuideSheet(n)} 
                nw={guideSheet.nibWidth} 
                setNw={(n: number) => setGuideSheet({...guideSheet, nibWidth: n})}
              />
            </div>
          </div>
          <div className="preview-column">
            <PagePreview gs={guideSheet}/>
          </div>
          <div className="styles-column">
            <hr id="hr-styles"/>
            <StylesForm node={guideSheet.style} nw={guideSheet.nibWidth} updateNode={(a) => {
              setGuideSheet({
                ...guideSheet,
                style: a
              });
            }}/>
          </div>
          <div className="footer-mobile">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  </main>
  </div>
  );
}

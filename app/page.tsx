'use client'
import {useCallback, useEffect, useRef, useState} from 'react'
import { Footer } from './component/Footer';
import { PagePreview } from '@/app/component/PagePreview';
import { GuideSheetForm } from './component/FormComponents';
import '@/app/sass/form.scss'
import defaultGuideSheet from '@/conf/defaultConfig';
import NavBar from './component/NavBar';
import { StylesForm } from './component/FormComponents/StylesForm';
import { GuideSheet } from './model/guidesheet';

const CURRENT_VERSION = 1;

function generate(gs: GuideSheet, onEndCallback: () => void) {
    if (window === undefined) return;
    fetch("/api/guidesheet", {
      method: "POST", 
      body: JSON.stringify(gs),
      headers: new Headers([
        ["Accept", "application/pdf"],
        ["Content-Type", "application/json"]
      ])
    }).then(res => res.blob()).then(blob => {
      let file = URL.createObjectURL(blob);
      onEndCallback();
      window.open(file, "_blank");
    });
}
export default function Page() { 
  const [guideSheet, setGuideSheet] = useState<GuideSheet | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (guideSheet == null) {
      let version = window.localStorage.getItem('version');
      if (version == null || isNaN(parseInt(version)) || parseInt(version) < CURRENT_VERSION ) {
        window.localStorage.removeItem('gs');
        setGuideSheet(defaultGuideSheet)
        window.localStorage.setItem('version', CURRENT_VERSION.toString());
        return;
      }
      let savedGuidesheet = window.localStorage.getItem('gs');
      if (savedGuidesheet == null) {
        setGuideSheet(defaultGuideSheet);
        return;
      }
      let parsedGuidesheet: GuideSheet | null = null;
      try {
        parsedGuidesheet = JSON.parse(savedGuidesheet) as GuideSheet;
      } catch {
        parsedGuidesheet = null;
      }
      setGuideSheet(parsedGuidesheet ?? defaultGuideSheet);
    } else {
      window.localStorage.setItem('gs', JSON.stringify(guideSheet))
    }
  }, [guideSheet]);

  return (
  <div>
  <main>
    <div className="generator-page">
      <div className="">
        <NavBar 
          generate={() => {
            if (!guideSheet) return;
            setIsLoading(true);
            generate(guideSheet, () => {setIsLoading(false)});
          }} 
          reset={() => setGuideSheet(defaultGuideSheet)}
          isLoading={isLoading} />
        {guideSheet != null &&
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
        }
      </div>
    </div>
  </main>
  </div>
  );
}

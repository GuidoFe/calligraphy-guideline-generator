'use client'
import {useState} from 'react'
import { PagePreview } from '@/app/component/PagePreview';
import { GuideSheetForm } from './component/FormComponents';
import '@/app/sass/form.scss'
import defaultGuideSheet from '@/conf/defaultConfig';
import { TbBrandGithubFilled } from 'react-icons/tb';
import Image from 'next/image';
import NavBar from './component/NavBar';

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
  <div>
  <main>
    <div className="generator-page">
      <div className="">
        <NavBar generate={generate} />
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
        </div>
      </div>
    </div>
  </main>
  </div>
  );
}

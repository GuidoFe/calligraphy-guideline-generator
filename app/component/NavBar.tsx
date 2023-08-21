'use client'
import '@/app/sass/form.scss'
import classNames from 'classnames';
import Image from 'next/image';

export default function NavBar(props: {
  generate: () => void,
  reset: () => void,
  isLoading: boolean
}) { 

  return (
  <div className="nav NavBar">
    <div className="nav-brand">
      <div className="nav-item">
        <Image src="/favicon.svg" alt="logo" width={30} height={30}/>
      </div>
    </div>
    <span className="title is-size-2-desktop is-size-3-touch">Guidesheet Generator</span>
    <button 
      id="reset-button" 
      className={classNames('button', 'is-danger', 'is-outlined', 'is-large', 'is-responsive')} 
      onClick={props.reset}
      type="button"
    >
      Reset
    </button>
    <button 
      id="generate-button" 
      className={classNames('button', 'is-primary', 'is-large', 'is-responsive', {'is-loading': props.isLoading})} 
      onClick={props.generate}
    >
      Generate
    </button>
  </div>
  );
}

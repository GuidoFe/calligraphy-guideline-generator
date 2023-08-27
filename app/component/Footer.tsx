import { TbBrandGithub, TbHeart, TbMail } from "react-icons/tb";
import { SiKofi} from 'react-icons/si'
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="Footer">
      <p className="is-size-7">
      Created with <TbHeart /> by Guido Ferri. <TbBrandGithub /> <a 
          href="https://github.com/GuidoFe/calligraphy-guideline-generator"
          target="_blank">Repo</a> <TbMail /> <a href="mailto:guido.ferri@protonmail.com">
          Mail</a> <SiKofi /> <a href="https://ko-fi.com/Y8Y367Y7T" target="_blank">Support me on Ko-fi</a>
      </p>
    </footer>
  )

}

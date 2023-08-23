import { TbBrandGithub, TbHeart, TbMail } from "react-icons/tb";

export function Footer() {
  return (
    <footer className="Footer">
      <p className="is-size-7">
      Created with <TbHeart /> by Guido Ferri. <a 
        href="https://github.com/GuidoFe/calligraphy-guideline-generator"
        target="_blank">
          <TbBrandGithub /> Repo
        </a> <a href="mailto:guido.ferri@protonmail.com">
          <TbMail /> Mail
        </a>
      </p>
    </footer>
  )

}

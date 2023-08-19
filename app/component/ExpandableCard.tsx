'use client'
import React, {ReactNode, useState} from 'react'
import classNames from 'classnames';
import {TbChevronUp, TbChevronDown} from 'react-icons/tb';

export function ExpandableCard (props: { children: ReactNode | ReactNode[], title: string, startExpanded: boolean}){
  let [isExpanded, setExpanded] = useState(props.startExpanded);
  return (
    <div className="card">
      <header className="card-header" onClick={_ =>
          setExpanded(!isExpanded)
        }> 
        <p className="card-header-title">{props.title}</p>
        <button className="card-header-icon card-toggle" type="button">
          <span className="icon">
            {isExpanded ? <TbChevronUp /> : <TbChevronDown />}
          </span>
				</button>
      </header>
      <div className={classNames("card-content", {"is-hidden": !isExpanded})}>
        {props.children}
      </div>
    </div>
  )
}

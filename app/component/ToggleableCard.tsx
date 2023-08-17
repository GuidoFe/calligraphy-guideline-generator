'use client'
import React, {ReactNode, useState} from 'react'
import classNames from 'classnames';
import {TbChevronUp, TbChevronDown} from 'react-icons/tb';

export function ToggleableCard (props: { 
  children: ReactNode | ReactNode[], 
  title: string, 
  isActivable?: boolean,
  isActive: boolean,
  isExpandable: boolean,
  startExpanded?: boolean,
  onToggle: () => void
}){
  let [isExpanded, setExpanded] = useState(props.startExpanded ?? true);
  return (
    <div className="card">
      <header className={
        classNames(
          "card-header", 
          {
            "has-background-white-ter": !props.isActive,
          }
        )} 
        onClick={ props.isExpandable && props.isActive ? (_) => setExpanded(!isExpanded) : undefined}
      > 
        <div className={classNames("card-header-title", "is-size-5", {"has-text-grey": !props.isActive})}>
          {props.isActivable !== false &&
            <input className="mr-2" type="checkbox" checked={props.isActive} onChange={() => {
              if (props.isActive)
                setExpanded(false);
              props.onToggle()
            }}/>
          }
          {props.title}
        </div>
        { props.isExpandable && props.isActive &&
          <button className="card-header-icon card-toggle" type="button">
            <span className="icon">
              {isExpanded && props.isActive ? <TbChevronUp /> : <TbChevronDown />}
            </span>
				  </button> }
      </header>
      <div className={classNames("card-content", {"is-hidden": !isExpanded || !props.isActive})}>
        {props.children}
      </div>
    </div>
  )
}

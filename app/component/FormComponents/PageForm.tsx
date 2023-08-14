'use client'
import React, {useEffect} from 'react' 
import { PageLayout, PageDimension } from '@/app/model/guidesheet';
import { FormProps, Measure} from '@/types'
import { MeasureField } from '.';
import { convertToMm } from '@/utils';
import classNames from 'classnames';
import {TbFile, TbFileHorizontal} from 'react-icons/tb'
import { IconType } from 'react-icons';

function isPortrait(w: Measure, h: Measure): boolean {
  return convertToMm(w.value, w.unit) < convertToMm(h.value, h.unit)
}



export function PageForm (props: FormProps<PageLayout>){
  const OrientationButton = (props: {icon: IconType, isActive: boolean, onClick: () => void}) => {
    return (
      <button
        type="button"
        className={classNames(
          "button", 
          {
            "is-info": props.isActive, 
            "is-selected": props.isActive
          })
        }
        onClick={props.onClick}
      >
        <span className="icon">
          {props.icon({})}
        </span>
      </button>

    )
  }

  return (
  <div>
    <fieldset className="fieldset my-4">
    <legend>Page</legend>
    <div className="field">
      <label className="label">Dimension</label>
      <div className="control">
        <div className="select">
          <select value={props.node.dimensions.toString()} onChange={o => {
            let newDimension = PageDimension[o.target.value as keyof typeof PageDimension]
            props.updateNode({
              ...props.node,
              isPortrait: newDimension == PageDimension.Custom ? isPortrait(props.node.width, props.node.height) : props.node.isPortrait,
              dimensions: newDimension 
            })
          }}>
          {Object.keys(PageDimension)
            .map((key) =>
              <option value={key} key={key}>{key}</option>
          )}    
          </select>
        </div>
      </div>
    </div>
    {props.node.dimensions == PageDimension.Custom &&
      <div>
        <MeasureField label="Width" node={props.node.width} updateNode={n => {
            props.updateNode({
                ...props.node,
                isPortrait: isPortrait(n, props.node.height),
                width: n
            })
        }} />
        <MeasureField label="Height" node={props.node.height} updateNode={n => {
            props.updateNode({
                ...props.node,
                isPortrait: isPortrait(props.node.width, n),
                height: n
            })
        }}/>
      </div>

    }
    <div className="field my-3">
      <div className="control">
        <div className="buttons has-addons">
          <OrientationButton icon={TbFile} isActive={props.node.isPortrait} onClick={() =>
            props.updateNode({
              ...props.node,
              isPortrait: true
            })
          }/>
          <OrientationButton icon={TbFileHorizontal} isActive={!props.node.isPortrait} onClick={() =>
            props.updateNode({
              ...props.node,
              isPortrait: false
            })
          }/>
        </div>
      </div>
    </div>

    </fieldset>

  </div>
  )
}

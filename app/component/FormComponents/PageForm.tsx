'use client'
import React from 'react' 
import { PageLayout, PageDimension } from '@/app/model/guidesheet';
import { FormProps, Measure} from '@/types'
import { MeasureField } from '.';
import { convertToMm } from '@/utils';
import classNames from 'classnames';
import {TbFile, TbFileHorizontal} from 'react-icons/tb'
import { IconType } from 'react-icons';

function isPortrait(w: Measure, h: Measure, nw: number): boolean {
  return convertToMm(w.value, w.unit, nw) < convertToMm(h.value, h.unit, nw);
}

function OrientationButton(p: {icon: IconType, isActive: boolean, onClick: () => void}) {
  return (
    <button
      type="button"
      className={classNames(
        "button", 
        {
          "is-info": p.isActive, 
          "is-selected": p.isActive
        })
      }
      onClick={p.onClick}
    >
      <span className="icon">
        {p.icon({})}
      </span>
    </button>
  )
}

export function PageForm (props: FormProps<PageLayout>){
  return (
  <div>
    <div className="field">
      <label className="label">Dimension</label>
      <div className="control">
        <div className="select">
          <select value={props.node.dimensions.toString()} onChange={o => {
            let newDimension = PageDimension[o.target.value as keyof typeof PageDimension]
            props.updateNode({
              ...props.node,
              isPortrait: newDimension == PageDimension.Custom ? isPortrait(props.node.width, props.node.height, props.nw) : props.node.isPortrait,
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
                isPortrait: isPortrait(n, props.node.height, props.nw),
                width: n
            })
        }} nw={props.nw} />
        <MeasureField label="Height" node={props.node.height} updateNode={n => {
            props.updateNode({
                ...props.node,
                isPortrait: isPortrait(props.node.width, n, props.nw),
                height: n
            })
        }} nw={props.nw}/>
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
  </div>
  )
}

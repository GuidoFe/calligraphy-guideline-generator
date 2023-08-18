'use client'
import React, { useMemo } from 'react'
import { Line, ParallelLine, DiagonalLine } from '@/app/model/guidesheet';
import { FormProps} from '@/types'
import { DiagonalLineFormPart, ParallelLineFormPart } from '.';
import { ToggleableCard } from '../ToggleableCard';

interface LineFormProps extends FormProps<Line> {
    isActivable?: boolean
  }

function completeForm(props: LineFormProps) {
    if ('angle' in props.node)
      return <DiagonalLineFormPart node={props.node as DiagonalLine} updateNode={n => {
        props.updateNode({
            ...props.node,
            ...n
        })
    }} nw={props.nw}/>
    else if ('offset' in props.node)
      return <ParallelLineFormPart node={props.node as ParallelLine} updateNode={n => {
      props.updateNode({
        ...props.node,
        ...n
      })
      }} nw={props.nw}/>
    else return null
  }

export function LineForm (props: LineFormProps){
  const rows = useMemo(() => {
    let r = [];
    for (var style of props.node.possibleStyles) {
      r.push(<option value={style} key={style}>{style}</option>)
    };
    return r;
  }, [props.node.possibleStyles]);

  return (
    <div className="my-3">
    <ToggleableCard 
      title={props.node.name} 
      isActive={props.node.isActive} 
      isExpandable={true}
      startExpanded={true}
      isActivable={props.isActivable}
      onToggle={() => {
        props.updateNode({
          ...props.node,
          isActive: !props.node.isActive
        })
      }

    }>
      <div className="field">
        <label className="label">Style</label>
        <div className="control">
          <div className="select">
            <select value={props.node.style} onChange={o => {
              props.updateNode({
                ...props.node,
                style: o.target.value
              });
            }}>
            {rows}
            </select>
          </div>
        </div>
      </div>
      {completeForm(props)}
    </ToggleableCard>
    </div>
  )
}

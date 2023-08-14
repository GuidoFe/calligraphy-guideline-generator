'use client'
import React from 'react'
import { LineStyle } from '@/app/model/guidesheet/LineStyle';
import { Measure, FormProps, Stroke, Unit } from '@/types'
import { ColorControl } from './ColorControl';
import { MeasureField } from '.';
import { ExpandableCard } from '../ExpandableCard';

export function LineStyleForm (props: FormProps<LineStyle>){
  return (
    <div className="LineStyleForm my-3">
      <ExpandableCard title={props.node.name} startExpanded={false}>
        <div className="field">
          <label className="label">Width</label>
          <MeasureField  isExpanded={false} node={props.node.width} updateNode={(n: Measure) => {
            props.updateNode({
              ...props.node,
              width: n
            });
          }}/>
        </div>

        <div className="field">
          <label className="label">Stroke</label> 
          <div className="control">
            <div className="field is-grouped">
              <div className="control">
                <div className="select">
                  <select value={props.node.stroke.toString()} onChange={o => {
                    props.updateNode({
                      ...props.node,
                      stroke: Stroke[o.target.value as keyof typeof Stroke]
                    })
                  }}>
                    {Object.keys(Stroke).map(key => 
                      <option key={key} value={key}>{key}</option>
                    )}
                  </select>
                </div>
              </div>
              <ColorControl node={props.node.color} updateNode={c => {
                 props.updateNode({
                   ...props.node,
                   color: c
                 })
              }}/>
            </div>
          </div>
        </div>
        {props.node.stroke == Stroke.Dash &&
          <MeasureField isExpanded={false} label="Dash Length" node={props.node.dashLength ?? {value: 3, unit: Unit.mm, allowPW: true}} updateNode={n => {
            props.updateNode({
              ...props.node,
              dashLength: n
            });      
          }}/>
        }
        {props.node.stroke != Stroke.Solid &&
          <MeasureField isExpanded={false} label="Gap" node={props.node.gap ?? {value: 3, unit: Unit.mm, allowPW: true}} updateNode={n => {
            props.updateNode({
              ...props.node,
              gap: n
            });      
          }}/>
        }
      </ExpandableCard>
    </div>
  )
}

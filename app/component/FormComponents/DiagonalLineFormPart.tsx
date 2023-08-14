'use client'
import React, {useState} from 'react'
import { DiagonalLine } from '@/app/model/guidesheet';
import { FormProps } from '@/types'
import { MeasureField } from '.';

export function DiagonalLineFormPart (props: FormProps<DiagonalLine>){
  const [angle, setAngle] = useState(props.node.angle.toString());
  return (
  <div>
    <div className="field">
      <label className="label">Angle: </label>
      <div className="control">
        <input type="number" className="input" value={angle} onChange={o => {
          setAngle(o.target.value);
          if (!isNaN(parseFloat(o.target.value))) {
            props.updateNode({
              ...props.node,
              angle: parseFloat(o.target.value)
            })
          }
        }}/>
      </div>
    </div>
    <MeasureField label="Gap" node={props.node.gap} updateNode={n => {
      props.updateNode({
        ...props.node,
        gap: n
      });
    }}/>
  </div>
  )
}

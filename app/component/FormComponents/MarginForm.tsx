'use client'
import React, { useState } from 'react' 
import { Margins } from '@/app/model/guidesheet';
import { FormProps, Unit} from '@/types'
import { onNumberFieldChange } from './Utils';
import Image from 'next/image';


export function MarginForm (props: FormProps<Margins>){
  const [left, setLeft] = useState(props.node.left.toString());
  const [right, setRight] = useState(props.node.right.toString());
  const [top, setTop] = useState(props.node.top.toString());
  const [bottom, setBottom] = useState(props.node.bottom.toString());

  return (
  <div>
    <fieldset className="fieldset">
    <legend>Margins</legend>
    <table>
      <tbody>
        <tr>
          <td />
          <td className="c-valign-bottom c-halign-center">
            <input className="input" type="number" value={top} onChange={v => {
              onNumberFieldChange<Margins>(props.node, props.updateNode, setTop, "top", v)
            }}/>
          </td>
          <td />
        </tr>
        <tr>
          <td className="c-valign-center c-halign-right">
            <input className="input" type="number" value={left} onChange={v => {
              onNumberFieldChange<Margins>(props.node, props.updateNode, setLeft, "left", v)
            }}/>
          </td>
          <td className="c-align-center">
            <Image src="icons/layout.svg" width={100} height={100} alt="layout"/>
          </td>
          <td className="c-valign-center c-halign-left">
            <input className="input" type="number" value={right} onChange={v => {
              onNumberFieldChange<Margins>(props.node, props.updateNode, setRight, "right", v)
            }}/>
          </td>
        </tr>
        <tr>
          <td />
          <td className="c-valign-top c-halign-center">
            <input className="input" type="number" value={bottom} onChange={v => {
              onNumberFieldChange<Margins>(props.node, props.updateNode, setBottom, "bottom", v)
            }}/>
          </td>
          <td />
        </tr>
      </tbody>
    </table>
    <div className="field">
      <label className="label">Unit:</label>
      <div className="control">
        <div className="select">
          <select value={props.node.unit} onChange={o => {
            props.updateNode({
              ...props.node,
              unit: Unit[o.target.value as keyof typeof Unit]
            })   
          }}>
          {(Object.keys(Unit) as Array<keyof typeof Unit>)
            .filter((key) => key != Unit.nw)
            .map((key) =>
              <option value={key} key={key}>{key}</option>
            )
          } 
          </select>
        </div>
      </div>
    </div>
    </fieldset>
  </div>
  )
}

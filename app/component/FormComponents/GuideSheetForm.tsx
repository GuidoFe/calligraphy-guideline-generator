'use client'
import React, { useState} from 'react'
import { ParallelLine, DiagonalLine, GuideSheet } from '@/app/model/guidesheet';
import { FormProps} from '@/types'
import { PageForm, MarginForm, MeasureField, LineStyleForm } from '.';
import { LineForm } from './LineForm';


export function GuideSheetForm (props: FormProps<GuideSheet>){
  const [nw, setNw] = useState(props.node.nibWidth.toString());
  let htmlStyles = [];
  let styles = props.node.style;

  for (var i = 0; i < styles.length; i++) {
    let j = i;
    htmlStyles.push(
      <div key={styles[j].name}>
      <LineStyleForm node={styles[j]} updateNode={n => {
        let newArr = [...props.node.style]
        newArr[j] = n;
        props.updateNode({
          ...props.node,
          style: newArr
        })
      }}/>
      </div>
    )
  }

  return (
  <form className='GuideSheetForm'>
    <PageForm node={props.node.pageLayout} updateNode={n => {
      props.updateNode({
        ...props.node,
        pageLayout: n
      });
    }}/>
    <MarginForm node={props.node.pageLayout.margin} updateNode={n => {
      props.updateNode({
        ...props.node,
        pageLayout: {
          ...props.node.pageLayout,
          margin: n
        }
      })
    }}/>
    <MeasureField label="Line Spacing" node={props.node.lineSpacing} updateNode={n => {
      props.updateNode({
        ...props.node,
        lineSpacing: n
      })
    }}/>
    <div className="field">
      <label className="label">Nib Width (Optional)</label>
      <div className="control">
        <div className="field has-addons">
          <div className="control">
            <input className="input" type="number" value={nw} onChange={v => {
              setNw(v.target.value);
              if (!isNaN(parseFloat(v.target.value))) {
                props.updateNode({
                  ...props.node,
                  nibWidth: parseFloat(v.target.value)
                })
              }
            }}/>
          </div>
          <div className="control">
            <div className="button is-static">
              mm
            </div>
          </div>
        </div>
      </div>
    </div>
    <fieldset className="fieldset">
      <legend>Decorations</legend>
      <label className="checkbox label my-2"> 
        <input type="checkbox" className="mr-2" value="showtitle" checked={props.node.showTitle} onChange={_ =>{
          props.updateNode({
            ...props.node,
            showTitle: !props.node.showTitle
          })
        }}/>
        Show title
      </label>
      {props.node.showTitle &&
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input className="input" type="text" value={props.node.title ?? ""} onChange={n => {
              props.updateNode({
                ...props.node,
                title: n.target.value
              })
            }}/>
          </div>
        </div>
      }
      <div>
        <label className="checkbox label my-2">
          <input type="checkbox" className="mr-2" value="showdate" checked={props.node.showDateLine} onChange={_ =>{
            props.updateNode({
              ...props.node,
              showDateLine: !props.node.showDateLine
            })
          }}/>
          Show date line
        </label>
      </div>
      <label className="checkbox label">
        <input type="checkbox"  className="mr-2" checked={props.node.showNibDecoration} onChange={_ => {
          props.updateNode({
            ...props.node,
            showNibDecoration: !props.node.showNibDecoration
          })
        }}/>
        Show nib ladder
      </label>
    </fieldset>
    <fieldset className="fieldset">
      <legend>Lines</legend>
      <LineForm node={props.node.row.ascender} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            ascender: n as ParallelLine
          }
        })
      }}/>
      <LineForm node={props.node.row.capline} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            capline: n as ParallelLine
          }
        })
      }}/>
      <LineForm node={props.node.row.waistline} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            waistline: n as ParallelLine
          }
        })
      }}/>
      <LineForm isActivable={props.node.row.baseline.isOptional} node={props.node.row.baseline} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            baseline: n
          }
        })
      }}/>
      <LineForm node={props.node.row.secondaryDescender} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            secondaryDescender: n as ParallelLine
          }
        })
      }}/>
      <LineForm node={props.node.row.descender} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            descender: n as ParallelLine
          }
        })
      }}/>
      <LineForm node={props.node.row.diagonals} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            diagonals: n as DiagonalLine
          }
        })
      }}/>
      <LineForm node={props.node.row.lineEnds} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            lineEnds: n
          }
        })
      }}/>
    </fieldset>
    <fieldset className="fieldset">
      <legend>Styles</legend>
      {htmlStyles}
    </fieldset>

  </form>
  )
}

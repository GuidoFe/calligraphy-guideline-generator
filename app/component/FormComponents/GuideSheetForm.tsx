'use client'
import React, { useMemo, useState} from 'react'
import { ParallelLine, DiagonalLine, GuideSheet } from '@/app/model/guidesheet';
import { FormProps} from '@/types'
import { PageForm, MarginForm, MeasureField, LineStyleForm } from '.';
import { LineForm } from './LineForm';

interface GuideSheetFormProps extends FormProps<GuideSheet> {
  setNw: (n: number) => void
}

export function GuideSheetForm (props: GuideSheetFormProps){
  let [nwText, setNwText] = useState(props.nw.toString());
  
  let htmlStyles = useMemo(() => {
    let styles = props.node.style;
    let h = [];
    for (var i = 0; i < styles.length; i++) {
      let j = i;
      h.push(
        <div key={styles[j].name}>
        <LineStyleForm node={styles[j]} updateNode={n => {
          let newArr = [...props.node.style]
          newArr[j] = n;
          props.updateNode({
            ...props.node,
            style: newArr
          })
        }} nw={props.nw}/>
        </div>
      );
    };
    return h;
  }, [props]);

  return (
  <form className='GuideSheetForm'>
    <h3 className="title is-3">Page</h3>
    <PageForm node={props.node.pageLayout} updateNode={n => {
      props.updateNode({
        ...props.node,
        pageLayout: n
      });
    }} nw={props.nw}/>
    <MarginForm node={props.node.pageLayout.margin} updateNode={n => {
      props.updateNode({
        ...props.node,
        pageLayout: {
          ...props.node.pageLayout,
          margin: n
        }
      })
    }} nw={props.nw}/>
    <MeasureField label="Line Spacing" node={props.node.lineSpacing} updateNode={n => {
      props.updateNode({
        ...props.node,
        lineSpacing: n
      })
    }} nw={props.nw}/>
    <div className="field">
      <label className="label">Nib Width (optional)</label>
      <div className="control">
        <div className="field has-addons">
          <div className="control">
            <input className="input" type="number" value={nwText} onChange={v => {
              setNwText(v.target.value);
              if (!isNaN(parseFloat(v.target.value))) {
                props.setNw(parseFloat(v.target.value));
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
    <hr />
    <div>
      <h3 className="title is-3">Decorations</h3>
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
    </div>
    <hr />
    <div>
      <h3 className="title is-3">Lines</h3>
      <LineForm isActivable={props.node.row.ascender.isOptional} node={props.node.row.ascender} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            ascender: n as ParallelLine
          }
        })
      }} nw={props.nw}/>
      <LineForm isActivable={props.node.row.capline.isOptional} node={props.node.row.capline} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            capline: n as ParallelLine
          }
        })
      }} nw={props.nw}/>
      <LineForm isActivable={props.node.row.waistline.isOptional} node={props.node.row.waistline} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            waistline: n as ParallelLine
          }
        })
      }} nw={props.nw}/>
      <LineForm isActivable={props.node.row.baseline.isOptional} node={props.node.row.baseline} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            baseline: n
          }
        })
      }} nw={props.nw}/>
      <LineForm isActivable={props.node.row.secondaryDescender.isOptional} node={props.node.row.secondaryDescender} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            secondaryDescender: n as ParallelLine
          }
        })
      }} nw={props.nw}/>
      <LineForm isActivable={props.node.row.descender.isOptional} node={props.node.row.descender} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            descender: n as ParallelLine
          }
        })
      }} nw={props.nw}/>
      <LineForm isActivable={props.node.row.diagonals.isOptional} node={props.node.row.diagonals} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            diagonals: n as DiagonalLine
          }
        })
      }} nw={props.nw}/>
      <LineForm isActivable={props.node.row.lineEnds.isOptional} node={props.node.row.lineEnds} updateNode={n => {
        props.updateNode({
          ...props.node,
          row: {
            ...props.node.row,
            lineEnds: n
          }
        })
      }} nw={props.nw}/>
    </div>
    <hr />
    <h3 className="title is-3">Styles</h3>
    {htmlStyles}
    </form>
  )
}

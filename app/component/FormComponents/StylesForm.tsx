'use client'
import React, { useMemo } from 'react'
import { LineStyle } from '@/app/model/guidesheet';
import { FormProps} from '@/types'
import { LineStyleForm } from '.';

export function StylesForm (props: FormProps<LineStyle[]>){
  let htmlStyles = useMemo(() => {
    let styles = props.node;
    let h = [];
    for (var i = 0; i < styles.length; i++) {
      let j = i;
      h.push(
        <div key={styles[j].name}>
        <LineStyleForm node={styles[j]} updateNode={n => {
          let newArr = [...props.node]
          newArr[j] = n;
          props.updateNode(newArr);
        }} nw={props.nw}/>
        </div>
      );
    };
    return h;
  }, [props]);

  return (
  <form className='StylesForm'>
    <h3 className="title is-3">Styles</h3>
    {htmlStyles}
    </form>
  )
}

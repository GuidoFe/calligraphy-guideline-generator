'use client'
import React from 'react'
import { ParallelLine } from '@/app/model/guidesheet';
import { MeasureField } from '.';
import { FormProps } from '@/types';

export function ParallelLineFormPart (props: FormProps<ParallelLine>){
  return (
  <div>
    <MeasureField 
      label={
        props.node.customOffsetName ?
          props.node.customOffsetName
          : `Distance from ${props.node.isOffsetFromBaseline ? 'baseline' : 'waistline'}`}
      node={props.node.offset} 
      updateNode={o => {
        props.updateNode({
          ...props.node,
          offset: o
        })
    }} nw={props.nw}/>
  </div>
  )
}

'use client'
import React from 'react'
import { ParallelLine } from '@/app/model/guidesheet';
import { FormProps } from '@/types'
import { MeasureField } from '.';

export function ParallelLineFormPart (props: FormProps<ParallelLine>){
  return (
  <div>
    <MeasureField 
      label={`Distance from ${props.node.isOffsetFromBaseline ? 'baseline' : 'waistline'}`}
      node={props.node.offset} 
      updateNode={o => {
        props.updateNode({
          ...props.node,
          offset: o
        })
    }}/>
  </div>
  )
}

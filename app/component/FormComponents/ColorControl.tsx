'use client'
import React from 'react'
import classNames from 'classnames';
import {PopoverPicker} from '@/app/component/PopoverPicker'


export function ColorControl (props: {node: string, updateNode: (s: string) => void}) {
  return (
    <div className={classNames("control color-control")}>
      <PopoverPicker color={props.node} onChange={s => props.updateNode(s)}/>
    </div>
  )
} 

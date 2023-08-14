'use client'
import {Color, FieldFormProps, FormProps} from '@/types';
import React from 'react'
import classNames from 'classnames';
import {PopoverPicker} from '@/app/component/PopoverPicker'


export function ColorControl (props: FormProps<Color>) {
  return (
    <div className={classNames("control color-control")}>
      <PopoverPicker color={props.node} onChange={s => props.updateNode(s as Color)}/>
    </div>
  )
} 

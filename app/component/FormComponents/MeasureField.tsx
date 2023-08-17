'use client'
import {FieldFormProps, Measure, Unit} from '@/types';
import React, {useState, useEffect, ChangeEvent} from 'react'
import classNames from 'classnames';

export function MeasureField (props: FieldFormProps<Measure>) {
  const [value, setValue] = useState(props.node.value.toString());
  useEffect(() => {
    setValue(props.node.value.toString());
  }, [props.node.value]);

  const onChangeValue = (o: ChangeEvent<HTMLInputElement>) => {
    setValue(o.target.value)
    if (!isNaN(parseFloat(o.target.value))) {
      props.updateNode({
        ...props.node,
        value: parseFloat(o.target.value)
      });
    }
  }

  const onChangeUnit = (o: ChangeEvent<HTMLSelectElement>) => {
    props.updateNode({
      ...props.node,
      unit: Unit[o.target.value as keyof typeof Unit]
    })
  }

  return (
    <div className="field">
      {props.label !== undefined &&
        <label className="label">{props.label}</label>
      }
      <div className="control">
        <div className="field has-addons">
          <div className={classNames("control", {"is-expanded": props.isExpanded ?? false})}>
            <input className="input" type="number" value={value} onChange={onChangeValue}/>
          </div>
          <div className="control">
            <div className="select">
              <select value={props.node.unit} onChange={onChangeUnit}>
                 {Object.keys(Unit)
                   .filter(key => key != Unit.nw.toString() || props.node.allowPW)
                   .map(key => 
                    <option key={key} value={key}>{key}</option>
                   )
                } 
              </select>
            </div>
          </div>
        </div>
      </div>
      {props.helpText !== undefined && 
        <p className="help">{props.helpText}</p>
      }
    </div>
  )
} 


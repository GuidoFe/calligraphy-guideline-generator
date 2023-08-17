import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from '@/utils/UseClickOutsite'
import '@/app/sass/popover_picker.scss'

export const PopoverPicker = (props: { color: string, onChange: (c: string) => void }) => {
  const popover = useRef<HTMLDivElement>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className="picker">
      <button
        className="button"
        style={{ backgroundColor: props.color }}
        onClick={() => toggle(true)}
        type="button"
      >
        <span className="icon is-small">
        </span>
      </button>

      {isOpen && (
        <div className="popover" ref={popover}>
          <HexColorPicker color={props.color} onChange={props.onChange} />
        </div>
      )}
    </div>
  );
};

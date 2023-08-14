import { ChangeEvent } from "react";

export function onNumberFieldChange<N> (
  node: N, 
  updateNode: (n: N) => void, 
  setValue: (s: string) => void,
  attributeName: string,
  event: ChangeEvent<HTMLInputElement>,
  parseFunction: (s: string) => number = parseFloat
) {
  let targetValue = event.target.value;
  setValue(targetValue)
  if (!isNaN(parseFunction(targetValue))) {
    updateNode({
      ...node,
      [attributeName]: parseFunction(targetValue)
    })
  }
}

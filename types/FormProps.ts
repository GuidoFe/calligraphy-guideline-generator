export interface FormProps<T> { 
    updateNode: (style: T) => void, 
    node: T, 
    nw: number,
}

export interface FieldFormProps<T> extends FormProps<T> {
    isExpanded?: boolean,
    label?: string,
    helpText?: string,
}

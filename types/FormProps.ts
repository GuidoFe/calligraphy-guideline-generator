export interface FormProps<T> { 
    updateNode: (style: T) => void, 
    node: T, 
}

export interface FieldFormProps<T> extends FormProps<T> {
    isExpanded?: boolean,
    label?: string,
    helpText?: string,
}

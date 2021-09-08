import React from 'react'
import {
    useControlledValue,
    useValidation,
    UseValidationProps,
    Validator,
    Validators,
} from '@interface-technologies/iti-react-core'
import { ValidationFeedback } from '../Validation'

export type FileInputValue = File | null

interface FileInputProps extends UseValidationProps<FileInputValue> {
    id?: string
    accept: string
    inputAttributes?: React.HTMLProps<HTMLInputElement>
    enabled?: boolean
}

export function FileInput({
    id,
    accept,
    enabled,
    inputAttributes,
    showValidation,
    name,
    ...props
}: FileInputProps): React.ReactElement {
    const { value, onChange } = useControlledValue<FileInputValue>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: null,
    })

    const {
        valid,
        invalidFeedback,
        asyncValidationInProgress,
    } = useValidation<FileInputValue>({
        value,
        name,
        onValidChange: props.onValidChange,
        validators: props.validators,
        validationKey: props.validationKey,
        asyncValidator: props.asyncValidator,
        onAsyncError: props.onAsyncError,
        onAsyncValidationInProgressChange: props.onAsyncValidationInProgressChange,
        formLevelValidatorOutput: props.formLevelValidatorOutput,
    })

    return (
        <ValidationFeedback
            showValidation={showValidation}
            valid={valid}
            invalidFeedback={invalidFeedback}
            asyncValidationInProgress={asyncValidationInProgress}
        >
            <input
                id={id}
                type="file"
                name={name}
                accept={accept}
                onChange={(e) => {
                    const files = e.target?.files

                    if (files && files[0]) {
                        onChange(files[0])
                    } else {
                        onChange(null)
                    }
                }}
            />
        </ValidationFeedback>
    )
}

function required(): Validator<FileInputValue> {
    return (value: FileInputValue) => ({
        valid: !!value,
        invalidFeedback: Validators.required()('').invalidFeedback,
    })
}

export const FileValidators = { required }

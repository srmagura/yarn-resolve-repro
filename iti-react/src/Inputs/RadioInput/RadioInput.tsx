import React from 'react'
import {
    Validators,
    UseValidationProps,
    Validator,
    useControlledValue,
    useValidation,
    ValidatorOutput,
} from '@interface-technologies/iti-react-core'
import { ValidationFeedback } from '../../Validation'
import { RadioOption, RadioInputValue } from './RadioInputTypes'
import { RadioButton } from './RadioButton'

const classSeparator = '__'

export interface RadioButtonOptions {
    inline: boolean
}

interface RadioInputProps extends UseValidationProps<RadioInputValue> {
    options: RadioOption[]

    enabled?: boolean
    buttonOptions?: Partial<RadioButtonOptions>
}

export const RadioInput = React.memo<RadioInputProps>(
    ({ options, enabled = true, showValidation, name, ...props }) => {
        const { value, onChange } = useControlledValue<RadioInputValue>({
            value: props.value,
            onChange: props.onChange,
            defaultValue: props.defaultValue,
            fallbackValue: null,
        })

        const {
            valid,
            invalidFeedback,
            asyncValidationInProgress,
        } = useValidation<RadioInputValue>({
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

        const buttonOptions: RadioButtonOptions = {
            inline: true,
            ...props.buttonOptions,
        }

        const containerClass = 'radio-button-container'
        const containerClasses = [containerClass, name + classSeparator + containerClass]

        return (
            <ValidationFeedback
                showValidation={showValidation}
                valid={valid}
                invalidFeedback={invalidFeedback}
                asyncValidationInProgress={asyncValidationInProgress}
            >
                <div className={containerClasses.join(' ')}>
                    {options.map((o) => (
                        <RadioButton
                            radioOption={o}
                            name={name}
                            value={value}
                            onChange={onChange}
                            enabled={enabled}
                            inline={buttonOptions.inline}
                            key={o.value}
                        />
                    ))}
                </div>
            </ValidationFeedback>
        )
    }
)

function required(): Validator<RadioInputValue> {
    return (value): ValidatorOutput => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback,
    })
}

export const RadioValidators = {
    required,
}

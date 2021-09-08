import React, { PropsWithChildren } from 'react'
import { defaults } from 'lodash'
import {
    ValidatorOutput,
    useControlledValue,
    UseValidationProps,
    useValidation,
} from '@interface-technologies/iti-react-core'
import {
    ValidationFeedbackProps,
    getValidationClass,
    ValidationFeedback,
} from '../Validation'

type OmittedHtmlProps = 'id' | 'name' | 'class' | 'disabled' | 'value' | 'onChange'

interface ValidatedInputProps extends UseValidationProps<string> {
    id?: string
    type?: string

    // This class name will be used *in addition to* form-control and the validation feedback class
    className?: string
    enabled?: boolean

    inputAttributes?:
        | Omit<React.HTMLProps<HTMLInputElement>, OmittedHtmlProps>
        | Omit<React.HTMLProps<HTMLTextAreaElement>, OmittedHtmlProps>
        | Omit<React.HTMLProps<HTMLSelectElement>, OmittedHtmlProps>
    validationFeedbackComponent?(props: ValidationFeedbackProps): JSX.Element

    formLevelValidatorOutput?: ValidatorOutput
}

export const ValidatedInput = React.memo(
    (props: PropsWithChildren<ValidatedInputProps>) => {
        const { id, type, showValidation, enabled, children, name } = defaults(
            { ...props },
            { type: 'text', inputAttributes: {}, enabled: true }
        )

        const { value, onChange: _onChange } = useControlledValue<string>({
            value: props.value,
            onChange: props.onChange,
            defaultValue: props.defaultValue,
            fallbackValue: '',
        })

        function onChange(
            e: React.SyntheticEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
        ): void {
            _onChange(e.currentTarget.value)
        }

        const { valid, invalidFeedback, asyncValidationInProgress } =
            useValidation<string>({
                value,
                name: props.name,
                onValidChange: props.onValidChange,
                validators: props.validators,
                validationKey: props.validationKey,
                asyncValidator: props.asyncValidator,
                onAsyncError: props.onAsyncError,
                onAsyncValidationInProgressChange:
                    props.onAsyncValidationInProgressChange,
                formLevelValidatorOutput: props.formLevelValidatorOutput,
            })

        const classes = [getValidationClass(valid, showValidation)]
        if (props.className) classes.push(props.className)

        const inputAttributes = { ...props.inputAttributes, disabled: !enabled }

        let input: JSX.Element

        if (type && type.toLowerCase() === 'select') {
            classes.push('form-select')

            input = (
                <select
                    id={id}
                    name={name}
                    className={classes.join(' ')}
                    value={value}
                    onChange={onChange}
                    {...(inputAttributes as React.HTMLProps<HTMLSelectElement>)}
                >
                    {children}
                </select>
            )
        } else if (type && type.toLowerCase() === 'textarea') {
            classes.push('form-control')

            input = (
                <textarea
                    id={id}
                    name={name}
                    className={classes.join(' ')}
                    value={value}
                    onChange={onChange}
                    {...(inputAttributes as React.HTMLProps<HTMLTextAreaElement>)}
                />
            )
        } else {
            classes.push('form-control')

            input = (
                <input
                    id={id}
                    name={name}
                    type={type}
                    className={classes.join(' ')}
                    value={value}
                    onChange={onChange}
                    {...(inputAttributes as React.HTMLProps<HTMLInputElement>)}
                />
            )
        }

        return (
            <ValidationFeedback
                valid={valid}
                showValidation={showValidation}
                invalidFeedback={invalidFeedback}
                asyncValidationInProgress={asyncValidationInProgress}
            >
                {input}
            </ValidationFeedback>
        )
    }
)

import React from 'react'
import {
    UseValidationProps,
    Validators,
    Validator,
    AsyncValidator,
    ValidatorOutput,
    CancellablePromise,
} from '@interface-technologies/iti-react-core'
import { defaults } from 'lodash'
import { RadioInput, RadioButtonOptions } from './RadioInput'
import { RadioInputValue } from './RadioInputTypes'

export type BooleanRadioInputValue = boolean | null

function convertValue(
    value: BooleanRadioInputValue | undefined
): string | undefined | null {
    if (typeof value === 'undefined') return undefined

    if (value === null) return null

    return value.toString()
}

function convertValidator(
    validator: Validator<BooleanRadioInputValue>
): Validator<RadioInputValue> {
    return (value: RadioInputValue): ValidatorOutput => {
        const booleanValue = value !== null ? value === true.toString() : null
        return validator(booleanValue)
    }
}

function convertAsyncValidator(
    validator: AsyncValidator<BooleanRadioInputValue>
): AsyncValidator<RadioInputValue> {
    return (value: RadioInputValue): CancellablePromise<ValidatorOutput> => {
        const booleanValue = value !== null ? value === true.toString() : null
        return validator(booleanValue)
    }
}

interface LabelText {
    false: string
    true: string
}

interface BooleanRadioInputProps extends UseValidationProps<BooleanRadioInputValue> {
    labels?: LabelText
    trueFirst?: boolean

    enabled?: boolean
    buttonOptions?: Partial<RadioButtonOptions>
}

export function BooleanRadioInput(props: BooleanRadioInputProps): React.ReactElement {
    const {
        trueFirst,
        value,
        onChange,
        defaultValue,
        validators,
        labels,
        asyncValidator,
        ...passThroughProps
    } = defaults(
        { ...props },
        {
            labels: { false: 'No', true: 'Yes' },
            trueFirst: true,
        }
    )

    const options = [
        { value: true.toString(), label: labels.true },
        { value: false.toString(), label: labels.false },
    ]

    if (!trueFirst) options.reverse()

    return (
        <RadioInput
            options={options}
            value={convertValue(value)}
            defaultValue={convertValue(defaultValue)}
            onChange={(value): void => {
                if (onChange) onChange(value === true.toString())
            }}
            validators={validators.map(convertValidator)}
            asyncValidator={
                asyncValidator ? convertAsyncValidator(asyncValidator) : undefined
            }
            {...passThroughProps}
        />
    )
}

//
//
//

function required(): Validator<BooleanRadioInputValue> {
    return (value: BooleanRadioInputValue): ValidatorOutput => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback,
    })
}

export const BooleanRadioValidators = {
    required,
}

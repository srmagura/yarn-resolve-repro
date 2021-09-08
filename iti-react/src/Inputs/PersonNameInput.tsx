import React, { useContext } from 'react'
import { defaults } from 'lodash'
import {
    useFieldValidity,
    Validators,
    fieldValidityIsValid,
    Validator,
    ValidatorOutput,
    UseValidationProps,
    useControlledValue,
    useValidation,
} from '@interface-technologies/iti-react-core'
import { ValidationFeedback } from '../Validation'
import { ItiReactContext } from '../ItiReactContext'
import { ValidatedInput } from './ValidatedInput'

export interface PersonNameInputValue {
    prefix: string
    first: string
    middle: string
    last: string
}

export const defaultPersonNameInputValue: PersonNameInputValue = {
    prefix: '',
    first: '',
    middle: '',
    last: '',
}

const noPartialNamesValidator: Validator<PersonNameInputValue> = (value) => {
    const allSpecified = !!(value.first && value.last)
    const allBlank = !!(!value.prefix && !value.first && !value.middle && !value.last)

    return {
        valid: allSpecified || allBlank,
        invalidFeedback:
            'Both first and last name must be specified, or all fields must be left blank.',
    }
}

function required(): Validator<PersonNameInputValue> {
    return (value): ValidatorOutput => ({
        valid: !!(value.first && value.last),
        invalidFeedback: 'First and last name are required.',
    })
}

export const PersonNameValidators = {
    required,
}

//
//
//

type InputAttributes = Omit<React.HTMLProps<HTMLInputElement>, 'disabled'>

type InputAttributesMap = {
    prefix: InputAttributes
    first: InputAttributes
    middle: InputAttributes
    last: InputAttributes
}

interface PersonNameInputProps extends UseValidationProps<PersonNameInputValue> {
    individualInputsRequired: boolean

    fluid?: boolean
    showMiddleNameInput?: boolean
    inputAttributesMap?: Partial<InputAttributesMap>
    enabledInputs?: ('first' | 'middle' | 'last')[]
}

export const PersonNameInput = React.memo((props: PersonNameInputProps) => {
    const {
        name,
        showValidation,
        individualInputsRequired,
        showMiddleNameInput,
        fluid,
        inputAttributesMap: propsInputAttributesMap,
        enabledInputs,
    } = defaults(
        { ...props },
        {
            showMiddleNameInput: false,
            fluid: false,
            inputAttributesMap: {},
            enabledInputs: ['first', 'middle', 'last'],
        }
    )

    const { value, onChange } = useControlledValue<PersonNameInputValue>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: defaultPersonNameInputValue,
    })

    const {
        valid,
        invalidFeedback,
        asyncValidationInProgress,
    } = useValidation<PersonNameInputValue>({
        value,
        name: props.name,
        onValidChange: props.onValidChange,
        validators: [...props.validators, noPartialNamesValidator],
        validationKey: props.validationKey,
        asyncValidator: props.asyncValidator,
        onAsyncError: props.onAsyncError,
        onAsyncValidationInProgressChange: props.onAsyncValidationInProgressChange,
        formLevelValidatorOutput: props.formLevelValidatorOutput,
    })

    const inputAttributesMap: InputAttributesMap = defaults(
        { ...propsInputAttributesMap },
        {
            prefix: {},
            first: {},
            middle: {},
            last: {},
        }
    )

    const classes = ['person-name-input']
    if (fluid) classes.push('person-name-input-fluid')

    const [onChildValidChange, fieldValidity] = useFieldValidity()

    const { fieldLengths } = useContext(ItiReactContext)
    const firstNameValidators = [Validators.maxLength(fieldLengths.personName.first)]
    const lastNameValidators = [Validators.maxLength(fieldLengths.personName.last)]

    if (individualInputsRequired) {
        firstNameValidators.unshift(Validators.required())
        lastNameValidators.unshift(Validators.required())
    }

    const vProps = { showValidation, onValidChange: onChildValidChange }

    return (
        <ValidationFeedback
            valid={valid}
            invalidFeedback={invalidFeedback}
            showValidation={showValidation && fieldValidityIsValid(fieldValidity)}
            asyncValidationInProgress={asyncValidationInProgress}
        >
            <div className={classes.join(' ')}>
                <ValidatedInput
                    name={`${name}First`}
                    inputAttributes={{
                        placeholder: 'First',
                        'aria-label': 'First name',
                        ...inputAttributesMap.first,
                    }}
                    enabled={enabledInputs.includes('first')}
                    value={value.first}
                    onChange={(first): void => onChange({ ...value, first })}
                    validators={firstNameValidators}
                    {...vProps}
                />
                {showMiddleNameInput && (
                    <ValidatedInput
                        name={`${name}Middle`}
                        inputAttributes={{
                            placeholder: 'Middle',
                            'aria-label': 'Middle name',
                            ...inputAttributesMap.middle,
                        }}
                        enabled={enabledInputs.includes('middle')}
                        value={value.middle}
                        onChange={(middle): void => onChange({ ...value, middle })}
                        // Never required because some people don't have middle names
                        validators={[
                            Validators.maxLength(fieldLengths.personName.middle),
                        ]}
                        {...vProps}
                    />
                )}
                <ValidatedInput
                    name={`${name}Last`}
                    inputAttributes={{
                        placeholder: 'Last',
                        'aria-label': 'Last name',
                        ...inputAttributesMap.last,
                    }}
                    enabled={enabledInputs.includes('last')}
                    value={value.last}
                    onChange={(last): void => onChange({ ...value, last })}
                    validators={lastNameValidators}
                    {...vProps}
                />
            </div>
        </ValidationFeedback>
    )
})

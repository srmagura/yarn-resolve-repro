import React from 'react'
import moment from 'moment-timezone'
import {
    toHoursAndMinutes,
    toDecimalHours,
    undefinedToNull,
    Validators,
    Validator,
    UseValidationProps,
    useControlledValue,
    useValidation,
    ValidatorOutput,
} from '@interface-technologies/iti-react-core'
import { isEqual } from 'lodash'
import { ValidationFeedback } from '../Validation'
import { SelectValue, ValidatedSelect, SelectOption } from './Select'
import { LinkButton } from '../Components/LinkButton'

//
// TimeInputValue
//

// Don't do TimeInputValue = Moment because representing time of day with a Moment / DateTime
// leads to DST bugs.
export type TimeInputValue = {
    hours?: number // 1, 2, ..., 12
    minutes?: number
    ampm?: 'am' | 'pm'
}

export const defaultTimeInputValue: TimeInputValue = {}

export function timeInputValueFromDecimalHours(decimalHours?: number): TimeInputValue {
    if (typeof decimalHours === 'undefined') return defaultTimeInputValue

    const { hours, minutes } = toHoursAndMinutes(decimalHours)
    const mo = moment().hours(hours).minutes(minutes)

    return {
        hours: parseInt(mo.format('h')), // 1, 2, ..., 12
        minutes: mo.minutes(),
        ampm: mo.format('a') as 'am' | 'pm',
    }
}

export function timeInputValueToDecimalHours(value: TimeInputValue): number | undefined {
    if (
        typeof value.hours === 'undefined' ||
        typeof value.minutes === 'undefined' ||
        typeof value.ampm === 'undefined'
    ) {
        return undefined
    }

    let hours = value.hours % 12
    if (value.ampm === 'pm') hours += 12

    return toDecimalHours(hours, value.minutes)
}

//
// Supporting functions for component
//

const basicValidator: Validator<TimeInputValue> = (value: TimeInputValue) => {
    const { hours, minutes, ampm } = value
    const types = [typeof hours, typeof minutes, typeof ampm]

    let undefinedCount = 0
    for (const type of types) {
        if (type === 'undefined') undefinedCount += 1
    }

    return {
        valid: undefinedCount === 0 || undefinedCount === 3,
        invalidFeedback: 'You must enter a valid time or leave all fields blank.',
    }
}

const toOption = (x: number | string): SelectOption => ({ value: x, label: x.toString() })

const options = {
    hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(toOption),
    minutes: ['00', '15', '30', '45'].map((m) => ({ value: parseInt(m), label: m })),
    ampm: ['am', 'pm'].map(toOption),
}

export interface ClearButtonComponentProps {
    onClick(): void
    enabled: boolean
}

function DefaultClearButtonComponent({
    onClick,
    enabled,
}: ClearButtonComponentProps): React.ReactElement {
    if (!enabled) {
        return <span className="default-clear-button disabled">Clear</span>
    }

    return (
        <LinkButton onClick={onClick} className="default-clear-button">
            Clear
        </LinkButton>
    )
}

function fromSelectValue(selectValue: SelectValue): SelectValue | undefined {
    if (selectValue === '' || selectValue === null) {
        return undefined
    }

    return selectValue
}

//
// TimeInput component
//

interface TimeInputProps extends UseValidationProps<TimeInputValue> {
    individualInputsRequired: boolean
    enabled?: boolean

    isClearable?: boolean
    clearButtonComponent?: React.StatelessComponent<ClearButtonComponentProps>
}

export const TimeInput = React.memo<TimeInputProps>(
    ({
        showValidation,
        enabled = true,
        name,
        isClearable = true,
        clearButtonComponent: ClearButton = DefaultClearButtonComponent,
        individualInputsRequired,
        ...otherProps
    }) => {
        const { value, onChange } = useControlledValue<TimeInputValue>({
            value: otherProps.value,
            onChange: otherProps.onChange,
            defaultValue: otherProps.defaultValue,
            fallbackValue: {},
        })

        function onHoursChange(selectValue: SelectValue): void {
            const hours = fromSelectValue(selectValue)
            if (typeof hours !== 'number') throw new Error('Hours is not a number.')

            onChange({
                ...value,
                hours,
            })
        }

        function onMinutesChange(selectValue: SelectValue): void {
            const minutes = fromSelectValue(selectValue)
            if (typeof minutes !== 'number') throw new Error('Hours is not a number.')

            onChange({
                ...value,
                minutes,
            })
        }

        function onAmpmChange(selectValue: SelectValue): void {
            const ampm = fromSelectValue(selectValue)
            if (!(ampm === 'am' || ampm === 'pm' || typeof ampm === 'undefined'))
                throw new Error('ampm is not am, pm , or undefined.')

            onChange({
                ...value,
                ampm,
            })
        }

        const { valid, invalidFeedback, asyncValidationInProgress } =
            useValidation<TimeInputValue>({
                value,
                name,
                onValidChange: otherProps.onValidChange,
                validators: [basicValidator, ...otherProps.validators],
                validationKey: otherProps.validationKey,
                asyncValidator: otherProps.asyncValidator,
                onAsyncError: otherProps.onAsyncError,
                onAsyncValidationInProgressChange:
                    otherProps.onAsyncValidationInProgressChange,
                formLevelValidatorOutput: otherProps.formLevelValidatorOutput,
            })

        const { hours, minutes, ampm } = value

        const indiviudalInputValidators: Validator<SelectValue>[] = []

        if (individualInputsRequired) {
            // don't display any feedback under individual fields
            indiviudalInputValidators.push((value) => ({
                valid: value !== null,
                invalidFeedback: undefined,
            }))
        }

        const commonProps = {
            showValidation,
            validators: indiviudalInputValidators,
            enabled,
        }

        return (
            <div className="time-input">
                <ValidationFeedback
                    valid={valid}
                    showValidation={showValidation}
                    invalidFeedback={invalidFeedback}
                    asyncValidationInProgress={asyncValidationInProgress}
                >
                    <input type="hidden" name={name} value={JSON.stringify(value)} />
                    <div className="flex-container">
                        <div className="input">
                            <ValidatedSelect
                                {...commonProps}
                                name={`${name}_hours`}
                                value={undefinedToNull(hours)}
                                onChange={onHoursChange}
                                options={options.hours}
                                placeholder="HH"
                                aria-label="Hours"
                            />
                        </div>
                        <div className="input">
                            <ValidatedSelect
                                {...commonProps}
                                name={`${name}_minutes`}
                                value={undefinedToNull(minutes)}
                                onChange={onMinutesChange}
                                options={options.minutes}
                                placeholder="mm"
                                aria-label="Minutes"
                            />
                        </div>
                        <div className="input">
                            <ValidatedSelect
                                {...commonProps}
                                name={`${name}_ampm`}
                                value={undefinedToNull(ampm)}
                                onChange={onAmpmChange}
                                options={options.ampm}
                                placeholder=""
                                aria-label="AM or PM"
                            />
                        </div>
                        {isClearable && !isEqual(value, defaultTimeInputValue) && (
                            <ClearButton
                                onClick={(): void => onChange(defaultTimeInputValue)}
                                enabled={enabled}
                            />
                        )}
                    </div>
                </ValidationFeedback>
            </div>
        )
    }
)

function required(): Validator<TimeInputValue> {
    return (value: TimeInputValue): ValidatorOutput => {
        const { hours, minutes, ampm } = value

        return {
            valid:
                typeof hours !== 'undefined' &&
                typeof minutes !== 'undefined' &&
                typeof ampm !== 'undefined',
            invalidFeedback: Validators.required()('').invalidFeedback,
        }
    }
}

export const TimeValidators = {
    required,
}

import React, { useRef, useEffect } from 'react'
import moment from 'moment-timezone'
import DatePicker from 'react-datepicker'
import Popper from '@popperjs/core'
import {
    getGuid,
    Validator,
    UseValidationProps,
    useControlledValue,
    useValidation,
    ValidatorOutput,
} from '@interface-technologies/iti-react-core'
import { getValidationClass, ValidationFeedback } from '../Validation'

// MomentJS format strings
export const dateInputFormat = 'M/D/YYYY'
const timeFormat = 'h:mm a'
export const dateTimeInputFormat = `${dateInputFormat} ${timeFormat}`

// Equivalent date-fns format strings (used by react-datepicker)
export const fnsDateInputFormat = 'M/d/yyyy'
const fnsTimeFormat = 'h:mm a'
export const fnsDateTimeInputFormat = `${fnsDateInputFormat} ${fnsTimeFormat}`

export type DateInputValue = {
    // this moment doesn't have to be a specific time zone. UTC is fine, for example
    moment?: moment.Moment
    raw: string
}

export const defaultDateInputValue: DateInputValue = {
    moment: undefined,
    raw: '',
}

export function dateInputValueFromMoment(
    m: moment.Moment,
    options: { includesTime: true; timeZone: string } | { includesTime: false }
): DateInputValue {
    let raw: string

    if (options.includesTime) {
        const timeZone =
            options.timeZone === 'local' ? moment.tz.guess() : options.timeZone
        raw = m.tz(timeZone).format(dateTimeInputFormat)
    } else {
        raw = m.format(dateInputFormat)
    }

    return {
        moment: m,
        raw,
    }
}

export function convertJsDateToTimeZone(date: Date, timeZone: string): Date {
    const str = date.toLocaleString('en-US', { timeZone })
    return new Date(str)
}

// The offset of `date` must correspond to the current time zone for this to work
export function parseJsDateIgnoringTimeZone(date: Date, timeZone: string): moment.Moment {
    const str = date.toLocaleString('en-US')
    return moment.tz(str, 'M/D/YYYY, h:mm:ss A', timeZone)
}

//
// Validators
//

function getInvalidFeedback(includesTime: boolean): string {
    let invalidFeedback = 'You must enter a valid date (MM/DD/YYYY).'
    if (includesTime) {
        invalidFeedback = 'You must enter a valid date and time.'
    }

    return invalidFeedback
}

function formatValidator(includesTime = false): Validator<DateInputValue> {
    return (v: DateInputValue): ValidatorOutput => {
        let valid = false

        if (v.moment && v.moment.isValid()) {
            const format = includesTime ? dateTimeInputFormat : dateInputFormat

            if (moment(v.raw.trim(), format, true).isValid()) {
                valid = true
            }
        } else if (v.raw.length === 0) {
            valid = true
        }

        return {
            valid,
            invalidFeedback: getInvalidFeedback(includesTime),
        }
    }
}

interface RequiredOptions {
    includesTime: boolean
}

function required(
    options: RequiredOptions = { includesTime: false }
): Validator<DateInputValue> {
    return (v: DateInputValue): ValidatorOutput => ({
        valid: !!v.moment && v.moment.isValid(),
        invalidFeedback: getInvalidFeedback(options.includesTime),
    })
}

export const DateValidators = {
    required,
}

//
// DateInput component
//

interface DateInputProps extends UseValidationProps<DateInputValue> {
    id?: string
    placeholder?: string

    // This class name will be used *in addition to* form-control and the validation feedback class
    className?: string

    popperPlacement?: Popper.Placement
    includesTime?: boolean
    timeIntervals?: number
    filterDate?(date: Date): boolean
    enabled?: boolean
    showPicker?: boolean
    readOnly?: boolean

    // pass 'local' to use moment.tz.guess() as the time zone
    timeZone: string
}

export const DateInput = React.memo<DateInputProps>(
    ({
        placeholder,
        includesTime,
        popperPlacement,
        timeIntervals,
        enabled = true,
        showPicker = true,
        readOnly = false,
        filterDate,
        showValidation,
        name,
        ...otherProps
    }) => {
        const timeZone =
            otherProps.timeZone === 'local' ? moment.tz.guess() : otherProps.timeZone

        const idRef = useRef(otherProps.id ?? getGuid())
        useEffect(() => {
            if (otherProps.id && otherProps.id !== idRef.current) {
                idRef.current = otherProps.id
            }
        })

        const { value, onChange } = useControlledValue<DateInputValue>({
            value: otherProps.value,
            onChange: otherProps.onChange,
            defaultValue: otherProps.defaultValue,
            fallbackValue: defaultDateInputValue,
        })

        const { valid, invalidFeedback, asyncValidationInProgress } =
            useValidation<DateInputValue>({
                value,
                name,
                onValidChange: otherProps.onValidChange,
                validators: [formatValidator(includesTime), ...otherProps.validators],
                validationKey: otherProps.validationKey,
                asyncValidator: otherProps.asyncValidator,
                onAsyncError: otherProps.onAsyncError,
                onAsyncValidationInProgressChange:
                    otherProps.onAsyncValidationInProgressChange,
                formLevelValidatorOutput: otherProps.formLevelValidatorOutput,
            })

        const fnsFormat = includesTime ? fnsDateTimeInputFormat : fnsDateInputFormat
        const momentFormat = includesTime ? dateTimeInputFormat : dateInputFormat

        function datePickerOnChange(date: Date | null): void {
            const myMoment = date ? parseJsDateIgnoringTimeZone(date, timeZone) : null

            onChange({
                moment: myMoment || undefined,
                raw: myMoment ? myMoment.format(momentFormat) : '',
            })
        }

        function noPickerOnChange(e: React.FocusEvent<HTMLInputElement>): void {
            const raw = e.currentTarget.value
            if (typeof raw !== 'string') return

            // Don't use strict parsing, because it will reject partial datetimes
            const myMoment = moment.tz(raw.trim(), momentFormat, timeZone)

            onChange({
                moment: myMoment.isValid() ? myMoment : undefined,
                raw,
            })
        }

        const classes = ['form-control', getValidationClass(valid, showValidation)]
        if (otherProps.className) classes.push(otherProps.className)

        const className = classes.join(' ')

        return (
            <ValidationFeedback
                valid={valid}
                showValidation={showValidation}
                invalidFeedback={invalidFeedback}
                asyncValidationInProgress={asyncValidationInProgress}
            >
                {showPicker && (
                    <DatePicker
                        id={idRef.current}
                        name={name}
                        selected={
                            value.moment
                                ? convertJsDateToTimeZone(value.moment.toDate(), timeZone)
                                : null
                        }
                        onChange={datePickerOnChange}
                        className={className}
                        dateFormat={fnsFormat}
                        placeholderText={placeholder}
                        popperPlacement={popperPlacement}
                        disabledKeyboardNavigation
                        showTimeSelect={includesTime}
                        timeIntervals={timeIntervals}
                        timeFormat={timeFormat}
                        filterDate={filterDate}
                        disabled={!enabled}
                        readOnly={readOnly}
                        autoComplete="off"
                    />
                )}
                {!showPicker && (
                    <div className="date-input-no-picker-wrapper">
                        <input
                            id={idRef.current}
                            name={name}
                            value={value ? value.raw : ''}
                            onChange={noPickerOnChange}
                            className={className}
                            placeholder={placeholder}
                            disabled={!enabled}
                            readOnly={readOnly}
                            autoComplete="off"
                        />
                    </div>
                )}
            </ValidationFeedback>
        )
    }
)

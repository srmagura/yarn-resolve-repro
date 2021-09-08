import React, { useContext } from 'react'
import Select from 'react-select'
import { ValueType, ActionMeta, GroupTypeBase } from 'react-select/src/types'
import {
    UseValidationProps,
    useControlledValue,
    useValidation,
    Validator,
    Validators,
    ValidatorOutput,
} from '@interface-technologies/iti-react-core'
import { getSelectStyles } from './GetSelectStyles'
import { ItiReactContext } from '../../ItiReactContext'
import { ValidationFeedback } from '../../Validation'
import { CommonSelectProps } from './CommonSelectProps'
import { SelectOption, getNonGroupOptions, filterOption } from './SelectOption'

export type SelectValue = string | number | null

interface ValidatedSelectProps
    extends CommonSelectProps,
        UseValidationProps<SelectValue> {
    id?: string
    options: SelectOption[] | GroupTypeBase<SelectOption>[]
}

export const ValidatedSelect = React.memo(
    ({
        id,
        name,
        options,
        validators,
        showValidation,
        placeholder,
        className,
        formControlSize,
        width,
        components,
        isLoading,
        enabled = true,
        isClearable = false,
        getStyles = getSelectStyles,
        isOptionEnabled,
        menuIsOpen,
        onMenuOpen,
        onMenuClose,
        menuPlacement,
        ...props
    }: ValidatedSelectProps) => {
        const { value, onChange: _onChange } = useControlledValue<SelectValue>({
            value: props.value,
            onChange: props.onChange,
            defaultValue: props.defaultValue,
            fallbackValue: null,
        })

        function onChange(
            option0: ValueType<SelectOption, boolean>,
            actionMeta: ActionMeta<SelectOption>
        ): void {
            // option will be an array if the user presses backspace

            // This is so that if isClearable = false, null will never be passed to the
            // onChange prop
            if (!isClearable && actionMeta.action === 'pop-value') return

            const option = option0 as SelectOption

            // Be careful with the conditional - option.value could be 0
            let newValue: SelectValue = null
            if (option && option.value !== null) {
                newValue = option.value
            }

            _onChange(newValue)
        }

        const { valid, invalidFeedback, asyncValidationInProgress } =
            useValidation<SelectValue>({
                value,
                name,
                onValidChange: props.onValidChange,
                validators,
                validationKey: props.validationKey,
                asyncValidator: props.asyncValidator,
                onAsyncError: props.onAsyncError,
                onAsyncValidationInProgressChange:
                    props.onAsyncValidationInProgressChange,
                formLevelValidatorOutput: props.formLevelValidatorOutput,
            })

        const { themeColors } = useContext(ItiReactContext)

        const nonGroupOptions = getNonGroupOptions(options)

        let selectValue: SelectOption | null = null

        // Be careful: value can be 0
        if (value !== null) {
            const findResult = nonGroupOptions.find((o) => o.value === value)
            if (findResult) selectValue = findResult
        }

        let isOptionDisabled
        if (isOptionEnabled)
            isOptionDisabled = (o: SelectOption): boolean => !isOptionEnabled(o)

        return (
            <ValidationFeedback
                valid={valid}
                invalidFeedback={invalidFeedback}
                showValidation={showValidation}
                asyncValidationInProgress={asyncValidationInProgress}
            >
                <Select
                    name={name}
                    className={className}
                    inputId={id}
                    options={options}
                    placeholder={placeholder}
                    value={selectValue}
                    onChange={onChange}
                    isClearable={isClearable}
                    isDisabled={!enabled}
                    isLoading={isLoading}
                    isOptionDisabled={isOptionDisabled}
                    styles={getStyles({
                        valid,
                        showValidation,
                        themeColors,
                        width,
                        formControlSize,
                        isMulti: false,
                    })}
                    aria-label={props['aria-label']}
                    aria-labelledby={props['aria-labelledby']}
                    components={components}
                    menuIsOpen={menuIsOpen}
                    onMenuOpen={onMenuOpen}
                    onMenuClose={onMenuClose}
                    menuPlacement={menuPlacement}
                    filterOption={filterOption}
                />
                {/* ReactSelect does not render the input when isDisabled = true. Render a hidden input with the value,
                 * for situations where the select is disabled but it has a default/controlled value. */}
                {!enabled && <input type="hidden" name={name} value={value ?? ''} />}
            </ValidationFeedback>
        )
    }
)

function required(): Validator<SelectValue> {
    return (value: SelectValue): ValidatorOutput => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback,
    })
}

export const SelectValidators = {
    required,
}

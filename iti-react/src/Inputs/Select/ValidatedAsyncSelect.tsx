import React, { useContext, useEffect, useRef } from 'react'
import { ValueType, ActionMeta, GroupTypeBase } from 'react-select'
import AsyncSelect from 'react-select/async'
import {
    UseValidationProps,
    useControlledValue,
    useValidation,
    Validator,
    Validators,
    ValidatorOutput,
} from '@interface-technologies/iti-react-core'
import debounce from 'debounce-promise'
import { getSelectStyles, GetSelectStylesOptions } from './GetSelectStyles'
import { ItiReactContext } from '../../ItiReactContext'
import { ValidationFeedback } from '../../Validation'
import { CommonSelectProps } from './CommonSelectProps'
import { SelectOption, filterOption } from './SelectOption'

export type AsyncSelectValue = SelectOption | null

interface ValidatedAsyncSelectProps
    extends CommonSelectProps,
        UseValidationProps<AsyncSelectValue> {
    id?: string
    loadOptions: (
        inputValue: string
    ) => Promise<SelectOption[] | GroupTypeBase<SelectOption>[]>
    noOptionsMessage?: (obj: { inputValue: string }) => string | null
}

export const ValidatedAsyncSelect = React.memo<ValidatedAsyncSelectProps>(
    ({
        id,
        name,
        validators,
        showValidation,
        loadOptions,
        placeholder,
        noOptionsMessage,
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
    }) => {
        const { value, onChange: _onChange } = useControlledValue<AsyncSelectValue>({
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
            let newValue: AsyncSelectValue = null
            if (option && option.value !== null) {
                newValue = option
            }

            _onChange(newValue)
        }

        const { valid, invalidFeedback, asyncValidationInProgress } =
            useValidation<AsyncSelectValue>({
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
        const stylesOptions: GetSelectStylesOptions = {
            valid,
            showValidation,
            themeColors,
            width,
            formControlSize,
            isMulti: false,
        }

        let isOptionDisabled
        if (isOptionEnabled)
            isOptionDisabled = (o: SelectOption): boolean => !isOptionEnabled(o)

        const loadOptionsRef = useRef(loadOptions)
        useEffect(() => {
            loadOptionsRef.current = loadOptions
        })

        const loadOptionsDebouncedRef = useRef(
            debounce((inputValue: string) => loadOptionsRef.current(inputValue), 500)
        )

        return (
            <ValidationFeedback
                valid={valid}
                invalidFeedback={invalidFeedback}
                showValidation={showValidation}
                asyncValidationInProgress={asyncValidationInProgress}
            >
                <AsyncSelect
                    name={name}
                    className={className}
                    inputId={id}
                    loadOptions={loadOptionsDebouncedRef.current}
                    value={value}
                    noOptionsMessage={noOptionsMessage}
                    placeholder={placeholder}
                    onChange={onChange}
                    isClearable={isClearable}
                    isDisabled={!enabled}
                    isLoading={isLoading}
                    isOptionDisabled={isOptionDisabled}
                    styles={getStyles(stylesOptions)}
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
                {!enabled && (
                    <input type="hidden" name={name} value={value ? value.value : ''} />
                )}
            </ValidationFeedback>
        )
    }
)

function required(): Validator<AsyncSelectValue> {
    return (value: AsyncSelectValue): ValidatorOutput => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback,
    })
}

export const AsyncSelectValidators = {
    required,
}

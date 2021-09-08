import React from 'react'
import { RadioOption, RadioInputValue } from './RadioInputTypes'

interface RadioButtonProps {
    radioOption: RadioOption
    name: string
    enabled: boolean
    inline: boolean

    value: RadioInputValue
    onChange(value: string | number): void
}

export function RadioButton(props: RadioButtonProps): React.ReactElement {
    const { name, value, enabled, radioOption, onChange, inline } = props

    const id = `${name}-${radioOption.value}`

    const classes = ['form-check', radioOption.value.toString()]
    if (inline) classes.push('form-check-inline')

    return (
        <div className={classes.join(' ')} key={radioOption.value}>
            <input
                type="radio"
                className="form-check-input"
                name={name}
                id={id}
                value={radioOption.value}
                checked={radioOption.value === value}
                onChange={(): void => onChange(radioOption.value)}
                disabled={!enabled}
            />
            <label className="form-check-label user-select-none" htmlFor={id}>
                {radioOption.label}
            </label>
        </div>
    )
}

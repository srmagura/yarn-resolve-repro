/* eslint-disable react/button-has-type */
import React, { useContext } from 'react'
import { ItiReactContext } from '../ItiReactContext'
import { LinkButton } from './LinkButton'

interface SubmitButtonOwnProps {
    element?: 'button' | 'a'
    submitting: boolean

    // Enable/disable the onClick event without changing the button style
    onClickEnabled?: boolean

    // Enable/disable the onClick event and change the button style.
    // If provided, overrides the value of onClickEnabled.
    enabled?: boolean
    type?: 'button' | 'submit' | 'reset'
}

type SubmitButtonProps = SubmitButtonOwnProps &
    (
        | Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
        | Omit<React.HTMLProps<HTMLAnchorElement>, 'type'>
    )

/* Submit button/link that displays a loading indicator and disables the onClick handler
 * when submitting=true. */
export function SubmitButton({
    element = 'button',
    submitting,
    children,
    onClick,
    onClickEnabled = true,
    enabled = true,
    className,
    type = 'submit',
    ...passThroughProps
}: SubmitButtonProps): React.ReactElement {
    const { renderLoadingIndicator } = useContext(ItiReactContext)

    if (submitting || !enabled) {
        onClickEnabled = false
    }

    if (!onClickEnabled) {
        onClick = undefined
    }

    if (typeof className === 'undefined') {
        className = ''
    }

    className += ' submit-button'

    if (element === 'button') {
        // if submitting or !onClickEnabled, set type to 'button' to prevent
        // buttons with type="submit" submitting the form
        const _type = onClickEnabled && !submitting ? type : 'button'

        return (
            <button
                {...(passThroughProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                className={className}
                onClick={
                    onClick as
                        | ((e: React.MouseEvent<HTMLButtonElement>) => void)
                        | undefined
                }
                type={_type}
                disabled={!enabled}
            >
                {submitting ? <span className="hidden-label">{children}</span> : children}
                {submitting && (
                    <div className="loading-icon-container">
                        {renderLoadingIndicator()}
                    </div>
                )}
            </button>
        )
    }

    if (!enabled) className += ' disabled'

    return (
        <LinkButton
            {...(passThroughProps as React.HTMLProps<HTMLAnchorElement>)}
            className={className}
            onClick={
                onClick as ((e: React.MouseEvent<HTMLAnchorElement>) => void) | undefined
            }
        >
            {children}
            {submitting && <span> {renderLoadingIndicator()}</span>}
        </LinkButton>
    )
}

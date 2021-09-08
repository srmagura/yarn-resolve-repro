import React, { useContext, useEffect, useState } from 'react'
import { defaults } from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import { ItiReactContext } from '../ItiReactContext'

export function useDebouncedAsyncValidationInProgress(
    propsAsyncValidationInProgress: boolean
): boolean {
    const [asyncValidationInProgress, setAsyncValidationInProgress] = useState(false)

    const setToInProgress = useDebouncedCallback(
        () => setAsyncValidationInProgress(true),
        1000
    )

    useEffect(() => {
        if (propsAsyncValidationInProgress) {
            setToInProgress()
        } else {
            setToInProgress.cancel()
            setAsyncValidationInProgress(false)
        }
    }, [propsAsyncValidationInProgress, setToInProgress, setAsyncValidationInProgress])

    return asyncValidationInProgress
}

export interface ValidationFeedbackProps {
    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress?: boolean
    renderLoadingIndicator?: () => React.ReactNode
    children?: React.ReactNode
}

export function ValidationFeedback(props: ValidationFeedbackProps): JSX.Element {
    const {
        valid,
        showValidation,
        children,
        invalidFeedback,
        asyncValidationInProgress: propsAsyncValidationInProgress,
        renderLoadingIndicator,
    } = defaults(
        { ...props },
        {
            asyncValidationInProgress: false,
            renderLoadingIndicator: useContext(ItiReactContext).renderLoadingIndicator,
        }
    )

    const asyncValidationInProgress = useDebouncedAsyncValidationInProgress(
        propsAsyncValidationInProgress
    )

    let feedback: React.ReactNode

    if (showValidation && asyncValidationInProgress) {
        feedback = (
            <div className="in-progress-feedback">
                {renderLoadingIndicator()} Validating...
            </div>
        )
    } else if (showValidation && !valid && invalidFeedback) {
        // invalid-feedback has a margin, so do not render it if invalidFeedback is empty
        feedback = <div className="invalid-feedback">{invalidFeedback}</div>
    }

    return (
        <div className="validated-input">
            {children}
            {feedback}
        </div>
    )
}

export function getValidationClass(valid: boolean, showValidation: boolean): string {
    if (showValidation) {
        if (valid) return 'is-valid'
        return 'is-invalid'
    }

    return ''
}

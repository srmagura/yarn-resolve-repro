import React, { useRef, useContext } from 'react'
import { getGuid } from '@interface-technologies/iti-react-core'

import { ItiReactContext } from '../ItiReactContext'

interface FormGroupProps {
    label?: string | JSX.Element
    className?: string
    style?: React.CSSProperties
    loading?: boolean
    optional?: boolean

    children?: React.ReactNode | ((id: string) => React.ReactNode)
    'data-testid'?: string
}

export function FormGroup({
    label,
    className,
    style,
    loading,
    optional = false,
    ...props
}: FormGroupProps): React.ReactElement {
    const idRef = useRef(getGuid())
    const { renderLoadingIndicator } = useContext(ItiReactContext)

    let labelInner = label
    if (optional) {
        labelInner = (
            <span>
                {label} <span className="optional">(optional)</span>
            </span>
        )
    }

    let children

    if (typeof props.children === 'function') {
        const renderProp = props.children as (id: string) => React.ReactNode
        children = renderProp(idRef.current)
    } else {
        children = props.children
    }

    return (
        <div
            className={`form-group ${className || ''}`}
            style={style}
            data-testid={props['data-testid']}
        >
            {label && (
                <label className="form-label" htmlFor={idRef.current}>
                    {labelInner}{' '}
                    {typeof loading !== 'undefined' &&
                        loading &&
                        renderLoadingIndicator()}
                </label>
            )}
            {children}
        </div>
    )
}

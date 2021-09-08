import React, { PropsWithChildren } from 'react'

export function MoneyInputContainer({
    children,
}: PropsWithChildren<unknown>): React.ReactElement {
    return (
        <div className="money-input-container">
            <div className="dollar-sign">$</div>
            {children}
        </div>
    )
}

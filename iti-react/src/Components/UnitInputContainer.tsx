import React, { PropsWithChildren } from 'react'

interface UnitInputContainerProps {
    unit: React.ReactNode
    className?: string
}

export function UnitInputContainer({
    children,
    unit,
    className,
}: PropsWithChildren<UnitInputContainerProps>): React.ReactElement {
    const classes = ['unit-input-container']
    if (className) classes.push(className)

    return (
        <div className={classes.join(' ')}>
            {children}
            <div className="unit">{unit}</div>
        </div>
    )
}

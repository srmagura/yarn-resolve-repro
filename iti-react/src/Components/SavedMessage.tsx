import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect, useRef } from 'react'

interface SavedMessageProps {
    showSavedMessageRef: React.MutableRefObject<() => void>

    className?: string
}

export function SavedMessage(props: SavedMessageProps): React.ReactElement {
    const { showSavedMessageRef, className } = props

    const [show, setShow] = useState(false)
    const timerRef = useRef<number>()

    function onSave(): void {
        setShow(true)

        clearTimeout(timerRef.current)
        timerRef.current = window.window.setTimeout(() => setShow(false), 1800)
    }

    useEffect(() => {
        showSavedMessageRef.current = onSave
    })

    useEffect(
        () => (): void => {
            clearTimeout(timerRef.current)
        },
        []
    )

    const classes = ['saved-message']
    if (className) classes.push(className)

    return (
        <div className={classes.join(' ')} style={{ opacity: show ? 1 : 0 }}>
            <FontAwesomeIcon icon={faCheck} /> Saved
        </div>
    )
}

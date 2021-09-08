import React, { useState, useEffect } from 'react'
import copyToClipboard from 'copy-to-clipboard'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ClickToCopyProps {
    text: string
    className?: string

    forceUpdateTooltips(): void
}

export function ClickToCopy(props: ClickToCopyProps): React.ReactElement {
    const { text, className, forceUpdateTooltips } = props

    const [copied, setCopied] = useState(false)

    function copy(): void {
        copyToClipboard(text)
        setCopied(true)
    }

    useEffect(() => {
        if (!copied) return undefined

        forceUpdateTooltips()

        const timer = window.setTimeout(() => setCopied(false), 100)
        return (): void => {
            window.clearTimeout(timer)
        }
    }, [copied, forceUpdateTooltips])

    const tooltip = copied ? 'Copied!' : 'Click to copy'

    const classes = ['click-to-copy']
    if (className) classes.push(className)

    // This component depends on your app having a tooltip library (e.g. react-hint)
    // that looks for a data-tooltip attribute.
    //
    // If the user clicks the button before the "Click to copy" tooltip has been
    // shown, the "Copied!" tooltip won't be shown either. If this is an issue,
    // set the tooltip delay to 100 ms or less.
    return (
        <div
            className={classes.join(' ')}
            data-tooltip={tooltip}
            onClick={copy}
            onKeyDown={(e): void => {
                if (e.key === 'Enter') copy()
            }}
            role="button"
            tabIndex={0}
        >
            <FontAwesomeIcon icon={faCopy} />
        </div>
    )
}

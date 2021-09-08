import React, { useState, useEffect } from 'react'
import { ItiReactContext } from '../../ItiReactContext'

const delayMs = 200

interface TabContentLoadingProps {
    renderLoadingIndicator?(): React.ReactNode
}

export function TabContentLoading(props: TabContentLoadingProps): React.ReactElement {
    const [pastDelay, setPastDelay] = useState(false)

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setPastDelay(true)
        }, delayMs)

        return (): void => {
            window.clearTimeout(timer)
        }
    }, [])

    // We're doing this weird thing with two LoadingIcons so that
    // - the height of the component doesn't change when pastDelay becomes true
    // - the real LoadingIcon's fadeIn animation doesn't play while it is invisible

    return (
        <ItiReactContext.Consumer>
            {(data): React.ReactElement => {
                // If no render prop was supplied, fallback to the context's renderLoadingIndicator
                const renderLoadingIndicator =
                    props.renderLoadingIndicator ?? data.renderLoadingIndicator

                return (
                    <div className="tab-content-loading">
                        <div className={pastDelay ? 'd-none' : 'invisible'}>
                            {renderLoadingIndicator()}
                        </div>
                        <div className={pastDelay ? '' : 'd-none'}>
                            {renderLoadingIndicator()}
                        </div>
                    </div>
                )
            }}
        </ItiReactContext.Consumer>
    )
}

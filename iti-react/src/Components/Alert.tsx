import React, { useRef } from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'
import { defaults } from 'lodash'
import useEventListener from '@use-it/event-listener'
import { Dialog } from './Dialog'

interface Options {
    title?: React.ReactNode
    modalClass?: string
}

const defaultOptions: Partial<Options> = {
    title: 'Alert',
}

// When testing, make sure the dialog fades out when closed, instead
// of suddenly disappearing

interface AlertDialogPresentationProps extends ReactConfirmProps {
    options: Options
}

function AlertDialogPresentation({
    show,
    confirmation,
    proceed,
    options,
}: AlertDialogPresentationProps): React.ReactElement | null {
    const { title, modalClass } = defaults({ ...options }, defaultOptions)

    const closeRef = useRef(() => {
        /* no-op */
    })

    useEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            closeRef.current()
        }
    })

    if (!show) return null

    return (
        <Dialog
            title={title}
            onClose={proceed}
            modalFooter={
                <button
                    className="btn btn-primary"
                    onClick={(): void => closeRef.current()}
                    type="button"
                >
                    OK
                </button>
            }
            closeRef={closeRef}
            focusFirst
            focusFirstOptions={{ additionalTagNames: ['button'] }}
            modalClass={modalClass}
        >
            {confirmation}
        </Dialog>
    )
}

// Using react-confirm here since it takes care of mounting the dialog outside
// of the main component tree

// Matches the type in ReactConfirmProps (@types/react-confirm)
type Content = string | React.ReactElement

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component
const ConfirmableDialog = confirmable(AlertDialogPresentation)

const _confirm = createConfirmation(ConfirmableDialog)

export function alert(content: Content, options?: Options): Promise<void> {
    return _confirm({ options, confirmation: content }).then(() => undefined) // ignore return value
}

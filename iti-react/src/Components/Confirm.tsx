import React, { useRef } from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'
import { defaults } from 'lodash'
import { ActionDialog } from './Dialog'

interface Options {
    title?: React.ReactNode
    actionButtonText: string
    actionButtonClass?: string
    cancelButtonText?: string
    modalClass?: string
}

const defaultOptions: Partial<Options> = {
    title: 'Confirm',
}

// When testing, make sure the dialog fades out when closed, instead
// of suddenly disappearing

interface ConfirmDialogPresentationProps extends ReactConfirmProps {
    options: Options
    closeRef?: React.MutableRefObject<() => void>
    loading?: boolean
    isStandalone?: boolean
}

function ConfirmDialogPresentation({
    show,
    confirmation,
    loading = false,
    isStandalone = false,
    options,
    closeRef: propsCloseRef,
    ...otherProps
}: ConfirmDialogPresentationProps): React.ReactElement | null {
    const privateCloseRef = useRef(() => {})
    const closeRef = propsCloseRef ?? privateCloseRef

    const proceedCalledRef = useRef(false)

    let proceed: () => void
    let onClose: () => void

    if (isStandalone) {
        proceed = otherProps.proceed
        onClose = () => {
            if (!proceedCalledRef.current) otherProps.cancel()
        }
    } else {
        proceed = () => {
            proceedCalledRef.current = true
            closeRef.current()
        }

        onClose = () => {
            if (proceedCalledRef.current) {
                otherProps.proceed()
            } else {
                // important: we want to be able to await our confirm function, so call cancel
                // instead of dismiss so that closing the dialog results in the promise being rejected.
                // react-confirm does not resolve or reject if you call dismiss()
                otherProps.cancel()
            }
        }
    }

    const {
        cancelButtonText,
        actionButtonText,
        actionButtonClass,
        modalClass,
        title,
    } = defaults({ ...options }, defaultOptions)

    if (!show) return null

    return (
        <ActionDialog
            title={title}
            onClose={onClose}
            closeRef={closeRef}
            actionButtonText={actionButtonText}
            actionButtonClass={actionButtonClass}
            cancelButtonText={cancelButtonText}
            action={proceed}
            actionInProgress={loading}
            focusFirst
            focusFirstOptions={{ additionalTagNames: ['button'] }}
            modalClass={modalClass}
        >
            {confirmation}
        </ActionDialog>
    )
}

// Matches the type in ReactConfirmProps (@types/react-confirm)
type Confirmation = string | React.ReactElement

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component
const ConfirmableDialog = confirmable(ConfirmDialogPresentation)

const confirm0 = createConfirmation(ConfirmableDialog)

export function confirm(confirmation: Confirmation, options: Options): Promise<void> {
    return confirm0({ options, confirmation }).then(() => undefined) // ignore return value
}

interface ConfirmDialogProps extends Options {
    confirmation: Confirmation
    proceed: () => void
    cancel: () => void
    loading?: boolean
    closeRef?: React.MutableRefObject<() => void>
    modalClass?: string
}

// Standalone confirm dialog that does not use react-confirm
export function ConfirmDialog({
    confirmation,
    proceed,
    cancel,
    actionButtonText,
    actionButtonClass,
    loading = false,
    title,
    cancelButtonText,
    closeRef,
    modalClass,
}: ConfirmDialogProps): React.ReactElement {
    const options: Options = {
        title,
        actionButtonText,
        actionButtonClass,
        cancelButtonText,
        modalClass,
    }

    return (
        <ConfirmDialogPresentation
            isStandalone
            confirmation={confirmation}
            proceed={proceed}
            cancel={cancel}
            dismiss={(): void => {
                throw new Error(
                    'ConfirmDialogPresentation called dismiss(). This should never happen!'
                )
            }}
            show
            loading={loading}
            options={options}
            closeRef={closeRef}
        />
    )
}

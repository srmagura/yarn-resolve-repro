import $ from 'jquery'
import { defer } from 'lodash'
import useEventListener from '@use-it/event-listener'

interface UsePopoverClickListenerOptions {
    visible: boolean
    onOutsideClick: () => void
    popoverSelector?: string
}

export function usePopoverClickListener({
    visible,
    onOutsideClick,
    popoverSelector = '.iti-react-popover',
}: UsePopoverClickListenerOptions): void {
    function onClick(e: MouseEvent): void {
        if (!visible) return

        if (!e.target) return
        const target = $(e.target)

        // Hack to prevent clicking a react select option from closing the popover
        if (target.parents('[class$="-menu"]').length > 0) return

        const inPopover =
            target.is(popoverSelector) || target.parents(popoverSelector).length > 0

        if (!inPopover) {
            // To understand why we use defer here, consider what would happen if we
            // did NOT user defer. When the reference element is clicked, onOutsideClick
            // would be called immediately and the popover would be hidden. Then the
            // onClick handler of the reference element would fire, immediately showing
            // the popover again.

            // We used to prevent this using e.stopPropagation(), but stopping
            // propagation causes LinkButton act like a link to # instead of
            // a button.
            defer(onOutsideClick)
        }
    }

    useEventListener('click', onClick, $('body')[0])
}

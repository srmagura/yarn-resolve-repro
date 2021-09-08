import React from 'react'
import { LinkButton } from './LinkButton'

interface PagerLinkProps {
    onClick(): void
    active?: boolean
    enabled: boolean
    children?: React.ReactNode
}

// Mark as disabled (rather than making it invisible) so the pager doesn't
// jump around
function PagerLink({ active, onClick, enabled, children }: PagerLinkProps): JSX.Element {
    return (
        <li
            className={`page-item ${active ? 'active' : ''} ${enabled ? '' : 'disabled'}`}
        >
            <LinkButton
                className="page-link"
                tabIndex={enabled ? undefined : -1}
                onClick={onClick}
            >
                {children}
            </LinkButton>
        </li>
    )
}

interface PagerProps {
    page: number
    totalPages: number
    onPageChange(page: number): void

    enabled?: boolean
    containerClassName?: string
}

export const Pager = React.memo<PagerProps>(
    ({
        page,
        totalPages,
        onPageChange,
        enabled = true,
        containerClassName = 'pagination-container',
    }) => {
        const firstPage = 1
        const hasPrevious = page !== firstPage
        const hasNext = page < totalPages

        // Don't want to show too many pages if there are a lot
        const pagesToDisplay = 5 // odd number

        let pageNumbers = [page]

        let distance = 1

        // add page number to the left and right until hit the pagesToDisplay
        // and/or run out of pages
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const left = page - distance
            const addLeft = left >= firstPage
            if (addLeft) pageNumbers = [left].concat(pageNumbers)

            const right = page + distance
            const addRight = right <= totalPages
            if (addRight) pageNumbers.push(right)

            if (pageNumbers.length === pagesToDisplay || (!addLeft && !addRight)) {
                break
            }

            distance += 1
        }

        return (
            <nav aria-label="Page navigation" className={containerClassName}>
                <ul className="pagination">
                    <PagerLink
                        onClick={(): void => onPageChange(page - 1)}
                        key="prev"
                        enabled={enabled && hasPrevious}
                    >
                        <span aria-hidden="true">&laquo;</span>
                        <span className="visually-hidden">Previous</span>
                    </PagerLink>

                    {pageNumbers.map((i: number) => (
                        <PagerLink
                            onClick={(): void => onPageChange(i)}
                            active={page === i}
                            key={i.toString()}
                            enabled={enabled}
                        >
                            {i}
                        </PagerLink>
                    ))}

                    <PagerLink
                        onClick={(): void => onPageChange(page + 1)}
                        key="next"
                        enabled={enabled && hasNext}
                    >
                        <span aria-hidden="true">&raquo;</span>
                        <span className="visually-hidden">Next</span>
                    </PagerLink>
                </ul>
            </nav>
        )
    }
)

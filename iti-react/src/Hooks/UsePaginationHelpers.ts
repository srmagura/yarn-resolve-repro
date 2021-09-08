import { useEffect, useRef } from 'react'
import { defaults } from 'lodash'
import {
    selectFiltersByExcludingProperties,
    resetPageIfFiltersChanged,
    preventNonExistentPage,
    getTotalPages,
} from '@interface-technologies/iti-react-core'

// A hook that combines three things that need to be implemented when using pagination:
// - Resets page when filters change
// - Returns total number of pages
// - If the current page has no items and is not the first page, decrements the page
//   (prevent non-existent pages). This situation occurs when someone deletes items
//   while the user is viewing a paginated list.
//
// Usage:
//
//     const totalPages = usePaginationHelpers(/* ... */)
//
export function usePaginationHelpers<
    TQueryParams extends { page: number; pageSize?: number }
>(options: {
    queryParams: TQueryParams
    items: unknown[]
    totalCount: number
    pageSizeWhenItemsRetrieved: number

    onPageChange(page: number): void

    firstPage?: 0 | 1
}): number {
    const {
        queryParams,
        onPageChange,
        firstPage,
        items,
        totalCount,
        pageSizeWhenItemsRetrieved,
    } = defaults(options, {
        firstPage: 1,
    })

    const prevQueryParamsRef = useRef<TQueryParams>()

    useEffect(() => {
        if (prevQueryParamsRef.current) {
            const newPage = resetPageIfFiltersChanged(
                prevQueryParamsRef.current,
                queryParams,
                firstPage,
                (qp) => selectFiltersByExcludingProperties(qp, ['page', 'pageSize'])
            ).page

            if (queryParams.page !== newPage) onPageChange(newPage)
        }

        prevQueryParamsRef.current = queryParams
    }, [queryParams, firstPage, onPageChange])

    const pageHasItems = items.length !== 0

    useEffect(() => {
        preventNonExistentPage({
            page: queryParams.page,
            pageHasItems,
            onPageChange,
            firstPage,
        })
    }, [queryParams.page, pageHasItems, onPageChange, firstPage])

    return getTotalPages(totalCount, pageSizeWhenItemsRetrieved)
}

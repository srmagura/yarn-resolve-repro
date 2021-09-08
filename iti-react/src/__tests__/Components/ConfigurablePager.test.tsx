import React from 'react'
import selectEvent from 'react-select-event'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, act } from '@testing-library/react'
import {
    pageActions,
    pageReducer,
    ConfigurablePager,
} from '../../Components/ConfigurablePager'
import { waitForReactUpdates } from '../__helpers__'

jest.useFakeTimers()

describe('ConfigurablePager', () => {
    it('lets you change the page size', async () => {
        const onChange = jest.fn()

        render(
            <ConfigurablePager
                page={1}
                pageSize={10}
                totalPages={10}
                pageSizes={[10, 13, 17]}
                onChange={onChange}
            />
        )

        await act(async () => {
            await selectEvent.select(screen.getByLabelText('Items per page'), '13')
            await waitForReactUpdates()
        })

        expect(onChange).toHaveBeenCalled()
        expect(onChange).toHaveBeenCalledWith(1, 13)
    })

    it('lets you change the page', async () => {
        const onChange = jest.fn()

        render(
            <ConfigurablePager
                page={1}
                pageSize={10}
                totalPages={10}
                pageSizes={[10, 13, 17]}
                onChange={onChange}
            />
        )

        fireEvent.click(screen.getByText('2'))
        await waitForReactUpdates()

        expect(onChange).toHaveBeenCalled()
        expect(onChange).toHaveBeenCalledWith(2, 10)
    })
})

describe('pageReducer', () => {
    test('setPage', () => {
        const { page, pageSize } = pageReducer(
            { page: 3, pageSize: 10 },
            pageActions.setPage(7)
        )

        expect(page).toBe(7)
        expect(pageSize).toBe(10)
    })

    describe('setPageSize', () => {
        test('normal', () => {
            const { page, pageSize } = pageReducer(
                { page: 8, pageSize: 10 },
                pageActions.setPageSize(25)
            )

            // firstVisibleItemIndex = 70
            expect(page).toBe(3)
            expect(pageSize).toBe(25)
        })

        test('below boundary', () => {
            const { page, pageSize } = pageReducer(
                { page: 10, pageSize: 11 },
                pageActions.setPageSize(25)
            )

            // firstVisibleItemIndex = 99
            expect(page).toBe(4)
            expect(pageSize).toBe(25)
        })

        test('above boundary', () => {
            const { page, pageSize } = pageReducer(
                { page: 2, pageSize: 26 },
                pageActions.setPageSize(25)
            )

            // firstVisibleItemIndex = 26
            expect(page).toBe(2)
            expect(pageSize).toBe(25)
        })

        test("doesn't set page to 0", () => {
            const { page, pageSize } = pageReducer(
                { page: 1, pageSize: 10 },
                pageActions.setPageSize(25)
            )

            expect(page).toBe(1)
            expect(pageSize).toBe(25)
        })
    })
})

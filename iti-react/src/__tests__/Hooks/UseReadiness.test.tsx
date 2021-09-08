import { renderHook } from '@testing-library/react-hooks'
import { useReadiness } from '../../Hooks'

interface Readiness {
    a: boolean
}

it('returns an onChildReady with a stable identity', () => {
    const props = {
        defaultValue: { a: false },
        onChange: (): void => {
            /* no-op */
        },
    }

    const { result, rerender } = renderHook(
        (props) => useReadiness<Readiness>(props.defaultValue, props.onChange),
        {
            initialProps: {
                ...props,
                defaultValue: { a: false },
            },
        }
    )
    const result0 = result.current

    rerender({ ...props, defaultValue: { a: true } })
    const result1 = result.current

    expect(result0[0]).toBe(result1[0])
    expect(result0[1]).toBe(result1[1])
})

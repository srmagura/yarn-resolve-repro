import { merge } from 'lodash'
import { useState, useEffect, useCallback, useRef } from 'react'

export function allReady<T extends { [K in keyof T]: boolean }>(readiness: T): boolean {
    return Object.values(readiness).every((v) => v)
}

// Usage:
//
// interface Readiness {
//     a: boolean
//     b: boolean
//     c: boolean
// }
//
// const [onChildReady, readiness] = useReadiness<Readiness>(
//     {
//         a: false, b: false, c: false
//     },
//     readiness => {
//         if (allReady(readiness)) {
//             onReady(/* ... */)
//         }
//     },
// )
//
export function useReadiness<TReadiness>(
    defaultValue: TReadiness,
    onChange: (readiness: TReadiness) => void
): [(delta: Partial<TReadiness>) => void, TReadiness] {
    const [readiness, setReadiness] = useState(defaultValue)

    const onChangeRef = useRef(onChange)
    useEffect(() => {
        onChangeRef.current = onChange
    })

    useEffect(() => {
        onChangeRef.current(readiness)
    }, [readiness])

    const onChildReady = useCallback(
        (delta: Partial<TReadiness>) => {
            setReadiness((readiness) => merge({ ...readiness }, delta))
        },
        [setReadiness]
    )

    return [onChildReady, readiness]
}

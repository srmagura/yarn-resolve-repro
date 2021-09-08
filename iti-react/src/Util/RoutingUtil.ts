import { Location } from 'history'
import { isEqual } from 'lodash'

export function areLocationsEqualIgnoringKey(a: Location, b: Location): boolean {
    return (
        a.pathname === b.pathname &&
        a.search === b.search &&
        a.hash === b.hash &&
        isEqual(a.state, b.state)
    )
}

export function stripTrailingSlash(path: string): string {
    return path.endsWith('/') ? path.slice(0, -1) : path
}

export function arePathsEqual(path1: string, path2: string): boolean {
    function normalize(p: string): string {
        return stripTrailingSlash(p).toLowerCase()
    }

    return normalize(path1) === normalize(path2)
}

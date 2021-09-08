import { resolveValue } from '../../Inputs/TimeZoneInput'

describe('resolve value', () => {
    it('does not change value if there is a matching option', () => {
        const onChange = jest.fn()
        resolveValue('America/Denver', onChange)
        expect(onChange).not.toHaveBeenCalled()
    })

    it('does not change value if there is no matching option or time zone', () => {
        const onChange = jest.fn()
        resolveValue('America/Foobar', onChange)
        expect(onChange).not.toHaveBeenCalled()
    })

    it('changes value if there is not a matching option', () => {
        const onChange = jest.fn()
        resolveValue('America/Creston', onChange)
        expect(onChange).toHaveBeenCalledWith('America/Whitehorse')
    })
})

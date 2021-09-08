import { filterOption } from '../../../Inputs'
import { Option } from 'react-select/src/filters'

const options: Option[] = [
    { value: '1', label: 'blue', data: undefined },
    { value: '2', label: 'purple', data: undefined },
]

describe('filterOption', () => {
    it('searches label', () => {
        expect(filterOption(options[0], 'blu')).toBe(true)
        expect(filterOption(options[1], 'blu')).toBe(false)
    })

    it('does not search value', () => {
        expect(filterOption(options[0], '1')).toBe(false)
    })
})

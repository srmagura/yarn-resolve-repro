import { GroupTypeBase, createFilter } from 'react-select'
import { partition, flatten } from 'lodash'

export interface SelectOption {
    value: string | number
    label: string
    isDisabled?: boolean
    isFixed?: boolean // only applies to multiselect
}

export function getNonGroupOptions(
    options: (SelectOption | GroupTypeBase<SelectOption>)[]
): SelectOption[] {
    const [groupOptions, nonGroupOptions] = partition(
        options,
        (o) => typeof o.value === 'undefined'
    ) as [GroupTypeBase<SelectOption>[], SelectOption[]]

    return [
        ...nonGroupOptions,
        ...flatten<SelectOption>(groupOptions.map((go) => go.options)),
    ]
}

export const filterOption: ReturnType<typeof createFilter> = createFilter({
    stringify: (o) => (o as { label: string }).label,
})

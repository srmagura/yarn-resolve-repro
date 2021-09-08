import React from 'react'
import { render } from '@testing-library/react'
import { CancellablePromise } from '@interface-technologies/iti-react-core'
import { ValidatedInput } from '../../Inputs'

it('does not update the component asynchoronously when there is no asyncValidator', async () => {
    const consoleErrorMock = jest.fn()
    console.error = consoleErrorMock

    render(
        <ValidatedInput
            name="test"
            value=""
            onChange={jest.fn()}
            validators={[]}
            showValidation={false}
        />
    )

    await CancellablePromise.delay(2000)

    // ensure no "component updated outside of an act() call" error
    expect(consoleErrorMock).not.toHaveBeenCalled()
})

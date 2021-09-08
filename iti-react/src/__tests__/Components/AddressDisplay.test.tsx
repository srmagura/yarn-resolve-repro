import React from 'react'
import { render } from '@testing-library/react'
import { AddressDisplay, AddressDisplayAddress } from '../../Components'
import '../__helpers__'

it('renders when all properties are null', () => {
    const address: AddressDisplayAddress = {
        line1: null,
        line2: null,
        city: null,
        state: null,
        postalCode: null,
    }

    render(<AddressDisplay address={address} />)

    expect(document.querySelector('.address-display')).toBeVisible()
})

import { ValidatorOutput, Validator } from '@interface-technologies/iti-react-core'
import { postalCodeValidator, PostalCodeValidationOptions } from './PostalCodeValidator'
import { AddressInputValue } from './AddressInputValue'
import { AddressInputFieldLengths } from './AddressInputFieldLengths'

// internal validator
export function disallowPartialAddress(): Validator<AddressInputValue> {
    return (v: AddressInputValue): ValidatorOutput => {
        const requiredValues = [v.line1, v.city, v.state, v.postalCode]

        const enteredRequiredValues = requiredValues.filter((v) => !!v).length

        return {
            valid:
                enteredRequiredValues === 0 ||
                enteredRequiredValues === requiredValues.length,
            invalidFeedback:
                'Partial addresses are not allowed. ' +
                'Fill out all required fields or leave the address empty.',
        }
    }
}

// internal validator
export function allFieldsValid(
    postalCodeValidationOptions: PostalCodeValidationOptions
): Validator<AddressInputValue> {
    return (v: AddressInputValue): ValidatorOutput => ({
        valid: postalCodeValidator(postalCodeValidationOptions)(v.postalCode).valid,
        invalidFeedback: '',
    })
}

// internal validator
export function allFieldLengthsValid(
    fieldLengths: AddressInputFieldLengths
): Validator<AddressInputValue> {
    return (v: AddressInputValue): ValidatorOutput => ({
        valid:
            v.line1.length <= fieldLengths.line1 &&
            v.line2.length <= fieldLengths.line2 &&
            v.city.length <= fieldLengths.city,
        invalidFeedback: '',
    })
}

function required(): Validator<AddressInputValue> {
    return (v: AddressInputValue): ValidatorOutput => ({
        valid: !!(v.line1 && v.city && v.state && v.postalCode),
        invalidFeedback: '',
    })
}

export const AddressValidators = {
    required,
}

export const InternalAddressValidators = {
    disallowPartialAddress,
    allFieldsValid,
    allFieldLengthsValid,
}

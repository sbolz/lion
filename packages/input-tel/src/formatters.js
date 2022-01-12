import { LibPhoneNumber } from './LibPhoneNumber.js';

/**
 * @param {string} modelValue
 * @param {{countryCode:string;}} options
 * @returns {string}
 */
export function formatPhoneNumber(modelValue, { countryCode }) {
  // Do not format when not loaded
  if (!LibPhoneNumber.isLoaded) {
    return modelValue;
  }

  /** @type {* & libphonenumber.PhoneNumberUtil} */
  const { phoneNumberUtil } = LibPhoneNumber;

  let parsedValue;
  try {
    parsedValue = phoneNumberUtil.parse(modelValue, countryCode);
    // eslint-disable-next-line no-empty
  } catch (_) {}

  if (
    parsedValue &&
    modelValue?.length >= 4 &&
    modelValue?.length <= 16 &&
    phoneNumberUtil.isValidNumberForRegion(parsedValue, countryCode)
  ) {
    return phoneNumberUtil.formatInOriginalFormat(parsedValue, countryCode);
  }

  return modelValue;
}

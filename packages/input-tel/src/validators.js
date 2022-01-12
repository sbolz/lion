import { Validator } from '@lion/form-core';
import { LibPhoneNumber } from './LibPhoneNumber.js';

/**
 * @typedef {import('@lion/form-core/types/FormControlMixinTypes').FormControlHost} FormControlHost
 * @typedef {import('@lion/fieldset').LionFieldset} LionFieldset
 */

/**
 * @param {string} modelValue telephone number without country prefix
 * @param {string} countryCode
 */
function hasFeedback(modelValue, countryCode) {
  /** @type {* & libphonenumber.PhoneNumberUtil} */
  const { phoneNumberUtil } = LibPhoneNumber;

  if (countryCode && modelValue?.length >= 4 && modelValue?.length <= 16) {
    return !phoneNumberUtil.isValidNumberForRegion(
      phoneNumberUtil.parse(modelValue, countryCode),
      countryCode,
    );
  }

  return true;
}

export class IsPhoneNumber extends Validator {
  static get validatorName() {
    return 'IsPhoneNumber';
  }

  static get async() {
    // Will be run as async the first time, sync afterwards
    return !LibPhoneNumber.isLoaded;
  }

  /**
   * @param {string} modelValue telephone number without country prefix
   * @param {string} countryCode
   */
  // eslint-disable-next-line class-methods-use-this
  execute(modelValue, countryCode) {
    if (!LibPhoneNumber.isLoaded) {
      // Return a Promise once not loaded yet. Since async Validators are meant for things like
      // loading server side data (in this case a lib), we continue as a sync Validator once loaded
      return new Promise(resolve => {
        LibPhoneNumber.loadComplete.then(() => {
          resolve(hasFeedback(modelValue, countryCode));
        });
      });
    }
    return hasFeedback(modelValue, countryCode);
  }

  // TODO: add a file for loadDefaultMessages
  static async getMessage() {
    return 'Not a valid phone number';
  }
}

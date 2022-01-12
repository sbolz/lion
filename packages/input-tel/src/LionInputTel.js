import { localize } from '@lion/localize';
import { LionInput } from '@lion/input';
import { LibPhoneNumber } from './LibPhoneNumber.js';
import { IsPhoneNumber } from './validators.js';
import { formatPhoneNumber } from './formatters.js';

export class LionInputTel extends LionInput {
  static get properties() {
    return {
      countryCode: { type: String, attribute: 'country-code' },
    };
  }

  constructor() {
    super();
    this.defaultValidators.push(new IsPhoneNumber());

    // @ts-ignore [allow-protected] within our own code base
    this.__langIso = localize._getLangFromLocale(localize.locale).toUpperCase();
    this.__countryCode = '';

    if (!LibPhoneNumber.isLoaded) {
      LibPhoneNumber.loadComplete.then(() => {
        this._calculateValues({ source: null });
      });
    }
  }

  get countryCode() {
    return this.__countryCode || this.__langIso;
  }

  set countryCode(newValue) {
    const oldValue = this.countryCode;
    this.__countryCode = newValue;
    this.requestUpdate('countryCode', oldValue);
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._inputNode.inputMode = 'tel';
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('countryCode')) {
      this._calculateValues({ source: null });
    }
  }

  /**
   * @param {string} modelValue
   * @returns {string}
   */
  formatter(modelValue) {
    return formatPhoneNumber(modelValue, { countryCode: this.countryCode });
  }
}

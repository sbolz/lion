import {
  expect,
  fixture as _fixture,
  html,
  defineCE,
  unsafeStatic,
  aTimeout,
} from '@open-wc/testing';
import { localize } from '@lion/localize';
import { LionInputTel } from '../src/LionInputTel.js';
import { IsPhoneNumber } from '../src/validators.js';
import { LibPhoneNumber } from '../src/LibPhoneNumber.js';
import { mockLibPhoneNumber, restoreLibPhoneNumber } from '../test-helpers/mockLibPhoneNumber.js';

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: string | TemplateResult) => Promise<LionInputTel>} */ (_fixture);

const getCountryCodeBasedOnLocale = () =>
  // @ts-expect-error [allow-protected]
  localize._getLangFromLocale(localize.locale).toUpperCase();

/**
 * @param {{ klass:LionInputTel }} config
 */
// @ts-ignore
export function runInputTelSuite({ klass = LionInputTel } = {}) {
  // @ts-ignore
  const tagName = defineCE(/** @type {* & HTMLElement} */ (class extends klass {}));
  const tag = unsafeStatic(tagName);

  describe('LionInputTel', () => {
    beforeEach(async () => {
      // Wait till LibPhoneNumber has been loaded
      await LibPhoneNumber.loadComplete;
    });

    describe('Country code', () => {
      it('automatically localizes based on current locale', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        const currentCode = getCountryCodeBasedOnLocale();
        expect(el.countryCode).to.equal(currentCode);
      });

      it('can preconfigure the country code via attr', async () => {
        const currentCode = getCountryCodeBasedOnLocale();
        const newCode = currentCode === 'DE' ? 'NL' : 'DE';
        const el = await fixture(html` <${tag} country-code="${newCode}"></${tag}> `);
        expect(el.countryCode).to.equal(newCode);
      });

      it('can preconfigure the country code via prop', async () => {
        const currentCode = getCountryCodeBasedOnLocale();
        const newCode = currentCode === 'DE' ? 'NL' : 'DE';
        const el = await fixture(html` <${tag} .countryCode="${newCode}"></${tag}> `);
        expect(el.countryCode).to.equal(newCode);
      });

      it('reformats when country code is changed on the fly', async () => {
        const el = await fixture(
          html` <${tag} .countryCode="${'NL'}" .modelValue="${'612345678'}" ></${tag}> `,
        );
        await el.updateComplete;
        expect(el.formattedValue).to.equal('06 12345678');
        el.countryCode = 'EN';
        await el.updateComplete;
        expect(el.formattedValue).to.equal('612345678');
      });
    });

    describe('User interaction', () => {
      it('sets inputmode to "tel" for mobile keyboard', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        // @ts-expect-error [allow-protected] inside tests
        expect(el._inputNode.inputMode).to.equal('tel');
      });

      it('formats according to locale', async () => {
        const el = await fixture(
          html` <${tag} .modelValue="${'612345678'}" country-code="NL"></${tag}> `,
        );
        await aTimeout(0);
        expect(el.formattedValue).to.equal('06 12345678');
      });
    });

    describe('Validation', () => {
      it('applies IsPhoneNumber as default validator', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        expect(el.defaultValidators.find(v => v instanceof IsPhoneNumber)).to.be.not.undefined;
      });
    });

    describe('User interaction', () => {
      it('sets inputmode to "tel" for mobile keyboard', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        // @ts-expect-error [allow-protected] inside tests
        expect(el._inputNode.inputMode).to.equal('tel');
      });

      it('formats according to locale', async () => {
        const el = await fixture(html` <${tag} country-code="NL"></${tag}> `);
        await LibPhoneNumber.loadComplete;
        el.modelValue = '612345678';
        expect(el.formattedValue).to.equal('06 12345678');
      });
    });

    describe('Accessibility', () => {
      describe('Audit', () => {
        it('passes a11y audit', async () => {
          const el = await fixture(
            html`<${tag} label="tel" .modelValue=${'NL20INGB0001234567'}></${tag}>`,
          );
          await expect(el).to.be.accessible();
        });

        it('passes a11y audit when readonly', async () => {
          const el = await fixture(
            html`<${tag} label="tel" readonly .modelValue=${'NL20INGB0001234567'}></${tag}>`,
          );
          await expect(el).to.be.accessible();
        });

        it('passes a11y audit when disabled', async () => {
          const el = await fixture(
            html`<${tag} label="tel" disabled .modelValue=${'NL20INGB0001234567'}></${tag}>`,
          );
          await expect(el).to.be.accessible();
        });
      });
    });

    describe('Lazy loading google-libphonenumber', () => {
      /** @type {(value:any) => void} */
      let resolveLoaded;
      beforeEach(() => {
        ({ resolveLoaded } = mockLibPhoneNumber());
      });

      afterEach(() => {
        restoreLibPhoneNumber();
      });

      it('reformats once lib has been loaded', async () => {
        const el = await fixture(
          html` <${tag} .modelValue="${'612345678'}" country-code="NL"></${tag}> `,
        );
        expect(el.formattedValue).to.equal('612345678');
        resolveLoaded(undefined);
        await aTimeout(0);
        expect(el.formattedValue).to.equal('06 12345678');
      });
    });
  });
}

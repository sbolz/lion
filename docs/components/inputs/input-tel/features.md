# Inputs >> Input Tel >> Features ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import '@lion/input-tel/define';
```

## Country code

```js preview-story
export const counrtyCode = () => html`
  <lion-input-tel
    label="Telephone number"
    help-text="With country code 'NL'"
    country-code="${'NL'}"
    .modelValue=${'0612345678'}
    name="phoneNumber"
  ></lion-input-tel>
`;
```

## Prefilled

```js preview-story
export const prefilled = () => html`
  <lion-input-tel
    label="Telephone number"
    help-text="Prefilled"
    .modelValue=${'0612345678'}
    name="phoneNumber"
  ></lion-input-tel>
`;
```

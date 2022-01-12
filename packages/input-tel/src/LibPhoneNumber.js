/** @type {(value: any) => void} */
let resolveLoaded;

/**
 * Handles lazy loading of the (relatively large) google-libphonenumber library, allowing
 * for quick first paints.
 * Also, it maintains one instance of phoneNumberUtil that can be shared across multiple places.
 */
export class LibPhoneNumber {
  static async loadLibPhoneNumber() {
    await import('google-libphonenumber');
    this.libphonenumber = window.libphonenumber;
    // Set default phoneNumberUtil instance
    this.phoneNumberUtil = window.libphonenumber.PhoneNumberUtil.getInstance();
    resolveLoaded(undefined);
  }

  /**
   * Check if google-libphonenumber has been loaded
   */
  static get isLoaded() {
    return Boolean(this.libphonenumber);
  }
}

/**
 * Wait till google-libphonenumber has been loaded
 * @example
 * ```js
 * await LibPhoneNumber.loadComplete;
 * ```
 */
LibPhoneNumber.loadComplete = new Promise(resolve => {
  resolveLoaded = resolve;
});

// initialize
LibPhoneNumber.loadLibPhoneNumber();

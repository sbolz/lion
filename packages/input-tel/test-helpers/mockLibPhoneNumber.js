import { LibPhoneNumber } from '../src/LibPhoneNumber.js';

const originalLoadComplete = LibPhoneNumber.loadComplete;
const originalIsLoaded = LibPhoneNumber.isLoaded;

export function mockLibPhoneNumber() {
  /** @type {(value: any) => void} */
  let resolveLoaded;
  let isLoaded = false;
  LibPhoneNumber.loadComplete = new Promise(resolve => {
    resolveLoaded = () => {
      isLoaded = true;
      resolve(undefined);
    };
  });
  Object.defineProperty(LibPhoneNumber, 'isLoaded', { get: () => isLoaded });

  // @ts-ignore
  return { resolveLoaded };
}

export function restoreLibPhoneNumber() {
  LibPhoneNumber.loadComplete = originalLoadComplete;
  Object.defineProperty(LibPhoneNumber, 'isLoaded', { get: () => originalIsLoaded });
}

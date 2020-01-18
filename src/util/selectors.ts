import { PrintableElement } from "./io";

/* eslint-env browser */

/**
 * Classes such as Shell and Vi hold references to DOM selectors.
 * The selector functions in this file allow us to create instances
 * of those classes in environments that don't have access to a DOM,
 * eg, for unit testing purposes.
 */

export function getElementById(id: string): PrintableElement {
  let element: PrintableElement | null;
  try {
    element = document.getElementById(id);
  } catch (err) {
    // return mock html element
    return { innerHTML: ''};
  }
  if (!element) throw new Error(`Element with id ${id} not found`)
  return element;
}

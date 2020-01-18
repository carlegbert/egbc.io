import { PrintableElement } from './io'

/**
 * Classes such as Shell and Vi hold references to DOM selectors.
 * The selector functions in this file allow us to create instances
 * of those classes in environments that don't have access to a DOM,
 * eg, for unit testing purposes.
 */

const nop = () => undefined

export function getElementById(id: string): PrintableElement {
  let element: PrintableElement | null
  try {
    element = document.getElementById(id)
  } catch (err) {
    // return mock html element
    return { innerHTML: '', scrollIntoView: nop, append: nop }
  }
  if (!element) throw new Error(`Element with id ${id} not found`)
  return element
}

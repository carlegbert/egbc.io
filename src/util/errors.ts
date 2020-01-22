export const errorIs = (e: Error, t: string): void => {
  if (e.name !== t) throw e
}

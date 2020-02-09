export const errorIs = (e: Error, ...errorTypes: string[]): void => {
  if (!errorTypes.includes(e.name)) throw e
}

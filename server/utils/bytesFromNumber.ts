export const bytesFromNumber = (inputNumber: number) => {
  if (inputNumber > 1024 * 1024 * 1024 * 1024) {
    const remainder = inputNumber % (1024 * 1024 * 1024 * 1024)
    return (inputNumber - remainder) / (1024 * 1024 * 1024 * 1024) + ' TB'
  } else if (inputNumber > 1024 * 1024 * 1024) {
    const remainder = inputNumber % (1024 * 1024 * 1024)
    return (inputNumber - remainder) / (1024 * 1024 * 1024) + ' GB'
  } else if (inputNumber > 1024 * 1024) {
    const remainder = inputNumber % (1024 * 1024)
    return (inputNumber - remainder) / (1024 * 1024) + ' MB'
  } else if (inputNumber > 1024) {
    const remainder = inputNumber % 1024
    return (inputNumber - remainder) / 1024 + ' KB'
  }
  return inputNumber
}

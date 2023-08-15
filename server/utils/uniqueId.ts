let uuid = 0

const uniqueId = () => {
  const getId = () => {
    uuid++
    return uuid
  }

  return { getId }
}

export default uniqueId

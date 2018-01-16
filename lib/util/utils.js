/**
 * 集合工具类
 */
const utils = {}

utils.getRandom = (max, min) => {
  return parseInt(Math.random() * (max - min + 1) + min, 10)
}

utils.getFormatTime = (time) => {
  const obj = time ? new Date(time) : new Date()
  const str = `${obj.getFullYear()}-${obj.getMonth() + 1}-${obj.getDate()} ${obj.getHours()}:${obj.getMinutes()}:${obj.getSeconds()}`
  return str
}

export default utils

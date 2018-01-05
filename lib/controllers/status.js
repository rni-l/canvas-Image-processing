// 一个状态公共类
class Status {
	constructor() {
		this.ifRedict = false
		this.ifCheckRedirect = false
		this.userId = 0
	}

	setValue(key, value) {
		this[key] = value
	}

	getValue(key) {
		return this[key]
	}
}

const obj = false

// 单例模式
function getStatus() {
  if (obj) {
  	return obj
  }
  obj = new Status()
}

module.exports = getStatus

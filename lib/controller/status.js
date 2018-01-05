// 一个状态公共类
class Status {
	constructor() {
		this.ifRedict = false
		this.ifCheckRedirect = false
		this.userId = 0
	}

	set(key, value) {
		this[key] = value
	}

	setValues(keyValue) {
		Object.keys(keyValue).forEach(v => {
			this[v] = keyValue[v]
		})
	}

	get(key) {
		return this[key]
	}
}

let obj = false

// 单例模式
function getStatus() {
  if (obj) {
  	return obj
  }
	obj = new Status()
	return obj
}

export default getStatus()

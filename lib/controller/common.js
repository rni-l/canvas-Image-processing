import Status from './status.js'

class Common {
	constructor() {}

	checkRedict(res, redirectPath = '/', ifReverse = false) {
		if ((!ifReverse && Status.get('ifRedict')) || (ifReverse && !Status.get('ifRedict')) ) {
	    res.redirect(redirectPath)
	    return false
	  }
	  Status.set('ifRedict', false)
	  return true
	}
}

export default Common

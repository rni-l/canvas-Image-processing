import api from './../../model/user.js'
import picApi from './../../model/pics.js'
import sendMsg from './../../util/sendMsg.js'
import Common from './../Common.js'
import Status from './../status.js'

class Pics extends Common {
	constructor() {
		super()
	}

  async getPics(req, res) {
  	if (!super.checkRedict(res, 'login')) {
			return false
		}
	  // 获取session
	  const queryId = req.session.uid && req.session.uid.id
	  console.log('id：', queryId)
	  if (!queryId) {
	    return res.redirect('home')
	  }
	  const data = await picApi.getPics({
	    id: queryId
	  })
    console.log('list', data)
    res.render('list', { data: data })
  }

}

export default new Pics()

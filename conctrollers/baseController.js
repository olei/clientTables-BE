import Ids from '../models/ids'

export default class BaseController {
  constructor () {
    this.idList = ['user_id', 'client_id']
  }
  async getId (type) {
		if (!this.idList.includes(type)) {
			console.log('id类型错误')
			throw new Error('id类型错误')
			return
		}
		try {
			const idData = await Ids.findOne()
			console.log(idData, '0')
			idData[type] ++
			await idData.save()
			return idData[type]
		} catch (err) {
			console.log('获取ID数据失败')
			throw new Error(err)
		}
	}
	verifyLogin (req, res) {
    const admin_id = req.session.admin_id
    if (!admin_id) {
      res.send({
        status: 0,
        message: '未登录'
      })
      return false
    }
    return true
  }
}
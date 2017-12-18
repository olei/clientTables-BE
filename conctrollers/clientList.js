import formidable from 'formidable'
import dtime from 'time-formater'
import { md5 } from '../utils/crypt'
import BaseComponent from './baseController'
import user from '../models/user'
import clientListModel from '../models/clientList'

class ClientList extends BaseComponent {
  constructor () {
    super()
    this.createClient = this.createClient.bind(this)
  }
  async createClient (req, res, next) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
				res.send({
					status: 0,
					message: '表单信息错误'
				})
				return
      }
      if (!req.session.admin_id) {
				res.send({
					status: 0,
					message: '未登录'
				})
				return
      }
      try {
        const {name, phone, idCard} = fields
        const client = await clientListModel.findOne({name, phone})
        if (client && client.name.toString() === name.toString() && client.phone.toString() === phone.toString()) {
          res.send({
            status: 0,
            message: '客户已存在'
          })
          return
        }
        const client_id = await this.getId('client_id')
        const newClient = {
          name: name,
          age: new Date().getFullYear() - parseInt(idCard.slice(6,10)),
          idCard: idCard,
          phone: phone,
          id: client_id,
          gender: (idCard.slice(-2,-1)%2 ? 1 : 0),
          create_time: dtime().format('YYYY-MM-DD HH:mm')
        }
        const admin_id = req.session.admin_id
        const userInfo = await user.findOne({id: admin_id})
        const newList = userInfo.clientList
        newList.push(client_id)
        await user.findOneAndUpdate({id: req.session.admin_id}, {$set: {clientList: newList}})
        await clientListModel.create(newClient)
        res.send({
          status: 1,
          message: '添加成功',
        })
      } catch (err) {
        console.log(err.message, err)
        res.send({
          status: 0,
          message: '添加失败'
        })
      }
    })
  }
  async showClient (req, res, next) {
    const admin_id = req.session.admin_id
    if (!admin_id) {
      res.send({
        status: 0,
        message: '未登录'
      })
      return
    }
    const query = req.query
    const userInfo = await user.findOne({id: admin_id})
    const newList = userInfo.clientList
    const data = await clientListModel.find({$or: newList.map(i => ({id: i}))}, {name: 1, age: 1, idCard: 1, phone: 1, id: 1, create_time: 1, gender: 1, _id: 0})
    console.log(data)
    res.send({
      status: 1,
      message: '0k',
      objects: data
    })
  }
}

export default new ClientList()
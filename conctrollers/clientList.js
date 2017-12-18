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
    this.showClient = this.showClient.bind(this)
    this.editorClient = this.editorClient.bind(this)
    this.delClient = this.delClient.bind(this)
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
      if (!this.verifyLogin(req, res)) return
      const {name, phone, idCard} = fields
      try {
				if (!name) {
					throw new Error('客户姓名参数错误')
				} else if (!phone) {
					throw new Error('电话参数错误')
				} else if (!idCard) {
          throw new Error('身份证参数错误')
        }
			} catch (err) {
				console.log(err.message, err)
				res.send({
					status: 0,
					message: err.message,
				})
				return
			}
      try {
        const clientCard = await clientListModel.findOne({idCard})
        const clientPhone = await clientListModel.findOne({phone})
        if (clientCard || clientPhone) {
          res.send({
            status: 0,
            message: '客户已存在'
          })
          return
        }
        const client_id = await this.getId('client_id')
        const newClient = {
          name,
          age: new Date().getFullYear() - parseInt(idCard.slice(6,10)),
          idCard,
          phone,
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
  async delClient (req, res, next) {
    const client_id = req.params.client_id
    if (!this.verifyLogin(req, res)) return
    const client = await clientListModel.findOneAndRemove({id: client_id})
    if (client) {
      res.send({
        status: 1,
        message: 'ok'
      })
    } else {
      res.send({
        status: 0,
        message: '删除失败'
      })
    }
  }
  async editorClient (req, res, next) {
    const client_id = req.params.client_id
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
				res.send({
					status: 0,
					message: '表单信息错误'
				})
				return
      }
      if (!this.verifyLogin(req, res)) return
      const {name, phone, idCard} = fields
      try {
				if (!name) {
					throw new Error('客户姓名参数错误')
				} else if (!phone) {
					throw new Error('电话参数错误')
				} else if (!idCard) {
          throw new Error('身份证参数错误')
        }
			} catch (err) {
				console.log(err.message, err)
				res.send({
					status: 0,
					message: err.message,
				})
				return
			}
      const clientInfo = await clientListModel.findOneAndUpdate({id: client_id}, {$set: {name, phone, idCard}})
      if (clientInfo) {
        res.send({
          status: 1,
          message: 'ok'
        })
      } else {
        res.send({
          status: 0,
          message: '修改失败'
        })
      }
    })
  }
  async showClient (req, res, next) {
    const admin_id = req.session.admin_id
    if (!this.verifyLogin(req, res)) return
    const query = req.query
    const limit = parseInt(query.limit) || 5
    const offset = parseInt(query.offset) || 0
    const userInfo = await user.findOne({id: admin_id})
    const newList = userInfo.clientList
    const data = await clientListModel.find({$or: newList.map(i => ({id: i}))}, {name: 1, age: 1, idCard: 1, phone: 1, id: 1, create_time: 1, gender: 1, _id: 0}).limit(limit).skip(offset)
    res.send({
      status: 1,
      limit,
      offset,
      objects: data
    })
  }
}

export default new ClientList()
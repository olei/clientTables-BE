"use strict"

// import querystring from 'querystring'
import formidable from 'formidable'
import dtime from 'time-formater'
import { md5 } from '../utils/crypt'
import BaseComponent from './baseController'
import user from '../models/user'

class UserCtrl extends BaseComponent {
  constructor () {
    super()
		this.register = this.register.bind(this)
		this.singout = this.singout.bind(this)
  }
  async onLogin (req, res, next) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
				res.send({
					status: 0,
					message: '表单信息错误'
				})
				return
			}
      const {userName, password} = fields
      try {
				if (!userName) {
					throw new Error('用户名参数错误')
				} else if (!password) {
					throw new Error('密码参数错误')
				}
			} catch (err) {
				console.log(err.message, err)
				res.send({
					status: 0,
					message: err.message,
				})
				return
			}
      const mdPassword = md5(password)
      const admin = await user.findOne({uname: userName, password: mdPassword})
      if (!admin) {
        res.send({
					status: 0,
					message: '该用户不存在或密码错误'
        })
        return
      }
      if (mdPassword.toString() !== admin.password.toString()) {
        res.send({
          status: 0,
          message: '该用户已存在，密码输入错误'
        })
        return
			}
			if (req.session.admin_id && req.session.admin_id === admin.id) {
				res.send({
					status: 0,
					message: '已经登录'
				})
				return
			}
      req.session.admin_id = admin.id
      res.send({
        status: 1,
        message: '登录成功'
      })
    })
  }
  async register (req, res, next) {
    const form = new formidable.IncomingForm()
		form.parse(req, async (err, fields, files) => {
      if (err) {
				res.send({
					status: 0,
					message: '表单信息错误'
				})
				return
      }
      const {userName, password} = fields
      try {
				if (!userName) {
					throw new Error('用户名错误')
				} else if (!password){
					throw new Error('密码错误')
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
        const admin = await user.findOne({ uname: userName })
				if (admin) {
					console.log('该用户已经存在')
					res.send({
						status: 0,
						message: '该用户已经存在'
					})
				} else {
          const admin_id = await this.getId('user_id')
					const mdPassword = md5(password)
					const newAdmin = {
						uname: userName, 
						password: mdPassword, 
						id: admin_id,
						create_time: dtime().format('YYYY-MM-DD'),
						clientList: []
					}
					await user.create(newAdmin)
					req.session.admin_id = admin_id
					res.send({
						status: 1,
						message: '注册管理员成功',
					})
				}
      } catch (err) {
          console.log('注册管理员失败', err)
          res.send({
            status: 0,
            message: '注册管理员失败'
          })
      }
    })
  }
  async singout (req, res, next) {
		if (!this.verifyLogin(req, res)) return
		try {
			delete req.session.admin_id
			res.send({
				status: 1,
				success: '退出成功'
			})
		} catch (err) {
			console.log('退出失败', err)
			res.send({
				status: 0,
				message: '退出失败'
			})
		}
	}
}

export default new UserCtrl()
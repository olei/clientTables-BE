"use strict"

import formidable from 'formidable'
import BaseComponent from './baseController'
import dtime from 'time-formater'
import fs from 'fs'
import xlsx from 'node-xlsx'
import user from '../models/user'
import clientListModel from '../models/clientList'

// export function test (req, res, next) {
//   res.render('404.html')
// }

// export async function fileTest (req, res, next) {
//   const form = new formidable.IncomingForm()
//   form.parse(req, async (err, fields, files) => {
//     console.log(files.testFile.path)
//     // 异步读取

//     const obj = xlsx.parse(files.testFile.path)
//     const data = JSON.stringify(obj)

//     // fs.readFile(files.testFile.path, function (err, data) {
//     //   if (err) {
//     //     return console.error(err)
//     //   }
//     //   console.log("异步读取: " + data.toString())
//     // })
//   })
// }

class ImportTable extends BaseComponent {
  constructor () {
    super()
    this.fileTest = this.fileTest.bind(this)
    this.creactClient = this.creactClient.bind(this)
  }
  test (req, res, next) {
    res.render('importTable.html')
  }
  async fileTest (req, res, next) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      console.log(files.testFile.path)
      let obj, data
      // 异步读取
      this.admin_id = this.getSessionAdminId(req) //req.session.admin_id
      this.userInfo = await user.findOne({id: this.admin_id})
      try {
        obj = await xlsx.parse(files.testFile.path)
        data = obj[0].data.slice(2)
        this.creactClient(data, res)
      } catch (e) {
        res.send({
          status: 0,
          message: e
        })
        console.log(e)
        return
      }
      // if (data) {
      //   res.send({
      //     status: 1,
      //     message: '返回数据成功'
      //   })
      // } else {
      //   res.send({
      //     status: 1,
      //     message: '没有获取到数据'
      //   })
      // }
    })
  }
  async creactClient (data, res) {
    console.log(data)
    if (!data.length) {
      res.send({
        status: 1,
        message: '返回数据成功'
      })
      return
    }
    const client_id = await this.getId('client_id')
    const newList = this.userInfo.clientList
    newList.push(client_id)
    await user.findOneAndUpdate({id: this.admin_id}, {$set: {clientList: newList}})
    const client = data[0]
    const name = client[2]
    if (!name) {
      data.shift()
      this.creactClient(data,res)
    }
    const phone = client[4] ? parseInt(client[4]).toString() : ''
    const tPhone = phone && phone.length === 11 ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : ''
    const gender = client[3] === '男' ? 1 : 0
    const remarks = client[6] || ''
    const newClient = {
      name,
      age: '--',
      idCard: '--',
      tIdCard: `--`,
      phone,
      tPhone,
      id: client_id,
      gender,
      remarks,
      create_time: dtime().format('YYYY-MM-DD HH:mm')
    }
    await clientListModel.create(newClient)
    data.shift()
    this.creactClient(data, res)
  }
}

export default new ImportTable()
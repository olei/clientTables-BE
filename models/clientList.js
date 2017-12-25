'use strict'

import mongoose from 'mongoose'

mongoose.Promise = require('bluebird')

const Schema = mongoose.Schema

const clientList = new Schema({
  name: String,
  idCard: String,
  age: String,
  phone: String,
  id: Number,
  gender: Number,
  create_time: String,
  tIdCard: String,
  tPhone: String,
  remarks: String
})

export default mongoose.model('clientList', clientList)
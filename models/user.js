'use strict'

import mongoose from 'mongoose'

mongoose.Promise = require('bluebird')

const Schema = mongoose.Schema

const userSchema = new Schema({
    uname: String,
    password: String,
    id: Number,
    clientList: Array,
    create_time: String
})

// userSchema.index({id: 1})

export default mongoose.model('user', userSchema)
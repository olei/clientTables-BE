"use strict"

// test buffer
// var EventEmitter = require('events').EventEmitter
// var event = new EventEmitter()
// event.on('some_event', arg => {
//   console.log('some_event 事件触发', arg)
  
//   let j = 0, string = '', base = 1024 * 1024 * 10
  
//   console.time(`write ${base} string`)
//   for(; j < base; j++){
//     const x = j + ''
//     string += x
//   }
//   console.timeEnd(`write ${base} string`)

//   console.time(`write ${base} buffer`)
//   let bufstr = new Buffer.alloc(base)
//   for(; j<base; j++){
//     const x = j + ''
//     bufstr.write(x, j)
//   }
//   console.timeEnd(`write ${base} buffer`)
//   console.log(Math.ceil(process.memoryUsage().rss / (1024 * 1024)) + 'Mb')
// })
// setTimeout(() => { 
//     event.emit('some_event', 'test')
// }, 1000)

export default function (req, res, next) {
  res.render('index.html')
}
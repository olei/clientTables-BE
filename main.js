import express from 'express'
import history from 'connect-history-api-fallback'

let app = express()

// app.get('/', function(req, res){
//   res.send('hello world')
// })

app.use(express.static('./public'))
console.log(process.env.NODE_ENV)

app.use(history())
app.listen(3000)
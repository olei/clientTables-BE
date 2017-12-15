import express from 'express'
import history from 'connect-history-api-fallback'

let app = express()

app.use(express.static('./public'))

app.use(history())
app.listen(8088)
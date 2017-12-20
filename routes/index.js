import index from '../conctrollers/index'
import user from '../conctrollers/user'
import clientList from '../conctrollers/clientList'

export default app => {
  app.get('/', index)
  app.get('/vLogin', user.vLogin)
  app.post('/onLogin', user.onLogin)
  app.get('/singout', user.singout)
  app.post('/register', user.register)
  app.post('/createClient', clientList.createClient)
  app.get('/clientList', clientList.showClient)
  app.put('/clients/:client_id', clientList.editorClient)
  app.delete('/client/:client_id', clientList.delClient)
  app.get('/search', clientList.searchClient)
}
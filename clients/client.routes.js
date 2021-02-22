module.exports = function clientRoutes(express, Client) {
  const router = express.Router()

  router.get('/', async (req, res, next) => {
    try{
      const clients = await Client.getAll()
      res.json(clients)
    } catch(e) {
      next(e)
    }
    
  })

  router.get('/client', async (req, res, next) => {
    try {
      const id = req.query.id
      const client = await Client.getById(id)
      res.json(client)
    } catch(e) {
      next(e)
    }
  })

  router.post('/', async (req, res, next) => {
    try {
      const newClient = await Client.create(req.body.client)
      res.json(newClient)
    } catch(e) {
      next(e)
    }
  })

  router.put('/', async (req, res, next) => {
    try {
      const update = await Client.update(req.body.client)
      res.json(update)
    } catch(e) {
      next(e)
    }
  })

  return router
}
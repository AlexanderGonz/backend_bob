module.exports = (ClientModel) => {

  class Client {

    /**
     * Return a complete list of all current clients in database.
     */
    async getAll() {
      return new Promise(async (resolve, reject) => {
        try {
          const clients = await ClientModel.find().lean()
          resolve(clients)
        } catch(e) {
          reject(e)
        }
      })
    }

    /**
     * Return all data from specific client found by ID.
     * @param {String} id - Client _id database field.
     */
    async getById(id) {
      return new Promise(async (resolve, reject) => {
        try {
          // validations
          if (!id) throw new Error('ID field is required')

          const client = await ClientModel.findById(id).lean()
          if (!client) throw new Error('Client not found')
          resolve(client)
        } catch(e) {
          reject(e)
        }
      })
    }

    /**
     * Validates and creates new client with data recived.
     * @param {Object} client - Client object with new data to create.
     */
    async create(client) {
      return new Promise(async (resolve, reject) => {
        try {
          // validations
          const validation = this.validateClientModel(client)
          if (!validation.valid) throw new Error(validation.message)

          const newClient = await ClientModel.create(client)
          resolve(newClient)
        } catch(e) {
          reject(e)
        }
      })
    }

    /**
     * Updates the client DB data validating his model before to save.
     * @param {Object} clientToUpdate - Client object with new data to update. _id field is required to find the client.
     */
    async update(clientToUpdate) {
      return new Promise(async (resolve, reject) => {
        try {
          // validations
          const validation = this.validateClientModel(clientToUpdate)
          if (!validation.valid) throw new Error(validation.message)
          if (!clientToUpdate._id) throw new Error('ID field is required')

          const client = await ClientModel.findById(clientToUpdate._id)
          if (!client) throw new Error('Client not found')

          client.bags = clientToUpdate.bags
          client.name = clientToUpdate.name
          client.flightCode = clientToUpdate.flightCode
          await client.save()
          resolve({ success: true })
        } catch(e) {
          reject(e)
        }
      })
    }

    /**
     * Validates the client model. 
     * Bags, client name and flight code are required.
     * Bags should be a number between 1 and 5.
     * @param {Object} client - Object with all client data.
     */
    validateClientModel(client) {
      if (!client) 
        return { valid: false, message: 'Client data is required' }
      if (!client.bags || client.bags < 1 || client.bags > 5) 
        return { valid: false, message: 'Bags should be a number between 1 and 5' }
      if (!client.name) 
        return { valid: false, message: 'Client name is required' }
      if (!client.flightCode) 
        return { valid: false, message: 'Flight code is required' }
      return { valid: true }
    }
  
  }

  return new Client()
}

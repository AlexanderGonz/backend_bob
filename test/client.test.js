const assert = require('assert')
const mongoose = require('mongoose')
const ClientModel = require('../clients/ClientModel')(mongoose)
const Client = require('../clients/Client')(ClientModel)
const config = require('./config')

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

beforeEach(async () => {
  try {
    await mongoose.connection.collections.clients.drop()
  } catch {
    // collection does not exist
  }
})

describe('Get clients', () => {
  it('should return an array', async () => {
    const result = await Client.getAll()
    assert(Array.isArray(result))
  })
})

describe('Get client by ID', () => {
  beforeEach(async () => {
    await ClientModel.create({
      _id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
      name: 'Erick',
      bags: 3,
      flightCode: 'EA-123'
    })
  })

  it('should return not found error', async () => {
    try {
      await Client.getById('AAAAAAAAAAAAAAAAAAAAAAAA')
    } catch(e) {
      assert.strictEqual(e.message, 'Client not found')
    }
  })

  it('should return client object', async () => {
    try {
      const client = await Client.getById('bbbbbbbbbbbbbbbbbbbbbbbb')
      assert.strictEqual(String(client._id), 'bbbbbbbbbbbbbbbbbbbbbbbb')
      assert.strictEqual(client.bags, 3)
      assert.strictEqual(client.name, 'Erick')
      assert.strictEqual(client.flightCode, 'EA-123')
    } catch(e) {
      assert.fail(new Error(e.message))
    }
  })
})

describe('Create client', () => {
  it('should return client validation error', async () => {
    try {
      await Client.create()
    } catch(e) {
      assert.strictEqual(e.message, 'Client data is required')
    }
  })

  it('should return client bag validation error', async () => {
    try {
      await Client.create({})
    } catch(e) {
      assert.strictEqual(e.message, 'Bags should be a number between 1 and 5')
    }
  })

  it('should return client bag validation error', async () => {
    try {
      await Client.create({ bags: 0 })
    } catch(e) {
      assert.strictEqual(e.message, 'Bags should be a number between 1 and 5')
    }
  })

  it('should return client bag validation error', async () => {
    try {
      await Client.create({ bags: 6 })
    } catch(e) {
      assert.strictEqual(e.message, 'Bags should be a number between 1 and 5')
    }
  })

  it('should return client name validation error', async () => {
    try {
      await Client.create({ bags: 3 })
    } catch(e) {
      assert.strictEqual(e.message, 'Client name is required')
    }
  })

  it('should return flight code validation error', async () => {
    try {
      await Client.create({ bags: 3, name: 'Erick' })
    } catch(e) {
      assert.strictEqual(e.message, 'Flight code is required')
    }
  })

  it('should create client successfully', async () => {
    try {
      const newClient = await Client.create({ bags: 2, name: 'Tester', flightCode: 'EA-232' })
      assert(newClient._id)
      assert.strictEqual(newClient.bags, 2)
      assert.strictEqual(newClient.name, 'Tester')
      assert.strictEqual(newClient.flightCode, 'EA-232')
    } catch(e) {
      assert.fail(new Error(e.message))
    }
  })
})

describe('Update client', () => {
  beforeEach(async () => {
    await ClientModel.create({
      _id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
      name: 'Erick',
      bags: 3,
      flightCode: 'EA-123'
    })
  })

  it('should return client validation error', async () => {
    try {
      await Client.update()
    } catch(e) {
      assert.strictEqual(e.message, 'Client data is required')
    }
  })

  it('should return client ID validation error', async () => {
    try {
      await Client.update({ bags: 2, name: 'Erick', flightCode: 'EA-232' })
    } catch(e) {
      assert.strictEqual(e.message, 'ID field is required')
    }
  })

  it('should return client bag validation error', async () => {
    try {
      await Client.update({ _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', bags: 0 })
    } catch(e) {
      assert.strictEqual(e.message, 'Bags should be a number between 1 and 5')
    }
  })

  it('should return client bag validation error', async () => {
    try {
      await Client.update({ _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', bags: 0 })
    } catch(e) {
      assert.strictEqual(e.message, 'Bags should be a number between 1 and 5')
    }
  })

  it('should return client name validation error', async () => {
    try {
      await Client.update({ _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', bags: 1 })
    } catch(e) {
      assert.strictEqual(e.message, 'Client name is required')
    }
  })

  it('should return flight code validation error', async () => {
    try {
      await Client.update({ _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', bags: 1, name: 'Erick' })
    } catch(e) {
      assert.strictEqual(e.message, 'Flight code is required')
    }
  })

  it('should return not found error', async () => {
    try {
      await Client.update({ _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', bags: 2, name: 'Erick', flightCode: 'EA-232' })
    } catch(e) {
      assert.strictEqual(e.message, 'Client not found')
    }
  })

  it('should update client successfully', async () => {
    try {
      await Client.update({ _id: 'bbbbbbbbbbbbbbbbbbbbbbbb', bags: 3, name: 'Tester1', flightCode: 'EA-233' })
      const updatedClient = await ClientModel.findById('bbbbbbbbbbbbbbbbbbbbbbbb')
      assert(updatedClient._id)
      assert.strictEqual(updatedClient.bags, 3)
      assert.strictEqual(updatedClient.name, 'Tester1')
      assert.strictEqual(updatedClient.flightCode, 'EA-233')
    } catch(e) {
      assert.fail(new Error(e.message))
    }
  })
})
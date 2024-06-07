import { MongoClient } from 'mongodb'
import { updateSerialNumbers } from './controllers/booking.js'

const uri =
  'mongodb+srv://furqan:byXLpnZtf7virZnH@rgc.nvhao4s.mongodb.net/rgc?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function runUpdate() {
  try {
    await client.connect()
    const database = client.db('rgc')
    const collections = await database.listCollections().toArray()

    for (const collection of collections) {
      await updateSerialNumbers(database, collection.name)
    }

    console.log('Serial numbers updated successfully.')
  } catch (error) {
    console.error('Error updating serial numbers:', error)
  } finally {
    await client.close()
  }
}

runUpdate()

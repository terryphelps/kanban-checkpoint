//THIS FILE STAYS BASICALLY THE SAME
import mongoose from 'mongoose'

//THIS STRING WILL CHANGE SLIGHTLY
const connectionString = "mongodb://student:student@classroom-shard-00-00-afyyj.mongodb.net:27017,classroom-shard-00-01-afyyj.mongodb.net:27017,classroom-shard-00-02-afyyj.mongodb.net:27017/kanban?ssl=true&replicaSet=Classroom-shard-0&authSource=admin&retryWrites=true&w=majority"

let connection = mongoose.connection

mongoose.connect(connectionString)

//log any errors
connection.on('error', err => {
  console.error('[DATABASE ERROR]:', err)
})

//confirm connection
connection.once('open', () => {
  console.log('connected to the database')
})
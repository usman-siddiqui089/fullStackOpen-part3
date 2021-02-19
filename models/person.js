const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB successfully!')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })
const personSchema = mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON',{
    transform: (document, requiredDocument) => {
        requiredDocument.id = requiredDocument._id.toString()
        delete requiredDocument._id
        delete requiredDocument.__v
    }
})

module.exports = mongoose.model('Person',personSchema)
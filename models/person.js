const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB successfully!')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
const personSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    unique: true,
    required: true
  }
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON',{
  transform: (document, requiredDocument) => {
    requiredDocument.id = requiredDocument._id.toString()
    delete requiredDocument._id
    delete requiredDocument.__v
  }
})

module.exports = mongoose.model('Person',personSchema)
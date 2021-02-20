const mongoose = require('mongoose')
if(process.argv.length < 3 || process.argv.length > 5){
    console.log('Please provide the password as an argument: node mongo.js <password> <optional args>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://fullstackopen:${password}@cluster0.2dcnc.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person',personSchema)
if(process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('Phonebook')
        result.forEach(record => {
            console.log(`${record.name} ${record.number}`)
        })
        mongoose.connection.close()
    })
}
else if(process.argv.length === 5){
    const person = new Person({
        name,
        number
    })
    person.save().then(result => {
        console.log(`added ${name} number ${number} to Phonebook.`)
        mongoose.connection.close()
    })
}
else {
    console.log('Please provide correct arguments and try again!')
    process.exit(1)
}
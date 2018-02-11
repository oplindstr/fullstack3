const mongoose = require('mongoose')

const url = 'mongodb://fullstack:fullpassword@ds121088.mlab.com:21088/opmongo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

personSchema.statics.format = function(person) {
    if (!person) {
        return this.find({})
    }
    else {
        return {
            name: person.name,
            number: person.number,
            id: person._id
          }
    }
  };


const Person = mongoose.model('Person', personSchema);

module.exports = Person
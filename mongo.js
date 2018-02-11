
const Person = require('./models/person')

if (process.argv[2] && process.argv[3]) {

    console.log(`lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`)

    const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
    })

    person
    .save()
    .then(response => {
        console.log('note saved!')
        mongoose.connection.close()
    })
}
else {
    Person
  .find({})
  .then(result => {
    console.log('puhelinluettelo:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password argument');
    process.exit(1);
}

const password = process.argv[2];


const url = `mongodb+srv://greek313_db_user:${password}@cluster0.mjlf6hl.mongodb.net/phoonebookApp?retrywrites=true&w=majority`;

mongoose.set('strictQuery',false);

mongoose.connect(url, { family: 4 })


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close();
    })
} else {
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name,
        number
    })

    person.save().then(()  => {
        console.log(`added ${name} number: ${number} to phonebook`);
        mongoose.connection.close();
    })

}


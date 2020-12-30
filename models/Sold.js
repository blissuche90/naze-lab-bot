const mongoose = require('mongoose')
//const Schema = mongoose.Schema

const SoldSchema =  mongoose.Schema({
sellcount : Number,
item: String,
updateAt : { type: Date, default: Date.now },
});

//const Sold = mongoose.model('Sold',SoldSchema)
module.exports = mongoose.model('Sold',SoldSchema);
//module.exports = Sold;
//export default Sold;

//additional code to save books.
//...
//Book.findByName('Maarij & Hussain: Best Friends');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const datumSchema = new Schema({
    width: {type: Number, required: true},
    height: {type: Number, required: true},
    label: {type: String, required: true},
    pixels: {type: String, required: true},
}, {
    timestamps: true,
});

const Datum = mongoose.model('Datum', datumSchema);

module.exports = Datum;
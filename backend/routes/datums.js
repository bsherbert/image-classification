const router = require('express').Router();
let Datum = require('../models/datum.model');

router.route('/').get((req, res) => {
    Datum.find()
        .then(datums => res.json(datums))
        .catch(err  => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req,res) => {
    const width = req.body.width;
    const height = req.body.height;
    const label = req.body.label;
    const pixels = req.body.pixels;

    const newDatum = new Datum({
        width,
        height,
        label,
        pixels,
    });

    newDatum.save()
        .then(() => res.json('Datum added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
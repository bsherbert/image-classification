const router = require('express').Router();
let Review = require('../models/review.model');

router.route('/').get((req, res) => {
    Review.find()
        .then(reviews => res.json(reviews))
        .catch(err  => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req,res) => {
    const width = req.body.width;
    const height = req.body.height;
    const label = req.body.label;
    const pixels = req.body.pixels;

    const newReview = new Review({
        width,
        height,
        label,
        pixels,
    });

    newReview.save()
        .then(() => res.json('Review added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) =>{
    Review.findByIdAndDelete(req.params.id)
        .then(() => res.json('Review deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
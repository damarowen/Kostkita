const express = require('express')
const router = express.Router({ mergeParams: true })
const Kost = require('../../models/kost')
const Review = require('../../models/review')
const middleware = require('../../middleware/index')

// Reviews Index (render)
router.get('/', function (req, res) {
  Kost.findById(req.params.id)
    .populate({
      path: 'reviews',
      options: { sort: { createdAt: -1 } },
    })
    .lean()
    .exec(function (err, kost) {
      if (err || !kost) {
        req.flash('error', 'sssssss')
        return res.redirect('back')
      }
      res.render('reviews/index', { kost })
    })
})

// Reviews New (render)
router.get('/new', middleware.checkReviewExistence, function (req, res) {
  Kost.findById(req.params.id, function (err, kost) {
    if (err || !kost) {
      console.log(err)
      req.flash('error', 'Something Wrong on Reviews New Route')
      return res.redirect('back')
    }
    res.render('reviews/new', { kost })
  })
})

// Reviews Edit (render)
router.get('/:review_id/edit', middleware.checkReviewOwnership, function (req, res) {
  Review.findById(req.params.review_id, function (err, foundReview) {
    if (err || !foundReview) {
      console.log(err)
      req.flash('error', 'Something wrong on Review Edit Route')
      return res.redirect('back')
    }
    res.render('reviews/edit', {
      kost_id: req.params.id,
      review: foundReview,
    })
  })
})

module.exports = router

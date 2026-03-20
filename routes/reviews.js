const express = require('express'),
  Kost = require('../models/kost'),
  router = express.Router({
    mergeParams: true,
  }),
  Review = require('../models/review'),
  middleware = require('../middleware/index')
const { withValidation } = require('../dtos/validate')
const { validateReviewCreate, validateReviewUpdate } = require('../dtos/review.dto')
const reviewService = require('../services/review.service')

//* Reviews Index
router.get('/', function (req, res) {
  Kost.findById(req.params.id)
    .populate({
      path: 'reviews',
      options: {
        sort: {
          //* sorting the populated reviews array to show the latest first
          createdAt: -1,
        },
      },
    })
    .lean()
    .exec(function (err, kost) {
      if (err || !kost) {
        req.flash('error', 'sssssss')
        return res.redirect('back')
      }
      res.render('reviews/index', {
        kost: kost,
      })
    })
})

//* Reviews New
router.get('/new', middleware.checkReviewExistence, function (req, res) {
  //* middleware.checkReviewExistence checks if a user already reviewed,
  //* only one review per user is allowed
  Kost.findById(req.params.id, function (err, kost) {
    if (err || !kost) {
      console.log(err)
      req.flash('error', 'Something Wrong on Reviews New Route')
      return res.redirect('back')
    }
    res.render('reviews/new', {
      kost: kost,
    })
  })
})

//* Reviews Create
router.post(
  '/',
  middleware.checkReviewExistence,
  withValidation(validateReviewCreate, (req) => req.body),
  async function (req, res) {
    try {
      const { kost } = await reviewService.createReview({
        kostId: req.params.id,
        user: req.user,
        payload: req.validated.value,
      })
      req.flash('success', 'Your review has been successfully added.')
      return res.redirect(`/kost/${kost._id}`)
    } catch (err) {
      console.log(err)
      req.flash('error', err.message)
      return res.redirect('back')
    }
  }
)

//* Reviews Edit
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

//* Reviews Update
router.put(
  '/:review_id',
  middleware.checkReviewOwnership,
  withValidation(validateReviewUpdate, (req) => req.body),
  async function (req, res) {
    try {
      const { kost } = await reviewService.updateReview({
        kostId: req.params.id,
        reviewId: req.params.review_id,
        payload: req.validated.value,
      })
      req.flash('success', 'Your review was successfully edited.')
      return res.redirect(`/kost/${kost._id}`)
    } catch (err) {
      console.log(err)
      req.flash('error', err.message)
      return res.redirect('back')
    }
  }
)

//* Reviews Delete
router.delete('/:review_id', middleware.checkReviewOwnership, async function (req, res) {
  try {
    await reviewService.deleteReview({ kostId: req.params.id, reviewId: req.params.review_id })
    req.flash('success', 'Review deleted successfully.')
    return res.redirect('/kost/' + req.params.id)
  } catch (err) {
    console.log(err)
    req.flash('error', err.message)
    return res.redirect('back')
  }
})

//*function
// calculateAverage moved into service

module.exports = router

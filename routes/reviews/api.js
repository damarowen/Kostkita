const express = require('express')
const router = express.Router({ mergeParams: true })
const middleware = require('../../middleware/index')
const { withValidation } = require('../../dtos/validate')
const { validateReviewCreate, validateReviewUpdate } = require('../../dtos/review.dto')
const reviewService = require('../../services/review.service')

// Reviews Create (API)
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

// Reviews Update (API)
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

// Reviews Delete (API)
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

module.exports = router

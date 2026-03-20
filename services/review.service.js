const Review = require('../models/review')
const Kost = require('../models/kost')

/** Compute average rating for a list of reviews */
function calculateAverage(reviews) {
  if (!reviews || reviews.length === 0) {
    return 0
  }
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
  return sum / reviews.length
}

/** Create a review and recompute kost average */
async function createReview({ kostId, user, payload }) {
  const kost = await Kost.findById(kostId).populate('reviews')
  if (!kost) {
    const err = new Error('Kost not existed')
    err.status = 404
    throw err
  }
  const review = new Review(payload)
  review.author.id = user._id
  review.author.username = user.username
  review.kost = kost
  await review.save()
  kost.reviews.push(review)
  kost.rating = calculateAverage(kost.reviews)
  await kost.save()
  return { kost, review }
}

/** Update a review and recompute kost average */
async function updateReview({ kostId, reviewId, payload }) {
  const updatedReview = await Review.findByIdAndUpdate(reviewId, payload, { new: true })
  if (!updatedReview) {
    const err = new Error('Review not existed')
    err.status = 404
    throw err
  }
  const kost = await Kost.findById(kostId).populate('reviews')
  if (!kost) {
    const err = new Error('Kost not existed')
    err.status = 404
    throw err
  }
  kost.rating = calculateAverage(kost.reviews)
  await kost.save()
  return { kost, review: updatedReview }
}

/** Delete a review and recompute kost average */
async function deleteReview({ kostId, reviewId }) {
  await Review.findByIdAndDelete(reviewId)
  const kost = await Kost.findByIdAndUpdate(
    kostId,
    { $pull: { reviews: reviewId } },
    { new: true }
  ).populate('reviews')
  if (!kost) {
    const err = new Error('Kost not existed')
    err.status = 404
    throw err
  }
  kost.rating = calculateAverage(kost.reviews)
  await kost.save()
  return { kost }
}

module.exports = { createReview, updateReview, deleteReview }

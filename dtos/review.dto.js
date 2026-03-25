function isIntInRange(n, min, max) {
  return Number.isInteger(n) && n >= min && n <= max
}

/** Validate review create payload (expects body.review) */
function validateReviewCreate(body) {
  const payload = body && body.review ? body.review : {}
  const errors = []
  const ratingNum = Number(payload.rating)
  if (!isIntInRange(ratingNum, 1, 5)) {
    errors.push('Rating must be an integer 1-5')
  }
  // text is optional, but if present must be a string
  if (payload.text !== undefined && typeof payload.text !== 'string') {
    errors.push('Text must be a string')
  }
  if (errors.length) {
    return { error: errors.join(', '), value: null }
  }
  return { error: null, value: { rating: ratingNum, text: payload.text } }
}

/** Validate review update payload (expects body.review) */
function validateReviewUpdate(body) {
  const payload = body && body.review ? body.review : {}
  const errors = []
  const out = {}
  if (payload.rating !== undefined) {
    const ratingNum = Number(payload.rating)
    if (!isIntInRange(ratingNum, 1, 5)) {
      errors.push('Rating must be an integer 1-5')
    } else {
      out.rating = ratingNum
    }
  }
  if (payload.text !== undefined) {
    if (typeof payload.text !== 'string') {
      errors.push('Text must be a string')
    } else {
      out.text = payload.text
    }
  }
  if (errors.length) {
    return { error: errors.join(', '), value: null }
  }
  return { error: null, value: out }
}

module.exports = { validateReviewCreate, validateReviewUpdate }

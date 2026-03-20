/** Validate comment create payload (expects body.comment) */
function validateCommentCreate(body) {
  const payload = body && body.comment ? body.comment : {}
  const errors = []
  if (typeof payload.text !== 'string' || payload.text.trim().length === 0) {
    errors.push('Comment text is required')
  }
  if (errors.length) {
    return { error: errors.join(', '), value: null }
  }
  return { error: null, value: { text: payload.text.trim() } }
}

/** Validate comment update payload (expects body.commentEdit) */
function validateCommentUpdate(body) {
  const payload = body && body.commentEdit ? body.commentEdit : {}
  const errors = []
  if (payload.text !== undefined) {
    if (typeof payload.text !== 'string' || payload.text.trim().length === 0) {
      errors.push('Comment text is required')
    }
  }
  if (errors.length) {
    return { error: errors.join(', '), value: null }
  }
  return { error: null, value: { text: payload.text ? payload.text.trim() : undefined } }
}

module.exports = { validateCommentCreate, validateCommentUpdate }

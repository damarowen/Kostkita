/** Minimal validation middleware wrapper for DTOs */

/**
 * Wrap a validator to run before route logic.
 * Attaches result to req.validated.value on success and redirects back with flash on error.
 */
function withValidation(validator, pick = (req) => req) {
  return (req, res, next) => {
    try {
      const input = pick(req)
      const { error, value } = validator(input)
      if (error) {
        req.flash('error', error)
        return res.redirect('back')
      }
      // Attach validated value for downstream handlers
      req.validated = req.validated || {}
      req.validated.value = value
      return next()
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = { withValidation }

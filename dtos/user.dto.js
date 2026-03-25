function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0
}

function isEmail(v) {
  return /.+@.+\..+/.test(v)
}

/** Validate user update payload (expects body.editUser) */
function validateUserUpdate(body) {
  const payload = body && body.editUser ? body.editUser : {}
  const out = {}
  const errors = []

  if (payload.username !== undefined) {
    if (!isNonEmptyString(payload.username)) {
      errors.push('Username invalid')
    } else {
      out.username = String(payload.username).trim()
    }
  }
  if (payload.email !== undefined) {
    const email = String(payload.email).trim()
    if (!isEmail(email)) {
      errors.push('Email invalid')
    } else {
      out.email = email
    }
  }
  if (payload.avatar !== undefined) {
    const avatar = String(payload.avatar).trim()
    if (!avatar) {
      errors.push('Avatar invalid')
    } else {
      out.avatar = avatar
    }
  }

  if (errors.length) {
    return { error: errors.join(', '), value: null }
  }
  return { error: null, value: out }
}

/** Validate change password payload (expects body.changePassword) */
function validateChangePassword(body) {
  const payload = (body && body.changePassword) || {}
  const errors = []

  const currentPassword = payload.currentPassword
  const newPassword = payload.newPassword
  const confirmPassword = payload.confirmPassword

  if (!isNonEmptyString(currentPassword)) {
    errors.push('Current password is required')
  }
  if (!isNonEmptyString(newPassword)) {
    errors.push('New password is required')
  } else {
    // basic policy: min 8 chars, at least one letter and one number
    const strongEnough = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(newPassword))
    if (!strongEnough) {
      errors.push('New password must be at least 8 characters and include letters and numbers')
    }
  }
  if (!isNonEmptyString(confirmPassword)) {
    errors.push('Password confirmation is required')
  }
  if (isNonEmptyString(newPassword) && isNonEmptyString(confirmPassword)) {
    if (String(newPassword) !== String(confirmPassword)) {
      errors.push('Password confirmation does not match')
    }
  }

  if (errors.length) {
    return { error: errors.join(', '), value: null }
  }

  // Only return what is needed by service
  return { error: null, value: { currentPassword: String(currentPassword), newPassword: String(newPassword) } }
}

module.exports = { validateUserUpdate, validateChangePassword }

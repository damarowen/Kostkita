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

module.exports = { validateUserUpdate }

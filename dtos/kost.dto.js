/**
 * Lightweight DTO validators for Kost flows (no external deps)
 */

function toInt(val, def) {
  const n = parseInt(val, 10)
  return Number.isFinite(n) ? n : def
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0
}

// Search query: { cari?, page?, limit? }
/** Validate kost search query params */
function validateSearchQuery(query) {
  const term = (query && query.cari ? String(query.cari) : '').trim()
  const limitRaw = query ? query.limit : undefined
  const pageRaw = query ? query.page : undefined
  let limit = toInt(limitRaw, 9)
  let page = toInt(pageRaw, 1)
  if (limit < 1) {
    limit = 9
  }
  if (limit > 9) {
    limit = 9
  }
  if (page < 1) {
    page = 1
  }
  if (term.length > 200) {
    return { error: 'Search term too long', value: null }
  }
  return { error: null, value: { term, limit, page } }
}

// Create/update Kost payload: expects body.kost
/** Validate kost create payload (expects body.kost) */
function validateCreateKost(body) {
  const payload = body && body.kost ? body.kost : {}
  const errors = []
  if (!isNonEmptyString(payload.name)) {
    errors.push('Name is required')
  }
  if (!isNonEmptyString(payload.price)) {
    errors.push('Price is required')
  }
  if (!isNonEmptyString(payload.description)) {
    errors.push('Description is required')
  }
  if (!isNonEmptyString(payload.location)) {
    errors.push('Location is required')
  }
  if (errors.length) {
    return { error: errors.join(', '), value: null }
  }
  return { error: null, value: payload }
}

/** Validate kost update payload */
function validateUpdateKost(body) {
  const payload = body || {}
  const errors = []
  if (payload.name !== undefined && !isNonEmptyString(payload.name)) {
    errors.push('Name invalid')
  }
  if (payload.price !== undefined && !isNonEmptyString(payload.price)) {
    errors.push('Price invalid')
  }
  if (payload.description !== undefined && !isNonEmptyString(payload.description)) {
    errors.push('Description invalid')
  }
  if (payload.location !== undefined && !isNonEmptyString(payload.location)) {
    errors.push('Location invalid')
  }
  if (errors.length) {
    return { error: errors.join(', '), value: null }
  }
  return { error: null, value: payload }
}

module.exports = {
  validateSearchQuery,
  validateCreateKost,
  validateUpdateKost,
}

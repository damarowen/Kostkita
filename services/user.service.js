const User = require('../models/user')

async function updateUser({ id, payload }) {
  const whitelist = {}
  if (payload.username !== undefined) {
    whitelist.username = payload.username
  }
  if (payload.email !== undefined) {
    whitelist.email = payload.email
  }
  if (payload.avatar !== undefined) {
    whitelist.avatar = payload.avatar
  }
  const updated = await User.findByIdAndUpdate(id, whitelist, { new: true, runValidators: true })
  if (!updated) {
    const err = new Error('User not existed')
    err.status = 404
    throw err
  }
  return updated
}

module.exports = { updateUser }

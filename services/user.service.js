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

/**
 * Change user password using passport-local-mongoose utilities.
 * @param {{ id: string, currentPassword: string, newPassword: string }} params
 */
async function changePassword({ id, currentPassword, newPassword }) {
  const user = await User.findById(id)
  if (!user) {
    const err = new Error('User not existed')
    err.status = 404
    throw err
  }
  // changePassword provided by passport-local-mongoose
  await new Promise((resolve, reject) => {
    user.changePassword(currentPassword, newPassword, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
  await user.save()
  return { id: String(user._id) }
}

module.exports.changePassword = changePassword

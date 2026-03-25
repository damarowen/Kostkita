const express = require('express')
const router = express.Router({ mergeParams: true })
const Middleware = require('../../middleware/index')
const { withValidation } = require('../../dtos/validate')
const { validateUserUpdate, validateChangePassword } = require('../../dtos/user.dto')
const userService = require('../../services/user.service')

// Update user profile
router.put(
  '/users/:id',
  Middleware.checkUser,
  withValidation(validateUserUpdate, (req) => req.body),
  async (req, res) => {
    const id_user = req.params.id
    try {
      await userService.updateUser({ id: id_user, payload: req.validated.value })
      req.flash('success', 'User Succeed Update')
      return res.redirect('/users/' + id_user)
    } catch (error) {
      console.log(error.message)
      req.flash('error', 'Failed to update user')
      return res.redirect('back')
    }
  }
)

// Change password and force logout
router.put(
  '/users/:id/password',
  Middleware.checkUser,
  withValidation(validateChangePassword, (req) => req.body),
  async (req, res, next) => {
    const id_user = req.params.id
    try {
      const { currentPassword, newPassword } = req.validated.value
      await userService.changePassword({ id: id_user, currentPassword, newPassword })
      req.logout(function (err) {
        if (err) {
          return next(err)
        }
        req.flash('success', 'Password updated. Please log in again.')
        return res.redirect('/login')
      })
    } catch (error) {
      const message = error && error.message ? error.message : 'Failed to change password'
      req.flash('error', message)
      return res.redirect('back')
    }
  }
)

module.exports = router

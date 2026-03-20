const express = require('express'),
  router = express.Router({
    mergeParams: true,
  }),
  User = require('../models/user'),
  Kost = require('../models/kost'),
  Middleware = require('../middleware/index')
const { withValidation } = require('../dtos/validate')
const { validateUserUpdate } = require('../dtos/user.dto')
const userService = require('../services/user.service')

router.get('/users/:id', Middleware.isLoggedIn, (req, res) => {
  User.findById(req.params.id)
    .lean()
    .exec((err, foundUser) => {
      if (err) {
        req.flash('error', 'wrong')
        return res.redirect('/kost')
      }
      //* where and equals query
      Kost.find()
        .where('author.id')
        .equals(foundUser.id)
        .lean()
        .exec(function (err, foundKost) {
          if (err) {
            console.log(err)
            req.flash('error', 'Somthing wrong with Kost Find Route')
            return res.redirect('/kost')
          }
          res.render('users/show-users', {
            user: foundUser,
            kost: foundKost,
          })
        })
    })
})

router.get('/users/:id/edit', Middleware.checkUser, (req, res) => {
  User.findById(req.params.id)
    .lean()
    .exec((err, foundUser) => {
      if (err) {
        req.flash('error', 'wrong')
        return res.redirect('/kost')
      }
      res.render('users/edit-users', {
        user: foundUser,
      })
    })
})

//UPDATE User
//user/:id
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

module.exports = router

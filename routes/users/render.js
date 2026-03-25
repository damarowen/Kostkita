const express = require('express')
const router = express.Router({ mergeParams: true })
const User = require('../../models/user')
const Kost = require('../../models/kost')
const Middleware = require('../../middleware/index')

// Show user profile
router.get('/users/:id', Middleware.isLoggedIn, (req, res) => {
  User.findById(req.params.id)
    .lean()
    .exec((err, foundUser) => {
      if (err) {
        req.flash('error', 'wrong')
        return res.redirect('/kost')
      }
      Kost.find()
        .where('author.id')
        .equals(foundUser._id)
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

// Render edit profile page
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

// Render change password page
router.get('/users/:id/password/edit', Middleware.checkUser, (req, res) => {
  User.findById(req.params.id)
    .lean()
    .exec((err, foundUser) => {
      if (err || !foundUser) {
        req.flash('error', 'User not found')
        return res.redirect('/kost')
      }
      res.render('users/change-password', { user: foundUser })
    })
})

module.exports = router

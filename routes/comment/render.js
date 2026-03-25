const express = require('express')
const router = express.Router({ mergeParams: true })
const Kost = require('../../models/kost')
const Comment = require('../../models/comment')
const Middleware = require('../../middleware/index')

// Render new comment form
router.get('/new', Middleware.checkCommentExistence, async (req, res) => {
  try {
    const data = await Kost.findById(req.params.id)
    if (!data) {
      req.flash('error', 'Kost Not Found')
      return res.redirect('back')
    }
    return res.render('comment/new', { kost: data })
  } catch (err) {
    console.log(err)
    req.flash('error', 'Failed to load comment form')
    return res.redirect('back')
  }
})

// Render edit comment form
router.get('/:comment_id/edit', Middleware.checkCommentOwner, async (req, res) => {
  const id_kost = req.params.id
  const id_comment = req.params.comment_id
  try {
    const kost = await Kost.findById(id_kost)
    if (!kost) {
      req.flash('error', 'Kost Not Found')
      return res.redirect('back')
    }
    const comment = await Comment.findById(id_comment)
    if (!comment) {
      req.flash('error', 'Comment Not Found')
      return res.redirect('back')
    }
    return res.render('comment/edit', { kost, comment })
  } catch (err) {
    console.log(err)
    req.flash('error', 'Failed to load edit form')
    return res.redirect('back')
  }
})

module.exports = router

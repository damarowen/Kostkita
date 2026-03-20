const express = require('express'),
  router = express.Router({
    mergeParams: true,
  }),
  Kost = require('../models/kost'),
  Comment = require('../models/comment'),
  Middleware = require('../middleware/index')
const { withValidation } = require('../dtos/validate')
const { validateCommentCreate, validateCommentUpdate } = require('../dtos/comment.dto')
const commentService = require('../services/comment.service')

//*comment route new
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

//*add new comment
router.post(
  '/',
  Middleware.checkCommentExistence,
  withValidation(validateCommentCreate, (req) => req.body),
  async function (req, res) {
    try {
      const { kost } = await commentService.createComment({
        kostId: req.params.id,
        user: req.user,
        payload: req.validated.value,
      })
      req.flash('success', 'New Comment Added To ' + kost.name)
      return res.redirect('/kost/' + kost._id)
    } catch (err) {
      console.log(err)
      req.flash('error', 'Failed to add comment')
      return res.redirect('back')
    }
  }
)

//*EDIT COMMENT
///*kost/:id/comment/comment_id/edit
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

//*UPDATE COMMENT
///*kost/:id/comment/comment_id/
router.put(
  '/:comment_id',
  Middleware.checkCommentOwner,
  withValidation(validateCommentUpdate, (req) => req.body),
  async (req, res) => {
    const id_kost = req.params.id
    const id_comment = req.params.comment_id
    try {
      await commentService.updateComment({ commentId: id_comment, payload: req.validated.value })
      req.flash('success', 'Comment Succeed Update')
      return res.redirect(`/kost/${id_kost}`)
    } catch (err) {
      console.log(err)
      req.flash('error', 'Failed to update comment')
      return res.redirect('back')
    }
  }
)

//*DELETE COMMENT
///*kost/:id/comment/comment_id/
router.delete('/:comment_id', Middleware.checkCommentOwner, async function (req, res) {
  const id_kost = req.params.id
  const id_comment = req.params.comment_id

  try {
    await commentService.deleteComment({ kostId: id_kost, commentId: id_comment })
    req.flash('success', 'Comment Succeed Delete')
    return res.redirect(`/kost/${id_kost}`)
  } catch (err) {
    console.log(err)
    req.flash('error', 'Failed to delete comment')
    return res.redirect('back')
  }
})

module.exports = router

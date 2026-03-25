const express = require('express')
const router = express.Router({ mergeParams: true })
const Middleware = require('../../middleware/index')
const { withValidation } = require('../../dtos/validate')
const { validateCommentCreate, validateCommentUpdate } = require('../../dtos/comment.dto')
const commentService = require('../../services/comment.service')

// Create comment
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

// Update comment
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

// Delete comment
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

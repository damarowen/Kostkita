const Comment = require('../models/comment')
const Kost = require('../models/kost')

/** Create a comment for a kost */
async function createComment({ kostId, user, payload }) {
  const kost = await Kost.findById(kostId)
  if (!kost) {
    const err = new Error('Kost not existed')
    err.status = 404
    throw err
  }
  const comment = new Comment(payload)
  comment.author.id = user._id
  comment.author.username = user.username
  comment.kost = kost
  await comment.save()
  kost.comment.push(comment)
  await kost.save()
  return { kost, comment }
}

/** Update a comment by id */
async function updateComment({ commentId, payload }) {
  const updated = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
    runValidators: true,
  })
  if (!updated) {
    const err = new Error('Comment not existed')
    err.status = 404
    throw err
  }
  return updated
}

/** Delete a comment and pull it from kost */
async function deleteComment({ kostId, commentId }) {
  await Kost.findByIdAndUpdate(kostId, { $pull: { comment: commentId } }, { new: true })
  await Comment.findByIdAndDelete(commentId)
}

module.exports = { createComment, updateComment, deleteComment }

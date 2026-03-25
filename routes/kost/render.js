const express = require('express')
const router = express.Router()
const Kost = require('../../models/kost')
const Middleware = require('../../middleware/index')
const { validateSearchQuery } = require('../../dtos/kost.dto')
const { withValidation } = require('../../dtos/validate')
const kostService = require('../../services/kost.service')

// Render: Index list
router.get(
  '/',
  withValidation(validateSearchQuery, (req) => req.query),
  async function (req, res) {
    try {
      const { term, limit, page } = req.validated.value
      if (term) {
        const result = await kostService.searchKosts({ term, page, limit })
        const totalPages = Math.ceil(result.total / result.limit)
        return res.render('kost/index', {
          data: result.items,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages,
          },
          term,
        })
      }
      const result = await kostService.searchKosts({ term: '', page, limit })
      const totalPages = Math.ceil(result.total / result.limit)
      return res.render('kost/index', {
        data: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages,
        },
        term: '',
      })
    } catch (err) {
      console.log(err)
      req.flash('error', 'Something went wrong while loading Kost list')
      return res.redirect('back')
    }
  }
)

// Render: New Kost form
router.get('/new', Middleware.isLoggedIn, function (req, res) {
  res.render('kost/new')
})

// Render: Show one Kost
router.get('/:id', async function (req, res) {
  try {
    const kost = await Kost.findById(req.params.id)
      .populate('likes')
      .populate({
        path: 'reviews',
        options: { sort: { updatedAt: -1 } },
      })
      .populate({
        path: 'comment',
        options: { sort: { updatedAt: -1 } },
      })
    return res.render('kost/show', { kost })
  } catch (err) {
    console.log(err)
    req.flash('error', `${err}`)
    return res.redirect('back')
  }
})

// Render: Edit Kost form
router.get('/:id/edit', Middleware.checkKostOwner, function (req, res) {
  Kost.findById(req.params.id, (err, found) => {
    res.render('kost/edit', { edit_ejs: found })
  })
})

module.exports = router

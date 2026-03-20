const express = require('express')
const router = express.Router()
const Kost = require('../models/kost')
// const Comment = require('../models/comment')
// const Review = require('../models/review')
const Middleware = require('../middleware/index')
const { cloudinary } = require('../utils/cloudinary')
const { validateSearchQuery, validateCreateKost, validateUpdateKost } = require('../dtos/kost.dto')
const { withValidation } = require('../dtos/validate')
const { createMapboxAdapter } = require('../adapters/mapbox.adapter')
const kostService = require('../services/kost.service')
const mapBoxToken = process.env.MAPBOX_API_KEY
const geocoderAdapter = createMapboxAdapter(mapBoxToken)

//**INDEX ROUTE - DISPLAY ALL KOST
//** @route  /KOST
//** @access  Public

router.get(
  '/',
  withValidation(validateSearchQuery, (req) => req.query),
  async function (req, res) {
    try {
      const { term, limit, page } = req.validated.value
      if (term) {
        const result = await kostService.searchKosts({ term, page, limit })
        return res.render('kost/index', { data: result.items })
      }
      const result = await kostService.searchKosts({ term: '', page, limit })
      return res.render('kost/index', { data: result.items })
    } catch (err) {
      console.log(err)
      req.flash('error', 'Something went wrong while loading Kost list')
      res.redirect(`back`)
    }
  }
)

//**RENDER NEW KOST
//** @route  /kost/new
//** @access  Private
router.get('/new', Middleware.isLoggedIn, function (req, res) {
  res.render('kost/new')
})

//**CREATE ROUTE - ADD NEW KOST
//** @route  /kost
//** @access  Private
router.post(
  '/',
  Middleware.isLoggedIn,
  Middleware.uploads,
  withValidation(validateCreateKost, (req) => req.body),
  async function (req, res) {
    try {
      const payload = req.validated.value
      const addKost = await kostService.createKost({
        payload,
        images: req.files,
        user: req.user,
        geocoder: geocoderAdapter,
      })
      console.log(addKost)
      req.flash('success', 'Succesfully Added New Kost')
      return res.redirect('/kost')
    } catch (err) {
      console.log(err)
      req.flash('error', 'Failed to create Kost')
      res.redirect(`back`)
    }
  }
)

//**SHOW KOST
//** @route  /kost/:ID
//** @access  Public
router.get('/:id', async function (req, res) {
  try {
    const kost = await Kost.findById(req.params.id)
      .populate('likes')
      .populate({
        path: 'reviews',
        options: {
          sort: {
            updatedAt: -1,
          },
        },
      })
      .populate({
        path: 'comment',
        options: {
          sort: {
            updatedAt: -1,
          },
        },
      })
    res.render('kost/show', {
      kost,
    })
  } catch (err) {
    //* display error from mongoose validation
    console.log(err)
    req.flash('error', `${err}`)
    res.redirect(`back`)
  }
})

//**RENDER EDIT kost
//** @route  /kost/:ID/edit
//** @access  Private
router.get('/:id/edit', Middleware.checkKostOwner, function (req, res) {
  Kost.findById(req.params.id, (err, found) => {
    res.render('kost/edit', {
      edit_ejs: found,
    })
  })
})

//**UPDATE KOST
//** @route  /kost/:ID
//** @access  Private
router.put(
  '/:id',
  Middleware.ValidateImage,
  withValidation(validateUpdateKost, (req) => req.body),
  async function (req, res) {
    try {
      const payload = req.validated.value
      const kost = await kostService.updateKost({
        id: req.params.id,
        payload,
        images: req.files,
        geocoder: geocoderAdapter,
      })
      console.log('Kost Updated via Cloudinary')
      req.flash('success', 'Successfully Updated!')
      res.redirect(`/kost/${kost._id}`)
    } catch (err) {
      // //* display error from mongoose validation
      // const message = Object.values(err.errors).map(val => val);
      console.log(err)
      req.flash('error', `${err}`)
      res.redirect(`back`)
    }
  }
)

//**DELETE KOST
//** @route  /kost/:ID
//** @access  Private
router.delete('/:id', Middleware.checkKostOwner, async function (req, res) {
  try {
    await kostService.deleteKost({ id: req.params.id, cloudinary })
    req.flash('success', 'Kost deleted successfully!')
    return res.redirect('/kost')
  } catch (err) {
    console.log(err)
    req.flash('error', `${err}`)
    return res.redirect('back')
  }
})

//**DELETE PHOTO CLIENT SIDE
//** @route  /kost/:ID/:cloudinaryFolder/:imageId
//** @access  Private

router.post('/:id/KostKita/:imageid', async function (req, res) {
  try {
    const file = `KostKita/${req.params.imageid}`
    await kostService.removeImage({ id: req.params.id, publicId: file, cloudinary })
    console.log(`${file} Deleted...`)
    return res.status(200).json({ success: true })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ success: false, message: 'Failed to delete image' })
  }
})

//**LIKE BUTTON
//** @route  /kost/:ID/Like
//** @access  Private

router.post('/:id/like', Middleware.isLoggedIn, async function (req, res) {
  try {
    const result = await kostService.toggleLike({ kostId: req.params.id, userId: req.user._id })
    // If request comes from XHR (axios) or expects JSON, respond with JSON
    const wantsJSON =
      req.xhr || (req.get('Accept') && req.get('Accept').includes('application/json'))
    if (wantsJSON) {
      return res.json({ success: true, ...result })
    }
    return res.redirect('/kost/' + req.params.id)
  } catch (err) {
    console.log(err)
    const wantsJSON =
      req.xhr || (req.get('Accept') && req.get('Accept').includes('application/json'))
    if (wantsJSON) {
      return res.status(400).json({ success: false, message: 'Failed to toggle like' })
    }
    req.flash('error', 'Failed to toggle like')
    return res.redirect('back')
  }
})

//

module.exports = router

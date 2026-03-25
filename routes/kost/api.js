const express = require('express')
const router = express.Router()
const Middleware = require('../../middleware/index')
const { cloudinary } = require('../../utils/cloudinary')
const { validateCreateKost, validateUpdateKost } = require('../../dtos/kost.dto')
const { withValidation } = require('../../dtos/validate')
const { createMapboxAdapter } = require('../../adapters/mapbox.adapter')
const kostService = require('../../services/kost.service')

const mapBoxToken = process.env.MAPBOX_API_KEY
const geocoderAdapter = createMapboxAdapter(mapBoxToken)

// Create Kost
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
      return res.redirect('back')
    }
  }
)

// Update Kost
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
      return res.redirect(`/kost/${kost._id}`)
    } catch (err) {
      console.log(err)
      req.flash('error', `${err}`)
      return res.redirect('back')
    }
  }
)

// Delete Kost
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

// Delete Photo (XHR)
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

// Like (supports HTML and JSON)
router.post('/:id/like', Middleware.isLoggedIn, async function (req, res) {
  try {
    const result = await kostService.toggleLike({ kostId: req.params.id, userId: req.user._id })
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

module.exports = router

const Kost = require('../models/kost')
const Comment = require('../models/comment')

/** Build Mongo filter for kost search */
function buildSearchFilter(term) {
  if (!term) {
    return {}
  }
  const regex = { $regex: term, $options: 'i' }
  return {
    $or: [{ name: regex }, { location: regex }, { 'author.username': regex }],
  }
}

/** Search kosts with pagination */
async function searchKosts({ term, page, limit }) {
  const skip = (page - 1) * limit
  const filter = buildSearchFilter(term)
  const [items, total] = await Promise.all([
    Kost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Kost.countDocuments(filter),
  ])
  return { items, total, page, limit }
}

/** Add new kost with geometry */
async function createKost({ payload, images, user, geocoder }) {
  const addKost = new Kost(payload)
  const geometry = await geocoder.forwardGeocodeSingle(payload.location)
  addKost.geometry = geometry
  addKost.image = (images || []).map((f) => ({
    url: f.path || f.secure_url || f.url,
    filename: f.filename || f.public_id,
  }))
  addKost.author = {
    id: user._id,
    username: user.username,
  }
  await addKost.save()
  return addKost
}

/** Update kost fields, geometry, and append images */
async function updateKost({ id, payload, images, geocoder }) {
  // Update primitive fields first
  const kost = await Kost.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  if (!kost) {
    const err = new Error('Kost not found')
    err.status = 404
    throw err
  }
  // Update geometry if location provided
  if (payload.location) {
    const geometry = await geocoder.forwardGeocodeSingle(payload.location)
    kost.geometry = geometry
  }
  // Append new images if any
  if (Array.isArray(images) && images.length) {
    const imgs = images.map((f) => ({
      url: f.path || f.secure_url || f.url,
      filename: f.filename || f.public_id,
    }))
    kost.image.push(...imgs)
  }
  await kost.save()
  return kost
}

/** Toggle like for a kost by user */
const Review = require('../models/review')

async function toggleLike({ kostId, userId }) {
  const kost = await Kost.findById(kostId)
  if (!kost) {
    const err = new Error('Kost not existed')
    err.status = 404
    throw err
  }
  const already = kost.likes.some((u) => u.equals(userId))
  if (already) {
    kost.likes.pull(userId)
  } else {
    kost.likes.push(userId)
  }
  await kost.save()
  return { liked: !already, count: kost.likes.length, kostId: kost._id }
}

/** Delete kost with related comments, reviews, and images */
async function deleteKost({ id, cloudinary }) {
  const kost = await Kost.findById(id)
  if (!kost) {
    const err = new Error('Kost not existed')
    err.status = 404
    throw err
  }
  // Delete related comments and reviews
  if (Array.isArray(kost.comment) && kost.comment.length) {
    await Comment.deleteMany({ _id: { $in: kost.comment } })
  }
  if (Array.isArray(kost.reviews) && kost.reviews.length) {
    await Review.deleteMany({ _id: { $in: kost.reviews } })
  }
  // Delete images from Cloudinary (best-effort)
  if (Array.isArray(kost.image)) {
    for (const img of kost.image) {
      const filename = img && img.filename
      if (!filename) {
        continue
      }
      try {
        await cloudinary.uploader.destroy(filename)
      } catch (e) {
        // log and continue
        // eslint-disable-next-line no-console
        console.log(`Failed to delete image ${filename}: ${e && e.message}`)
      }
    }
  }
  await Kost.findByIdAndDelete(id)
}

/** Remove a single image from kost and Cloudinary */
async function removeImage({ id, publicId, cloudinary }) {
  const file = publicId
  // Remove from DB first
  await Kost.updateOne({ _id: id }, { $pull: { image: { filename: file } } })
  // Then remove from cloud
  await cloudinary.uploader.destroy(file)
  return { success: true }
}

module.exports = {
  searchKosts,
  createKost,
  updateKost,
  toggleLike,
  deleteKost,
  removeImage,
}

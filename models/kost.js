const mongoose = require('mongoose')

//** sanitize with dom purify and markdown html with JSDOM */
const markedModule = require('marked')
const marked = markedModule.marked || markedModule
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const kostSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a name'],
  },
  price: {
    type: String,
    required: [true, 'Please add a price'],
  },
  image: [
    {
      url: String,
      filename: String,
    },
  ],
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
})

//** sanitize and marked */
kostSchema.pre('validate', function (next) {
  if (this.description) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.description))
  }

  next()
})
// Indexes for performance
kostSchema.index({ 'author.id': 1 })
kostSchema.index({ location: 1 })

module.exports = mongoose.model('Kost', kostSchema, 'Kost')

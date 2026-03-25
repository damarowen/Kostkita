const Review = require('../models/review')
const Kost = require('../models/kost')
const Comment = require('../models/comment')
const User = require('../models/user')

//*all the middleware goes here
const middlewareObj = {}

// Keep legacy name for compatibility; add correct alias
middlewareObj.isLogggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('error', 'please login first')
    res.redirect('/login')
  }
}

middlewareObj.isLoggedIn = middlewareObj.isLogggedIn

//*KOST MIDDLEWARE

middlewareObj.checkKostOwner = (req, res, next) => {
  const id_data = req.params.id
  if (req.isAuthenticated()) {
    Kost.findById(id_data, function (err, data) {
      if (err || !data) {
        //handle error jika data tdk ketemu
        req.flash('error', 'Kost Not Found')
        res.redirect('back')
        console.log(!data)
      } else {
        //does user own the KOST
        if (data.author.id.equals(req.user._id) || req.user.isAdmin) {
          console.log(` isAdmin : ${req.user.isAdmin}`)
          next()
        } else {
          req.flash('error', 'You Are Not Authorized')
          res.redirect('back')
        }
      }
    })
  } else {
    req.flash('error', 'Please Login First')
    res.redirect('back') //if ini untuk user belum login
  }
}

//*COMMENNT MIDDLEWARE

middlewareObj.checkCommentExistence = async function (req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      req.flash('error', 'You need to login first.')
      return res.redirect('back')
    }
    const kostId = req.params.id
    if (!kostId) {
      return next()
    }
    const exists = await Comment.exists({
      kost: kostId,
      'author.id': req.user._id,
    })
    if (exists) {
      req.flash('error', 'You already wrote a Comment.')
      return res.redirect(`/kost/${kostId}`)
    }
    return next()
  } catch (err) {
    console.log(err)
    req.flash('error', 'Something went wrong.')
    return res.redirect('back')
  }
}

middlewareObj.checkCommentOwner = (req, res, next) => {
  const id_comment = req.params.comment_id

  if (req.isAuthenticated()) {
    Comment.findById(id_comment, (err, data) => {
      if (err || !data) {
        //*handle error jika data tdk ketemu
        req.flash('error', 'Comment Not Found')
        res.redirect('back')
        console.log(!data)
      } else {
        //*does user own the comment
        if (data.author.id.equals(req.user._id) || req.user.isAdmin) {
          next()
        } else {
          res.send('YOU ARE NOT USER')
        }
      }
    })
  } else {
    req.flash('error', 'Please Login First')
    res.redirect('back') //*if ini untuk user belum login
  }
}

//*REVIEW MIDDLEWARE

middlewareObj.checkReviewOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Review.findById(req.params.review_id, function (err, foundReview) {
      if (err || !foundReview) {
        req.flash('error', 'Review Not Existed')
        res.redirect('back')
      } else {
        // does user own the comment?
        if (foundReview.author.id.equals(req.user._id) || req.user.isAdmin) {
          next()
        } else {
          req.flash('error', "You don't have permission to do that")
          res.redirect('back')
        }
      }
    })
  } else {
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('back')
  }
}

middlewareObj.checkReviewExistence = async function (req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      req.flash('error', 'You need to login first.')
      return res.redirect('back')
    }
    const kostId = req.params.id
    if (!kostId) {
      return next()
    }
    const exists = await Review.exists({
      kost: kostId,
      'author.id': req.user._id,
    })
    if (exists) {
      req.flash('error', 'You already wrote a review.')
      return res.redirect(`/kost/${kostId}`)
    }
    return next()
  } catch (err) {
    console.log(err)
    req.flash('error', 'Something went wrong.')
    return res.redirect('back')
  }
}

middlewareObj.checkUser = (req, res, next) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err || !foundUser) {
      req.flash('error', 'User Not Existed')
      res.redirect('back')
    } else {
      // does user is same
      if (foundUser._id.equals(req.user._id) || req.user.isAdmin) {
        next()
      } else {
        req.flash('error', "You don't have permission to do that")
        res.redirect('back')
      }
    }
  })
}

//* UPLOAD MIDDLEWARE

//* upload image
const multer = require('multer')
const { storage } = require('../utils/cloudinary')

//* filter upload image only (jpg|jpeg|png|gif)
const imageFilter = function (req, file, cb) {
  //* accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
    // To reject this file pass `false`, like so:
    return cb('Error ! Please upload only Image this is from imagefilter')
  }
  //* To accept the file pass `true`, like so:
  cb(null, true)
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  }, //* 10mb
  fileFilter: imageFilter,
})

middlewareObj.uploads = function (req, res, next) {
  upload.array('image', 3)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err)
      req.flash('error', 'File is too big or Max file choose reached')
      res.redirect('back')
    } else if (err) {
      console.log(err)
      req.flash('error', 'Error ! Please upload only Imagee')
      res.redirect('back')
    } else {
      next()
    }
  })
}

//*this middleware for image max 3 limit for any upload
middlewareObj.ValidateImage = function (req, res, next) {
  const uploads = function (num) {
    upload.array('image', num)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log(err)
        req.flash('error', 'File is too big or Max file choose reached')
        res.redirect('back')
      } else if (err) {
        console.log(err)
        req.flash('error', 'Error ! Please upload only Imagee')
        res.redirect('back')
      } else {
        console.log(req.files)
        next()
      }
    })
  }

  Kost.findById(req.params.id, (err, found) => {
    const max = 3
    if (found.image.length === max) {
      uploads(0)
    } else if (found.image.length === 2) {
      uploads(1)
    } else if (found.image.length === 1) {
      uploads(2)
    } else {
      uploads(3)
    }
  })
}

module.exports = middlewareObj

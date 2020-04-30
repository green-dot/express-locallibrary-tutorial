const Author = require('./../models/author')
const Book = require('./../models/book')
const async = require('async')

const { body, validationResults } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

// display list of all authors
exports.author_list = function (req, res, next){
  Author.find()
    .populate('author')
    .sort([['family_name', 'ascending']])
    .exec(function(err, list_authors){
      if (err) {return next(err)}

      res.render('author_list', {title: 'Author List', author_list: list_authors})
    })
}

// Display page for a specific author
exports.author_detail = function (req, res, next) {
  async.parallel({
    author: function(callback){
      Author.findById(req.params.id)
        .exec(callback)
    },
    author_books: function(callback){
      Book.find({'author': req.params.id}, 'title summary')
        .exec(callback)
    }
  },
  function(err, results){
    if (err) {return next(err)}
    if (results.author === null) {
      const err = new Error('Author not fonud');
      err.status = 404;
      return next(err)
    }
    res.render('author_detail', {title: 'Author Detail', author: results.author, author_books: results.author_books})
  })
}

// Display Author create form on GET
exports.author_create_get = function (req, res, next) {
  res.render('author_form', {title: 'Create Author'})
}

// Display Author create on POST
exports.author_create_post = [
  // Validate fields
  body('first_name').isLength({min:1}).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('family_name').isLength({min: 1}).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
  body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),

  // Sanitize fields
  sanitizeBody('first_name').escape(),
  sanitizeBody('family_name').escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  // Process request
  (req, res, next) => {

    const errors = validationResults(req)

    if (!errors.isEmpty()){
      res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array()})
      return;
    } else {
      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      })

      author.save(function(err){
        if (err){return next(err)}
        res.redirect(author.url)
      })
    }
  }
]

// Display Author delete form on GET
exports.author_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
}

// Handle Author delete on POST.
exports.author_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete Post')
}

// Display Author update form on GET.
exports.author_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
}

// Display Author update on POST
exports.author_update_post = function (req, res) {
  res.send('NOT IMPLIMENTED: Author update POST')
}
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: {type: String, required: true, max: 100},
  family_name: {required: true, max: 100, type: String},
  date_of_birth: {type: Date},
  date_of_death: {type: Date}
})

// Virtual property for authors full name
AuthorSchema
  .virtual('name')
  .get(function () {

    let fullName = '';

    if (this.first_name && this.family_name){
      fullName = `${this.first_name} ${this.family_name}`
    }

    if (!this.first_name || !this.family_name){
      fullName = ''
    }

    return fullName
  })

// Virtual property for authors lifespan
AuthorSchema
  .virtual('lifespan')
  .get(function() {
    return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString()
  })

// Virtual for authors URL
AuthorSchema
  .virtual('url')
  .get(function() {
    return `/catalog/author/${this._id}`
  })

// Export model
module.exports = mongoose.model('Author', AuthorSchema)
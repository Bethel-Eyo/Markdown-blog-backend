const mongoose = require("mongoose");
// this converts narkdown to html
const marked = require('marked');
const slugify = require('slugify');
// this enables us to create html
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
// and then we can purify the html by using the dom window object
const domPurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
});

/** Slug is t be used in the url in place of the id to make it look more beautiful
 * So anytime the save mthod is to be validated, we run the function to create the slug
 * the strict ensures that abstract characters aren't used in the slugs
 */
articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if(this.markdown){
    /** the sanitize purifies the html to get rid of any malicious code that could be
     * in there and to get rid of html characters.
    */
    this.sanitizedHtml = domPurify.sanitize(marked(this.markdown))
  }

  next()
})
module.exports = mongoose.model('Article', articleSchema);
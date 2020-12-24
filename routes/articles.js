const express = require("express");
const { findById } = require("../models/article");
const router = express.Router();
const Article = require("../models/article");

router.get("/", async (req, res) => {
  // res.send('In Articles');
  const articles = await Article.find();
  res.json(articles);
});

router.post("/new", async (req, res, next) => {
  req.article = new Article();
  next();
}, saveArticle());

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) {
    article = {};
    res.json(article);
  } else {
    res.json(article);
  }
});

router.get("/getId/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article == null) {
    article = {};
    res.json(article);
  } else {
    res.json(article);
  }
});

router.put('/edit', async (req, res, next) => {
  req.article = await Article.findById(req.body.id);
  next();
}, saveArticle())

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({
    msg: 'article deleted successfully'
  });
})

function saveArticle() {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.json({
        msg: `Article saved Successfully with an id: ${article.id}`,
        type: "success",
        slug: article.slug,
      });
    } catch (e) {
      console.log("something went wrong" + e);
    res.json({ msg: "an error occured", type: "error", slug: null });
    }
  }
}

module.exports = router;

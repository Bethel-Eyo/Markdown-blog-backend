const express = require("express");
const mongoose = require("mongoose");
const articleRouter = require("./routes/articles");
/** this is used to override the get method for the frontend
 * when we originally want to call a delete method but since we
 * are using react for the frontend and axios has a delte method,
 * we won't be needing it.
 */
const methodOverride = require('method-override');
const cors = require("cors");

const app = express();

// to be able to access contents in post requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.use(cors());

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.use("/articles", articleRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5000);

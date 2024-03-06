const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const studentRoutes = require("./routes/student-routes");
const facultyRoutes = require("./routes/faculty-routes");

mongoose
  .connect("mongodb://127.0.0.1:27017/exampleDB")
  .then(() => {
    console.log("成功連結 mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// students 相關的 routes
app.use("/students", studentRoutes);

// faculty 相關的 routes
app.use("/faculty", facultyRoutes);

// error message 會傳到這個 middleware
app.use((err, req, res, next) => {
  console.log("正在使用這個 middleware");
  return res.status(400).render("error");
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽 port 3000");
});

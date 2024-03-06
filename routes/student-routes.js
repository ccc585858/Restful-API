const express = require("express");
const router = express.Router();
const Student = require("../models/student");

router.get("/", async (req, res, next) => {
  try {
    let studentData = await Student.find({}).exec();
    // return res.send(studentData);
    return res.render("students", { studentData });
  } catch (e) {
    // return res.status(500).send("尋找資料時發生錯誤...");
    next(e); // 將 error message 往下傳到最後面的 middleware
  }
});

router.get("/new", (req, res) => {
  return res.render("new-student-form");
});

router.get("/:_id", async (req, res, next) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id }).exec();
    if (foundStudent != null) {
      return res.render("student-page", { foundStudent });
    } else {
      return res.status(400).render("student-not-found");
    }
    // return res.send(foundStudent);
  } catch (e) {
    // console.log(e);
    // return res.status(400).render("student-not-found");
    next(e);
  }
});

// 編輯學生資料頁面
router.get("/:_id/edit", async (req, res, next) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id }).exec();
    if (foundStudent != null) {
      return res.render("edit-student", { foundStudent });
    } else {
      return res.status(400).render("student-not-found");
    }
    // return res.send(foundStudent);
  } catch (e) {
    // console.log(e);
    // return res.status(400).render("student-not-found");
    next(e);
  }
});

// 刪除學生資料頁面
router.get("/:_id/delete", async (req, res, next) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id }).exec();
    if (foundStudent != null) {
      return res.render("delete-student", { foundStudent });
    } else {
      return res.status(400).render("student-not-found");
    }
    // return res.send(foundStudent);
  } catch (e) {
    // console.log(e);
    // return res.status(400).render("student-not-found");
    next(e);
  }
});

router.post("/", async (req, res) => {
  try {
    let { name, age, merit, other } = req.body;
    let newStudent = new Student({
      name,
      age,
      scholarship: {
        merit,
        other,
      },
    });
    let saveStudent = await newStudent.save();
    return res.render("student-save-success", { saveStudent });
  } catch (e) {
    return res.status(400).render("student-save-fail");
  }
});

router.put("/:_id", async (req, res) => {
  // return res.send("正在接收 PUT request...");
  try {
    let { _id } = req.params;
    let { name, age, major, merit, other } = req.body;
    let newData = await Student.findOneAndUpdate(
      { _id },
      { name, age, major, scholarship: { merit, other } },
      { new: true, runValidators: true, overwrite: true }
      // 因為 HTTP put request 要求客戶提供所有數據，所以
      // 我們需要根據客戶端提供的數據，更新資料庫內的資料
    );
    return res.render("student-update-success", { newData });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

class NewData {
  constructor() {}
  setProperty(key, value) {
    if (key !== "merit" && key !== "other") {
      this[key] = value;
    } else {
      this[`scholarship.${key}`] = value;
    }
  }
}

router.patch("/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let newObject = new NewData();
    for (let property in req.body) {
      newObject.setProperty(property, req.body[property]);
    }
    // console.log(req.body);
    // console.log(newObject);

    let newData = await Student.findOneAndUpdate({ _id }, newObject, {
      new: true,
      runValidators: true,
      // 不能寫 overwrite: true，不然會複寫整個物件
    });

    return res.send({
      msg: "成功跟新學生資料!",
      updatedData: newData,
    });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

router.delete("/:_id", async (req, res) => {
  // return res.send("正在接收 DELETE request...");
  try {
    let { _id } = req.params;
    let deleteResult = await Student.findOneAndDelete({ _id });
    // return res.send(deleteResult);
    return res.render("student-delete-success", { deleteResult });
  } catch (e) {
    console.log(e);
    return res.status(500).render("student-delete-fail");
  }
});

module.exports = router;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const sutdentSchema = new Schema({
  name: {
    type: String,
    required: true,
    minglength: 2,
  },
  age: {
    type: Number,
    default: 18,
    max: [80, "可能有點太老了..."],
    min: [0, "年齡不能小於0..."],
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, "學生 merit scholarship 太多了"],
      default: 0,
    },
    other: {
      type: Number,
      min: 0,
    },
  },
});

const Student = mongoose.model("Student", sutdentSchema);

module.exports = Student;

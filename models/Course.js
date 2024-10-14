const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
const mongoose = require('mongoose');
const slugify = require('slugify');
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
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

CourseSchema.pre('validate', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
    replacement: '-',
  });
  next();
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;

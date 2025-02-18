const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  date: String,
  steps: Number,
  calories: Number,
});

const ResultSchema = new mongoose.Schema({
  email: { type: String, required: true },
  activityData: [ActivitySchema],
  completedWorkouts: Number,
  totalWorkouts: Number,
  consistencyRate: Number,
  recommendations: {
    general: String,
    workout: String,
    nutrition: String,
    recovery: String,
  },
});

module.exports = mongoose.model("Result", ResultSchema);

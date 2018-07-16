const mongoose = require('mongoose');
const moment = require('moment');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: 'Please provide a title' },
  discipline: { type: String, enum: ['Kata', 'Keiko', 'Shiai', 'Jodan', 'Nito', 'Shin-sa', 'Mitori-geiko', 'Asa-geiko'], required: 'Please provide a discipline' },
  date: Date,
  duration: { type: Number, required: 'Please provide a duration' },
  notes: String,
  creator: { type: mongoose.Schema.ObjectId, ref: 'User' }
},{
  id: false
});

sessionSchema.path('date')
  .get(function formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
  });


sessionSchema.set('toJSON', {
  virtuals: true,
  getters: true
});


module.exports = mongoose.model('Session', sessionSchema);

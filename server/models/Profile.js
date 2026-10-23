const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema(
  { name: { type: String, default: 'Damar Restu Santoso' },
    role: { type: String, default: 'Aspiring Full-Stack Developer' },
    bio: { type: String, default: '' },
    education: [{ school: String, degree: String, period: String, description: String }],
    journey: [{ title: String, description: String, period: String }],
    socials: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' }
    } },
  { timestamps: true }
);
module.exports = mongoose.model('Profile', profileSchema);

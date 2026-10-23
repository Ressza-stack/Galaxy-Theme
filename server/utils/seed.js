require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Profile = require('../models/Profile');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'change-me-now';
  if (!(await Admin.findOne({ username }))) {
    await Admin.create({ username, password });
    console.log('Admin created:', username);
  }

  // Hapus project lama & masukkan yang baru dengan gambar yang valid
  await Project.deleteMany({});
  await Project.insertMany([
    { 
      title: 'Personal Portfolio Website', 
      description: 'A full-stack galaxy-themed portfolio website built with React, Express, and MongoDB.', 
      tech: ['React', 'Express', 'MongoDB'], 
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800', // Gambar coding
      order: 1 
    },
    { 
      title: 'E-Kantin', 
      description: 'A school canteen food ordering application designed to make ordering food faster and more efficient.', 
      tech: ['React Native', 'Express', 'MongoDB'], 
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800', // Gambar makanan/kantin
      order: 2 
    },
    { 
      title: 'Financial Notes', 
      description: 'A personal finance tracking web app to record daily expenses and manage budgets.', 
      tech: ['Python', 'Flask', 'MySQL'], 
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', // Gambar keuangan
      order: 3 
    }
  ]);
  console.log('Sample projects inserted with valid images');

  if ((await Profile.countDocuments()) === 0) {
    await Profile.create({
      bio: 'I am an aspiring full-stack developer passionate about building clean, functional, and user-focused web applications.',
      socials: { github: 'https://github.com/damar', linkedin: '', instagram: '' }
    });
    console.log('Profile created');
  }

  await mongoose.disconnect();
  console.log('Done');
})().catch((err) => { console.error(err); process.exit(1); });
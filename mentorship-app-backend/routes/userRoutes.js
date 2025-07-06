const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/user'); // adjust path
const authenticate = require('../middlewares/authMiddleware'); // your JWT auth middleware

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/', 
  filename: (req, file, cb) => {
    cb(null, `user_${req.user.id}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2 MB

const VALID_SKILLS = ['JavaScript', 'Python', 'Node.js', 'React', 'SQL'];

router.put('/me/profile', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, skills, bio } = req.body;

    let parsedSkills = skills;
    if (skills && typeof skills === 'string') {
      try {
        parsedSkills = JSON.parse(skills);
      } catch {
        parsedSkills = skills.split(',').map(s => s.trim());
      }
    }

        if (parsedSkills && !Array.isArray(parsedSkills)) {
        console.warn('Invalid skills format received:', skills);
        return res.status(400).json({ error: 'Skills must be an array' });
      }

    if (parsedSkills && !parsedSkills.every(skill => VALID_SKILLS.includes(skill))) {
      return res.status(400).json({ error: `Skills must be from: ${VALID_SKILLS.join(', ')}` });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (parsedSkills) user.skills = parsedSkills;
    if (req.file) user.imageUrl = `/uploads/${req.file.filename}`;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'bio', 'imageUrl', 'skills'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user); // ✅ Return the full user info
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/available', authMiddleware, async (req, res) => {
  try {
    // Return mentors excluding current user
    const mentors = await User.findAll({
      where: { role: 'mentor' },
      attributes: ['id', 'name', 'email', 'skills']
    });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;


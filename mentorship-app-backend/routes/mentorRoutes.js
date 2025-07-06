const express = require('express');
const router = express.Router();
const { User, Availability } = require('../models');

// GET /api/mentors/available
router.get('/available', async (req, res) => {
  try {
    const mentors = await User.findAll({
      where: { role: 'mentor' },
      include: {
        model: Availability,
        as: 'availabilities', // 🔥 match this to your association
        required: false,
        attributes: ['weekday', 'start_time', 'end_time'],
      },
      attributes: ['id', 'name', 'email', 'imageUrl', 'bio'],
    });

    res.json({ mentors });
  } catch (err) {
    console.error('Error fetching available mentors:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

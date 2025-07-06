const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { Session, Request, User } = require('../models');

router.get('/upcoming', authMiddleware, async (req, res) => {
  try {
    const where = req.user.role === 'mentor'
      ? { mentorId: req.user.id }
      : { menteeId: req.user.id };

    const sessions = await Session.findAll({
      where,
      include: [
        { model: User, as: 'mentor', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'mentee', attributes: ['id', 'name', 'email'] },
      ],
      order: [['scheduledTime', 'ASC']],
    });
    res.json(sessions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

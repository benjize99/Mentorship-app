const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { Request } = require('../models');

router.post('/', authMiddleware, async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Authenticated user:', req.user);
  try {
    const { mentorId } = req.body;
    if (!mentorId) return res.status(400).json({ error: 'mentorId required' });

    // Optional: check if mentor exists in DB here, e.g.,
    // const mentorExists = await User.findOne({ where: { id: mentorId, role: 'mentor' } });
    // if (!mentorExists) return res.status(404).json({ error: 'Mentor not found' });

    const request = await Request.create({
      menteeId: req.user.id,
      mentorId,
      status: 'pending',
    });

    res.status(201).json({ message: 'Request created', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (request.mentorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Request ${status}`, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/mine', authMiddleware, async (req, res) => {
  const { Request, User } = require('../models');
  try {
    const requests = await Request.findAll({
      where: { menteeId: req.user.id },
      include: [{ model: User, as: 'mentor', attributes: ['id', 'name', 'email'] }],
    });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/pending', authMiddleware, async (req, res) => {
  const { Request, User } = require('../models');
  try {
    const requests = await Request.findAll({
      where: { mentorId: req.user.id, status: 'pending' },
      include: [{ model: User, as: 'mentee', attributes: ['id', 'name', 'email'] }],
    });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { User } = require('../models');

router.get('/users', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ['password'] },
    });

    res.json({
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users: rows,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id/role', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['mentee', 'mentor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

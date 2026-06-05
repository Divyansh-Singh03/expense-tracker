const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET /api/expenses - sare expenses lao (filters ke saath)
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/expenses/summary - monthly summary
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const expenses = await Expense.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Total this month
    const totalThisMonth = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Total per category
    const perCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    // Highest single expense
    const highest = expenses.reduce(
      (max, e) => (e.amount > max.amount ? e : max),
      { amount: 0 }
    );

    res.json({ totalThisMonth, perCategory, highest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/expenses - naya expense add karo
router.post('/', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if (new Date(date) > new Date()) {
      return res.status(400).json({ message: 'Future dates not allowed' });
    }

    const expense = new Expense({ amount, category, date, note });
    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/expenses/:id - expense edit karo
router.put('/:id', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    if (amount && amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }
    if (date && new Date(date) > new Date()) {
      return res.status(400).json({ message: 'Future dates not allowed' });
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { amount, category, date, note },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/expenses/:id - expense delete karo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
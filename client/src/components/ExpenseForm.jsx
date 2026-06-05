import { useState, useEffect } from 'react';
import { createExpense, updateExpense } from '../api/expenseApi';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const today = new Date().toISOString().split('T')[0];

export default function ExpenseForm({ editingExpense, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: today,
    note: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date.split('T')[0],
        note: editingExpense.note || '',
      });
    } else {
      setForm({ amount: '', category: '', date: today, note: '' });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.amount || form.amount <= 0) return 'Amount must be positive';
    if (!form.category) return 'Category is required';
    if (!form.date) return 'Date is required';
    if (form.date > today) return 'Future dates not allowed';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingExpense) {
        await updateExpense(editingExpense._id, form);
      } else {
        await createExpense(form);
      }
      onSuccess();
      setForm({ amount: '', category: '', date: today, note: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            max={today}
          />
        </div>

        <div className="form-group">
          <label>Note (optional)</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Add a note..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : editingExpense ? 'Update' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
import { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import FilterBar from './components/FilterBar';
import SummaryPanel from './components/SummaryPanel';
import ExpenseChart from './components/ExpenseChart';
import { getExpenses, getSummary, deleteExpense } from './api/expenseApi';
import './App.css';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({ category: 'All', startDate: '', endDate: '' });
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await getExpenses(params);
      setExpenses(res.data);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await getSummary();
      setSummary(res.data);
    } catch (err) {
      console.error('Summary fetch failed');
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await deleteExpense(id);
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  const handleFormSuccess = () => {
    setEditingExpense(null);
    fetchExpenses();
    fetchSummary();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💸 Expense Tracker</h1>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <ExpenseForm
            editingExpense={editingExpense}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingExpense(null)}
          />
          {summary && <SummaryPanel summary={summary} />}
          {expenses.length > 0 && <ExpenseChart expenses={expenses} />}
        </div>

        <div className="right-panel">
          <FilterBar filters={filters} setFilters={setFilters} />

          {error && <p className="error-msg">{error}</p>}

          {loading ? (
            <p className="loading-msg">Loading expenses...</p>
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
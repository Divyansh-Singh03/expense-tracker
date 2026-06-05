const exportToCSV = (expenses) => {
  const headers = ['Date', 'Category', 'Note', 'Amount'];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.category,
    e.note || '',
    e.amount,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expenses.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="card empty-state">
        <p>🧾 No expenses found</p>
        <span>Add your first expense using the form!</span>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-header">
        <h2>Expenses ({expenses.length})</h2>
        <button className="btn-secondary" onClick={() => exportToCSV(expenses)}>
          ⬇ Export CSV
        </button>
      </div>
      <div className="table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Note</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{formatDate(expense.date)}</td>
                <td>
                  <span className={`badge badge-${expense.category.toLowerCase()}`}>
                    {expense.category}
                  </span>
                </td>
                <td>{expense.note || '—'}</td>
                <td className="amount">{formatCurrency(expense.amount)}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(expense._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
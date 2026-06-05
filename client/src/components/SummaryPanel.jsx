const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export default function SummaryPanel({ summary }) {
  const { totalThisMonth, perCategory, highest } = summary;

  return (
    <div className="card">
      <h2>This Month's Summary</h2>

      <div className="summary-total">
        <span>Total Spent</span>
        <strong>{formatCurrency(totalThisMonth)}</strong>
      </div>

      <div className="summary-section">
        <h3>By Category</h3>
        {Object.keys(perCategory).length === 0 ? (
          <p className="empty-text">No expenses this month</p>
        ) : (
          <ul className="category-list">
            {Object.entries(perCategory).map(([cat, amount]) => (
              <li key={cat}>
                <span>{cat}</span>
                <span>{formatCurrency(amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {highest?.amount > 0 && (
        <div className="summary-section">
          <h3>Highest Expense</h3>
          <div className="highest-expense">
            <span>{highest.category} — {highest.note || 'No note'}</span>
            <strong>{formatCurrency(highest.amount)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
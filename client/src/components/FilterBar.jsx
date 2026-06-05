const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ category: 'All', startDate: '', endDate: '' });
  };

  const setDateRange = (range) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (range === 'thisMonth') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString().split('T')[0];
      setFilters({ ...filters, startDate: start, endDate: today });
    } else if (range === 'lastMonth') {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString().split('T')[0];
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
        .toISOString().split('T')[0];
      setFilters({ ...filters, startDate: start, endDate: end });
    }
  };

  return (
    <div className="card filter-bar">
      <h2>Filters</h2>

      <div className="filter-row">
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>From</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>To</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn-secondary" onClick={() => setDateRange('thisMonth')}>
          This Month
        </button>
        <button className="btn-secondary" onClick={() => setDateRange('lastMonth')}>
          Last Month
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
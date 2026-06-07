import { useState } from 'react'
import StatusBadge from './StatusBadge'

function TrainingTable({ records, onDelete, onEdit }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const filtered = records.filter(r => {
    const matchSearch =
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      r.moduleName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || r.status === filterStatus
    return matchSearch && matchStatus
  })

  if (records.length === 0) {
    return (
      <div className="table-empty">
        <div className="empty-icon">📋</div>
        <p>No records yet.</p>
        <span>Click "Add Record" to get started.</span>
      </div>
    )
  }

  return (
    <div className="table-section">
      <div className="table-top">
        <h2>Training Records</h2>
        <span className="record-count">{records.length} {records.length === 1 ? 'record' : 'records'}</span>
      </div>

      <div className="filter-row">
        <input
          className="search-input"
          placeholder="Search by name, ID or module..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-buttons">
          {['All', 'Completed', 'In-Progress', 'Pending'].map(s => (
            <button
              key={s}
              className={`filter-btn ${filterStatus === s ? 'filter-btn-active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">No records match your search.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Training Module</th>
                <th>Status</th>
                <th>Certificate</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, index) => (
                <tr key={index} className="table-row">
                  <td>{record.employeeName}</td>
                  <td>{record.employeeId}</td>
                  <td>{record.moduleName}</td>
                  <td><StatusBadge status={record.status} /></td>
                  <td>{record.certificateUpload || '-'}</td>
                  <td>{record.issueDate || '-'}</td>
                  <td>{record.expiryDate || '-'}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="edit-btn"
                        onClick={() => onEdit(records.indexOf(record))}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => onDelete(records.indexOf(record))}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TrainingTable

const style = document.createElement('style')
style.textContent = `
  .table-empty {
    background: white;
    border-radius: 12px;
    padding: 4rem 2rem;
    text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  .table-empty p {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 4px;
  }
  .table-empty span {
    font-size: 13px;
    color: #888;
  }
  .table-section {
    width: 100%;
  }
  .table-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1.25rem;
  }
  .table-top h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a2e;
  }
  .record-count {
    background: #ede9fe;
    color: #5b21b6;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
  }
  .filter-row {
    display: flex;
    gap: 12px;
    margin-bottom: 1.25rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .search-input {
    flex: 1;
    min-width: 200px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    transition: border 0.2s;
  }
  .search-input:focus {
    border-color: #6366f1;
  }
  .filter-buttons {
    display: flex;
    gap: 6px;
  }
  .filter-btn {
    padding: 7px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    color: #444;
  }
  .filter-btn:hover {
    border-color: #6366f1;
    color: #6366f1;
  }
  .filter-btn-active {
    background: #6366f1;
    color: white;
    border-color: #6366f1;
  }
  .no-results {
    text-align: center;
    padding: 2rem;
    color: #888;
    font-size: 14px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .table-wrapper {
    overflow-x: auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  thead tr {
    background: #f8f8fb;
  }
  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #eee;
  }
  td {
    padding: 14px 16px;
    border-bottom: 1px solid #f0f0f0;
    color: #1a1a2e;
  }
  .table-row {
    animation: rowIn 0.3s ease;
  }
  @keyframes rowIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  tbody tr:hover {
    background: #fafafa;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  .action-btns {
    display: flex;
    gap: 6px;
  }
  .edit-btn {
    padding: 5px 12px;
    background: #eef2ff;
    color: #4f46e5;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .edit-btn:hover {
    background: #e0e7ff;
  }
  .delete-btn {
    padding: 5px 12px;
    background: #fee2e2;
    color: #991b1b;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .delete-btn:hover {
    background: #fca5a5;
  }
`
document.head.appendChild(style)
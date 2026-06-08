import { useState } from 'react'
import TrainingForm from './components/TrainingForm'
import TrainingTable from './components/TrainingTable'

function App() {
  const [records, setRecords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  function handleSubmit(record) {
    if (editIndex !== null) {
      setRecords(prev => prev.map((r, i) => i === editIndex ? record : r))
      setEditIndex(null)
    } else {
      setRecords(prev => [...prev, record])
    }
    setShowForm(false)
  }

  function handleDelete(index) {
    setRecords(prev => prev.filter((_, i) => i !== index))
  }

  function handleEdit(index) {
    setEditIndex(index)
    setShowForm(true)
  }

  function handleClose() {
    setShowForm(false)
    setEditIndex(null)
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>Employee Training Tracker</h1>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Record
        </button>
      </div>

      <div className="main-layout">
        <div className="main-left">
          <TrainingTable
            records={records}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>

        {records.length > 0 && (
          <div className="main-right">
            <div className="json-panel">
              <div className="json-panel-header">
                <span>Submitted JSON Data</span>
                <button
                  className="copy-json-btn"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(records, null, 2))}
                >
                  Copy
                </button>
              </div>
              <pre>{JSON.stringify(records, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="overlay" onClick={handleClose}>
          <div className="slidein-panel" onClick={e => e.stopPropagation()}>
            <div className="slidein-header">
              <h2>{editIndex !== null ? 'Edit Record' : 'Add Training Record'}</h2>
              <button className="close-btn" onClick={handleClose}>✕</button>
            </div>
            <TrainingForm
              onSubmit={handleSubmit}
              initialData={editIndex !== null ? records[editIndex] : null}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App

const style = document.createElement('style')
style.textContent = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Segoe UI', sans-serif;
    background: #f4f6f9;
    color: #1a1a2e;
    min-height: 100vh;
  }
  .app {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
  .app-header h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a2e;
  }
  .add-btn {
    padding: 10px 20px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .add-btn:hover {
    background: #4f46e5;
  }
  .main-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 1.5rem;
    align-items: start;
  }
  .main-left {
    min-width: 0;
  }
  .main-right {
    position: sticky;
    top: 1.5rem;
  }
  .json-panel {
    background: #1a1a2e;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  }
  .json-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #2d2d44;
    font-size: 13px;
    font-weight: 600;
    color: #a5b4fc;
  }
  .copy-json-btn {
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .copy-json-btn:hover {
    background: #4f46e5;
  }
  .json-panel pre {
    color: #a5f3fc;
    padding: 16px;
    font-size: 11px;
    overflow-x: auto;
    margin: 0;
    line-height: 1.7;
    max-height: 600px;
    overflow-y: auto;
  }
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    animation: fadeOverlay 0.2s ease;
  }
  @keyframes fadeOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .slidein-panel {
    width: 460px;
    height: 100%;
    background: white;
    padding: 2rem;
    overflow-y: auto;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  .slidein-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .slidein-header h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a2e;
  }
  .close-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #888;
    transition: color 0.2s;
  }
  .close-btn:hover {
    color: #1a1a2e;
  }
  @media (max-width: 900px) {
    .main-layout {
      grid-template-columns: 1fr;
    }
    .main-right {
      position: static;
    }
  }
`
document.head.appendChild(style)
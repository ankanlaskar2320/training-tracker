import { useState, useEffect } from 'react'
import StatusBadge from './StatusBadge'

const initialState = {
  employeeName: '',
  employeeId: '',
  moduleName: '',
  status: '',
  certificateUpload: '',
  issueDate: '',
  expiryDate: '',
}

function TrainingForm({ onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || initialState)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(false)
  const [lastRecord, setLastRecord] = useState(null)

  useEffect(() => {
    setForm(initialData || initialState)
    setErrors({})
    setLastRecord(null)
  }, [initialData])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, certificateUpload: file.name }))
      setErrors(prev => ({ ...prev, certificateUpload: '' }))
    }
  }

  function handleStatusChange(s) {
    setForm(prev => ({
      ...prev,
      status: s,
      expiryDate: s !== 'Completed' ? '' : prev.expiryDate,
      certificateUpload: s !== 'Completed' ? '' : prev.certificateUpload,
    }))
    setErrors(prev => ({ ...prev, status: '', expiryDate: '', certificateUpload: '' }))
  }

  function validate() {
    const newErrors = {}
    const today = new Date().toISOString().split('T')[0]
    if (!form.employeeName.trim()) newErrors.employeeName = 'Required'
    if (!form.employeeId.trim()) newErrors.employeeId = 'Required'
    else if (!/^EMP-\d+$/i.test(form.employeeId.trim())) newErrors.employeeId = 'Format: EMP-123'
    if (!form.moduleName.trim()) newErrors.moduleName = 'Required'
    if (!form.status) newErrors.status = 'Select a status'
    if (!form.issueDate) newErrors.issueDate = 'Required'
    else if (form.issueDate > today) newErrors.issueDate = 'Cannot be a future date'
    if (form.status === 'Completed') {
      if (!form.certificateUpload) newErrors.certificateUpload = 'Certificate is required when completed'
      if (!form.expiryDate) newErrors.expiryDate = 'Required when completed'
      else if (form.expiryDate > today) newErrors.expiryDate = 'Cannot be a future date'
      if (form.issueDate && form.expiryDate && form.expiryDate <= form.issueDate)
        newErrors.expiryDate = 'Must be after issue date'
    }
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    const record = { ...form, submittedAt: new Date().toISOString() }
    onSubmit(record)
    setLastRecord(record)
    setForm(initialState)
    setErrors({})
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const isCompleted = form.status === 'Completed'

  return (
    <div className="form-card">
      {toast && (
        <div className="toast">
          ✅ Record submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label>Employee Name</label>
            <input
              name="employeeName"
              value={form.employeeName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
            />
            {errors.employeeName && <span className="err">{errors.employeeName}</span>}
          </div>

          <div className="form-field">
            <label>Employee ID</label>
            <input
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder="e.g. EMP-402"
            />
            {errors.employeeId && <span className="err">{errors.employeeId}</span>}
          </div>
        </div>

        <div className="form-field">
          <label>Training Module Name</label>
          <input
            name="moduleName"
            value={form.moduleName}
            onChange={handleChange}
            placeholder="e.g. Data Privacy Compliance"
          />
          {errors.moduleName && <span className="err">{errors.moduleName}</span>}
        </div>

        <div className="form-field">
          <label>Status</label>
          <div className="status-buttons">
            {['Completed', 'In-Progress', 'Pending'].map(s => (
              <button
                type="button"
                key={s}
                className={`status-btn ${form.status === s ? 'active-' + s.toLowerCase().replace('-', '') : ''}`}
                onClick={() => handleStatusChange(s)}
              >
                {form.status === s ? <StatusBadge status={s} /> : s}
              </button>
            ))}
          </div>
          {errors.status && <span className="err">{errors.status}</span>}
        </div>

        <div className="form-field">
          <label>
            Certificate Upload
            {isCompleted && <span className="required-star"> *</span>}
          </label>
          <div className="cert-row">
            <input
              name="certificateUpload"
              value={form.certificateUpload}
              onChange={handleChange}
              placeholder={isCompleted ? 'e.g. john_doe_privacy.pdf' : 'Only available when Completed'}
              className="cert-input"
              disabled={!isCompleted}
            />
            <label className={isCompleted ? 'file-btn' : 'file-btn file-btn-disabled'}>
              Browse
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={!isCompleted}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          {errors.certificateUpload && <span className="err">{errors.certificateUpload}</span>}
        </div>

        <div className="form-field">
          <label>Issue Date <span className="required-star">*</span></label>
          <input
            type="date"
            name="issueDate"
            value={form.issueDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.issueDate && <span className="err">{errors.issueDate}</span>}
        </div>

        <div className="form-field">
          <label>
            Expiry Date
            {isCompleted && <span className="required-star"> *</span>}
          </label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            disabled={!isCompleted}
            max={new Date().toISOString().split('T')[0]}
            className={!isCompleted ? 'input-disabled' : ''}
          />
          {errors.expiryDate && <span className="err">{errors.expiryDate}</span>}
        </div>

        <button type="submit" className="submit-btn">
          {initialData ? 'Update Record' : 'Submit Record'}
        </button>
      </form>

      {lastRecord && toast && (
        <div className="json-preview">
          <div className="json-preview-header">
            <span>Submitted JSON</span>
            <button
              className="copy-json-btn"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(lastRecord, null, 2))}
            >
              Copy
            </button>
          </div>
          <pre>{JSON.stringify(lastRecord, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default TrainingForm

const style = document.createElement('style')
style.textContent = `
  .form-card {
    background: transparent;
    padding: 0;
  }
  .toast {
    background: #d1fae5;
    color: #065f46;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 1.5rem;
    border: 1px solid #6ee7b7;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 0.85rem;
  }
  .form-field label {
    font-size: 12px;
    font-weight: 500;
    color: #444;
  }
  .required-star {
    color: #dc2626;
  }
  .form-field input {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    transition: border 0.2s;
    width: 100%;
  }
  .form-field input:focus {
    border-color: #6366f1;
  }
  .input-disabled {
    background: #f4f4f4 !important;
    color: #aaa !important;
    cursor: not-allowed !important;
    border-color: #eee !important;
  }
  .cert-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .cert-input {
    flex: 1;
  }
  .file-btn {
    padding: 8px 14px;
    background: #6366f1;
    color: white;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
  }
  .file-btn:hover {
    background: #4f46e5;
  }
  .file-btn-disabled {
    background: #f4f4f4 !important;
    color: #aaa !important;
    cursor: not-allowed !important;
  }
  .err {
    font-size: 11px;
    color: #dc2626;
  }
  .status-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .status-btn {
    padding: 6px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .status-btn:hover {
    border-color: #6366f1;
    color: #6366f1;
  }
  .submit-btn {
    margin-top: 0.5rem;
    padding: 10px 24px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
  }
  .submit-btn:hover {
    background: #4f46e5;
  }
  .json-preview {
    margin-top: 1.5rem;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0e7ff;
  }
  .json-preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #eef2ff;
    font-size: 12px;
    font-weight: 600;
    color: #4f46e5;
  }
  .copy-json-btn {
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }
  .copy-json-btn:hover {
    background: #4f46e5;
  }
  .json-preview pre {
    background: #1a1a2e;
    color: #a5f3fc;
    padding: 12px;
    font-size: 11px;
    overflow-x: auto;
    margin: 0;
    line-height: 1.6;
  }
`
document.head.appendChild(style)
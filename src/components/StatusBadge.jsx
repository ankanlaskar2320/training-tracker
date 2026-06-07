function StatusBadge({ status }) {
  const key = status.toLowerCase().replace('-', '')

  return (
    <span className={`badge badge-${key}`}>
      {status}
    </span>
  )
}

export default StatusBadge

const style = document.createElement('style')
style.textContent = `
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }
  .badge-completed { background: #d1fae5; color: #065f46; }
  .badge-inprogress { background: #fef3c7; color: #92400e; }
  .badge-pending { background: #fee2e2; color: #991b1b; }
`
document.head.appendChild(style)
export default function ConfirmModal({ title, message, confirmLabel = 'Quitter', onConfirm, onCancel }) {
  return (
    <div className="confirm-backdrop" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>Annuler</button>
          <button className="confirm-ok" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

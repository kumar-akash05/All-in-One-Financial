/** Escape text for safe HTML email output */
function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripControlChars(value) {
  return String(value || '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

module.exports = { escapeHtml, stripControlChars };

const naira = n => n == null ? "—" : new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(n);
const num = n => new Intl.NumberFormat("en-NG").format(n ?? 0);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = d => new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos" }).format(new Date(d)); // DD/MM/YYYY
function toast(text, type = "success") {
  let box = document.getElementById("toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; box.className = "toast-container position-fixed top-0 end-0 p-3"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = "toast align-items-center text-bg-" + (type === "error" ? "danger" : "success") + " border-0";
  el.innerHTML = '<div class="d-flex"><div class="toast-body">' + esc(text) + '</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>';
  box.appendChild(el); new bootstrap.Toast(el, { delay: 4000 }).show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}
const statusBadge = s => s === "out" ? '<span class="badge text-bg-danger">OUT OF STOCK</span>'
  : s === "low" ? '<span class="badge text-bg-warning">LOW STOCK</span>' : '<span class="badge text-bg-success">In stock</span>';
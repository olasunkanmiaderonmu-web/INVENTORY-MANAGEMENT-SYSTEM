// Builds the sidebar and top bar. Owner-only items are hidden from staff.
function renderShell(active, p) {
  const owner = p.role === "owner";
  const items = [
    ["dashboard", "dashboard.html", "speedometer2", "Dashboard"],
    ["products", "products.html", "box-seam", "Products"],
    ["lowstock", "lowstock.html", "exclamation-triangle", "Low stock"],
    ["stockin", "stockin.html", "box-arrow-in-down", "Stock in"],
    ["sales", "sales.html", "cart-check", "Sales"],
    ["history", "history.html", "clock-history", "Stock history"],
    ["adjust", "adjustments.html", "sliders", "Adjustments", 1],
    ["customers", "customers.html", "people", "Customers", 1],
    ["suppliers", "suppliers.html", "truck", "Suppliers", 1],
    ["expenses", "expenses.html", "receipt", "Expenses", 1],
    ["finance", "finance.html", "cash-coin", "Finance", 1],
    ["reports", "reports.html", "file-earmark-bar-graph", "Reports", 1],
    ["staff", "staff.html", "person-badge", "Staff", 1],
    ["audit", "audit.html", "shield-check", "Audit log", 1],
    ["settings", "settings.html", "gear", "Settings", 1]
  ].filter(i => owner || !i[4]);
  document.getElementById("sb").innerHTML =
    '<div class="brand">' + esc(window.APP_CONFIG.STORE_NAME) + "</div>" +
    items.map(i => '<a class="' + (i[0] === active ? "active" : "") + '" href="' + i[1] + '"' + (i[0] === active ? ' aria-current="page"' : "") + '><i class="bi bi-' + i[2] + '"></i>' + i[3] + "</a>").join("") +
    '<a href="#" id="lo"><i class="bi bi-box-arrow-right"></i>Sign out</a>';
  document.getElementById("lo").onclick = e => { e.preventDefault(); logout(); };

  if (window.Chart) Chart.defaults.color = getComputedStyle(document.body).color;

  // Close the menu on small screens when you tap outside it.
  if (!window.__menuClose) {
    window.__menuClose = true;
    document.addEventListener("click", e => {
      const s = document.getElementById("sb");
      if (s.classList.contains("open") && !s.contains(e.target) && !e.target.closest('[aria-label="Open menu"]')) s.classList.remove("open");
    });
  }

  const who = document.getElementById("who");
  if (who) {
    who.textContent = p.full_name + " (" + p.role + ")";
    who.insertAdjacentHTML("afterbegin", '<button id="themeBtn" class="btn btn-sm btn-outline-secondary me-2" aria-label="Switch between light and dark mode"><i class="bi bi-moon-stars"></i></button>');
    document.getElementById("themeBtn").onclick = () => {
      const t = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-bs-theme", t);
      try { localStorage.setItem("theme", t); } catch (e) {}
      if (window.Chart) location.reload();
    };
    db.from("products_status").select("id", { count: "exact", head: true }).eq("is_archived", false).neq("status", "ok").then(({ count }) => {
      if (count) who.insertAdjacentHTML("afterbegin", '<a href="lowstock.html" class="me-3 text-decoration-none" aria-label="' + count + ' products need restocking"><i class="bi bi-bell-fill"></i> <span class="badge text-bg-danger">' + count + "</span></a>");
    });
  }

  // Store name and logo from Settings.
  db.from("business_settings").select("store_name,logo").eq("id", 1).maybeSingle().then(({ data }) => {
    if (!data) return;
    window.APP_CONFIG.STORE_NAME = data.store_name || window.APP_CONFIG.STORE_NAME;
    const b = document.querySelector("#sb .brand");
    if (b) b.innerHTML = (data.logo ? '<img src="' + esc(data.logo) + '" alt="" class="me-2" style="height:32px;width:32px;object-fit:contain;background:#fff;border-radius:6px">' : "") + esc(window.APP_CONFIG.STORE_NAME);
  });
}
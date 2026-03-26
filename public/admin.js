const API = "/api";

// ---------------- LOGIN ----------------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", login);
}

async function login(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!data.success) {
      alert("Login failed");
      return;
    }

    document.querySelector(".admin-login-card").style.display = "none";
    document.getElementById("mainSection").classList.remove("hidden");

    loadAllAdminData();

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// ---------------- LOAD ALL ----------------
async function loadAllAdminData() {
  await loadSummary();
  await loadCustomers();
  await loadPayments();
  await loadRentals();
  await loadVehicles();
}

// ---------------- SUMMARY ----------------
async function loadSummary() {
  try {
    const res = await fetch(`${API}/dashboard/summary`);
    const data = await res.json();

    document.getElementById("stats").innerHTML = `
      <div class="stat-box">Vehicles: ${data.vehicles}</div>
      <div class="stat-box">Customers: ${data.customers}</div>
      <div class="stat-box">Rentals: ${data.rentals}</div>
      <div class="stat-box">Active Rentals: ${data.activeRentals}</div>
      <div class="stat-box">Pending Payments: ${data.unpaidPayments}</div>
    `;
  } catch (err) {
    console.error("Summary error:", err);
  }
}

// ---------------- CUSTOMERS ----------------
async function loadCustomers() {
  const res = await fetch(`${API}/customers`);
  const data = await res.json();

  const tbody = document.querySelector("#customersTable tbody");

  if (!tbody) return;

  tbody.innerHTML = data.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.first_name} ${c.last_name}</td>
      <td>${c.age}</td>
      <td>${c.phone}</td>
      <td>${c.address}</td>
      <td>${c.license_number}</td>
    </tr>
  `).join("");
}

// ---------------- PAYMENTS ----------------
async function loadPayments() {
  const res = await fetch(`${API}/payments`);
  const data = await res.json();

  const tbody = document.querySelector("#paymentsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = data.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.rental_id}</td>
      <td>${p.first_name} ${p.last_name}</td>
      <td>${p.customer_phone}</td>
      <td>${p.vehicle_name}</td>
      <td>₹${p.amount}</td>
      <td>${p.status}</td>
      <td>
        ${p.status === "Pending"
          ? `<button onclick="approvePayment(${p.rental_id})">Approve</button>`
          : "Done"}
      </td>
    </tr>
  `).join("");
}

// ---------------- RENTALS ----------------
async function loadRentals() {
  const res = await fetch(`${API}/rentals`);
  const data = await res.json();

  const tbody = document.querySelector("#rentalsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = data.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.first_name} ${r.last_name}</td>
      <td>${r.vehicle_name}</td>
      <td>${r.pickup_datetime}</td>
      <td>${r.drop_datetime}</td>
      <td>${r.total_hours}</td>
      <td>₹${r.total_cost}</td>
      <td>${r.payment_status}</td>
      <td>${r.rental_status}</td>
      <td>
        ${r.rental_status !== "Completed"
          ? `<button onclick="completeRental(${r.id})">Mark Returned</button>`
          : "Done"}
      </td>
    </tr>
  `).join("");
}

// ---------------- VEHICLES ----------------
async function loadVehicles() {
  const res = await fetch(`${API}/vehicles/all`);
  const data = await res.json();

  const tbody = document.querySelector("#vehiclesTable tbody");
  if (!tbody) return;

  tbody.innerHTML = data.map(v => `
    <tr>
      <td>${v.id}</td>
      <td>${v.vehicle_name}</td>
      <td>${v.model}</td>
      <td>${v.registration_number}</td>
      <td>₹${v.price_per_hour}</td>
      <td>${v.status}</td>
      <td>
        ${v.status === "Not Available"
          ? `<button onclick="makeVehicleAvailable(${v.id})">Make Available</button>`
          : "Already Available"}
      </td>
    </tr>
  `).join("");
}

// ---------------- ACTIONS ----------------
async function approvePayment(rentalId) {
  const res = await fetch(`${API}/rentals/approve-payment/${rentalId}`, {
    method: "PUT"
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadAllAdminData();
}

async function completeRental(rentalId) {
  const res = await fetch(`${API}/rentals/complete/${rentalId}`, {
    method: "PUT"
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadAllAdminData();
}

async function makeVehicleAvailable(vehicleId) {
  const res = await fetch(`${API}/vehicles/make-available/${vehicleId}`, {
    method: "PUT"
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadAllAdminData();
}


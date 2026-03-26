const container = document.getElementById("vehicleCatalog");

// ---------------- LOAD VEHICLES ----------------
async function loadVehicles() {
    try {
        const res = await fetch("/api/vehicles");
        const data = await res.json();

        container.innerHTML = data.map(v => `
            <div class="vehicle-card">
                <h3>${v.name}</h3>
                <p>${v.available} available out of ${v.total}</p>
                <img src="${v.image}" class="vehicle-img" />

                <p>Price: ₹${v.price_per_hour}/hr</p>
                <p>Minimum booking: 24 hrs</p>

                <button 
                    class="book-btn ${v.available > 0 ? 'available' : 'unavailable'}"
                    ${v.available === 0 ? "disabled" : ""}
                    onclick="startBooking(${v.id}, '${v.name}', ${v.price_per_hour})">
                    ${v.available > 0 ? "Book Now" : "Not Available"}
                </button>

            </div>
        `).join("");

    } catch (err) {
        console.error("Error loading vehicles:", err);
    }
}

// ---------------- START BOOKING ----------------
function startBooking(vehicleId, vehicleName, price) {
    const section = document.getElementById("bookingSection");
    section.classList.remove("hidden");

    section.scrollIntoView({ behavior: "smooth" });

    document.getElementById("selectedVehicleName").value = vehicleName;
    document.getElementById("bookingTitle").innerText = "Book " + vehicleName;

    window.selectedVehicle = {
        id: vehicleId,
        name: vehicleName,
        price: price
    };
}

// ---------------- PREVIEW ----------------
document.getElementById("previewForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const pickupDate = document.getElementById("pickupDate").value;
    const pickupTime = document.getElementById("pickupTime").value;
    const dropDate = document.getElementById("dropDate").value;
    const dropTime = document.getElementById("dropTime").value;

    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const drop = new Date(`${dropDate}T${dropTime}`);

    // validation
    if (drop <= pickup) {
        alert("Drop date/time must be after pickup");
        return;
    }

    const hours = Math.ceil((drop - pickup) / (1000 * 60 * 60));
    if (hours < 24) {
        alert("Minimum booking is 24 hours");
        return;
    }
    const total = window.selectedVehicle.price * hours;

    document.getElementById("previewBox").classList.remove("hidden");

    document.getElementById("summaryVehicle").innerText =
        "Vehicle: " + window.selectedVehicle.name;

    document.getElementById("summaryHours").innerText =
        "Total Hours: " + hours;

    document.getElementById("summaryPrice").innerText =
        "Total Cost: ₹" + total;

    window.bookingData = {
        vehicle_id: window.selectedVehicle.id,
        pickup_datetime: pickup.toISOString(),
        drop_datetime: drop.toISOString(),
        total_cost: total
    };
});

// ---------------- FINAL BOOKING ----------------
document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const age = parseInt(document.getElementById("bookAge").value);

    if (age < 18) {
        alert("Customer must be at least 18 years old");
        return;
    }

    const data = {
        first_name: document.getElementById("bookFirstName").value,
        last_name: document.getElementById("bookLastName").value,
        age: age,
        phone: document.getElementById("bookPhone").value,
        address: document.getElementById("bookAddress").value,
        license_number: document.getElementById("bookLicenseNumber").value,
        ...window.bookingData
    };

    fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        alert("Booking Confirmed!");
        location.reload();
    })
    .catch(err => console.error(err));
});

// ---------------- DATE LIMITS ----------------
function setDateLimits() {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);

    const format = d => d.toISOString().split("T")[0];

    document.getElementById("pickupDate").min = format(today);
    document.getElementById("pickupDate").max = format(maxDate);

    document.getElementById("dropDate").min = format(today);
    document.getElementById("dropDate").max = format(maxDate);
}

// ---------------- TIME DROPDOWN ----------------
function populateTimeOptions() {
    const pickup = document.getElementById("pickupTime");
    const drop = document.getElementById("dropTime");

    pickup.innerHTML = "";
    drop.innerHTML = "";

    for (let hour = 9; hour <= 22; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;

        pickup.add(new Option(time, time));
        drop.add(new Option(time, time));
    }
}

// ---------------- INIT ----------------
window.onload = () => {
    loadVehicles();
    setDateLimits();
    populateTimeOptions();
};
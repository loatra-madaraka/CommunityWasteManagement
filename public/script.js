
const reportForm = document.getElementById("reportForm");
const reportsList = document.getElementById("reportsList");
const message = document.getElementById("message");

// Submit a new waste report
reportForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const report = {
        residentName: document.getElementById("residentName").value,
        location: document.getElementById("location").value,
        wasteType: document.getElementById("wasteType").value
    };

    try {
        const response = await fetch("/api/reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(report)
        });

        if (!response.ok) {
            throw new Error("Could not submit report");
        }

        message.textContent = "Report submitted successfully!";
        reportForm.reset();
        loadReports();

    } catch (error) {
        message.textContent = "Error submitting report.";
        console.error(error);
    }
});

// Display all waste reports
async function loadReports() {
    try {
        const response = await fetch("/api/reports");

        if (!response.ok) {
            throw new Error("Could not load reports");
        }

        const reports = await response.json();

        reportsList.innerHTML = "";

        if (reports.length === 0) {
            reportsList.textContent = "No waste reports available yet.";
            return;
        }

        reports.forEach(report => {
            const card = document.createElement("div");
            card.className = "report-card";

            const details = document.createElement("p");
            details.textContent =
                `Resident: ${report.residentName} | Location: ${report.location} | Waste: ${report.wasteType} | Status: ${report.status}`;

            const updateButton = document.createElement("button");
            updateButton.textContent = "Mark as Collected";
            updateButton.addEventListener("click", () => updateReport(report._id));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteReport(report._id));

            card.append(details, updateButton, deleteButton);
            reportsList.appendChild(card);
        });

    } catch (error) {
        reportsList.textContent = "Unable to load reports.";
        console.error(error);
    }
}

// Update report status
async function updateReport(id) {
    try {
        const response = await fetch(`/api/reports/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "Collected" })
        });

        if (!response.ok) {
            throw new Error("Could not update report");
        }

        loadReports();

    } catch (error) {
        alert("Unable to update report.");
        console.error(error);
    }
}

// Delete a report
async function deleteReport(id) {
    if (!confirm("Are you sure you want to delete this report?")) {
        return;
    }

    try {
        const response = await fetch(`/api/reports/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Could not delete report");
        }

        loadReports();

    } catch (error) {
        alert("Unable to delete report.");
        console.error(error);
    }
}

// Load reports when the page opens
loadReports();

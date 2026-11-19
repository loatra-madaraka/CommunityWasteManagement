
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new MongoClient(process.env.MONGO_URI);

let reports;

async function startServer() {
    try {
        await client.connect();

        const database = client.db("communityDB");
        reports = database.collection("wasteReports");

        console.log("Connected to MongoDB Atlas!");

        app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});sss

    } catch (error) {
        console.error("Connection failed:", error.message);
    }
}

// Add a waste report
app.post("/api/reports", async (req, res) => {
    try {
        const report = {
            reportId: Date.now().toString(),
            residentName: req.body.residentName,
            location: req.body.location,
            wasteType: req.body.wasteType,
            dateReported: new Date(),
            status: "Pending"
        };

        const result = await reports.insertOne(report);
        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// View all waste reports
app.get("/api/reports", async (req, res) => {
    try {
        const allReports = await reports.find().toArray();
        res.json(allReports);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a report's status
app.patch("/api/reports/:id", async (req, res) => {
    try {
        const result = await reports.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status: req.body.status } }
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a waste report
app.delete("/api/reports/:id", async (req, res) => {
    try {
        const result = await reports.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

startServer();

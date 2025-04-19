const pool = require("../database/db");
const fs = require("fs");
const path = require("path");


exports.uploadMedia = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId, 10);
        if (!tripId || isNaN(tripId)) {
            return res.status(400).json({ status: "error", message: "Invalid trip ID" });
        }

        if (!req.file) {
            return res.status(400).json({ status: "error", message: "No file uploaded" });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        // const fileType = req.file.mimetype.split("/")[0]; 
        const fileType = req.body.file_type;

        const result = await pool.query(
            `INSERT INTO media (trip_id, file_type, file_url) VALUES ($1, $2, $3) RETURNING *`,
            [tripId, fileType, fileUrl]
        );

        res.status(201).json({
            status: "success",
            media: result.rows[0],
            message: "File uploaded successfully"
        });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

exports.getMediaByTrip = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId, 10);
        if (!tripId || isNaN(tripId)) {
            return res.status(400).json({ status: "error", message: "Invalid trip ID" });
        }

        const result = await pool.query(
            `SELECT media_id, file_type, file_url, uploaded_at FROM media WHERE trip_id = $1`,
            [tripId]
        );

        res.status(200).json({
            status: "success",
            media: result.rows
        });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};
exports.deleteMedia = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId, 10);
        const { file_url } = req.query;

        // if (!tripId || isNaN(tripId) || !mediaId || isNaN(mediaId)) {
        //     return res.status(400).json({ status: "error", message: "Invalid trip ID or media ID" });
        // }
        // const mediaResult = await pool.query(
        //     `SELECT file_url FROM media WHERE media_id = $1 AND trip_id = $2`,
        //     [mediaId, tripId]
        // );

        // if (mediaResult.rows.length === 0) {
        //     return res.status(404).json({ status: "error", message: "Media not found" });
        // }

        // const filePath = path.join(__dirname, "..", mediaResult.rows[0].file_url);

        await pool.query(`DELETE FROM media WHERE file_url = $1 AND trip_id = $2`, [file_url, tripId]);

        // fs.unlink(filePath, (err) => {
        //     if (err) console.error("Error deleting file:", err);
        // });

        res.status(200).json({ status: "success", message: "Media deleted successfully" });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

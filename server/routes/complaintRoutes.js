const express = require("express");

const router = express.Router();

const {
  createComplaint,
  getMyComplaints,
  assignComplaint,
  deleteMyComplaint,
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");

// Submit a complaint
router.post("/", protect, createComplaint);

// Get logged-in user's complaints
router.get("/my", protect, getMyComplaints);

// Assign complaint to agent
router.put("/:id/assign", protect, assignComplaint);

// Delete own pending complaint
router.delete("/:id", protect, deleteMyComplaint);

module.exports = router;
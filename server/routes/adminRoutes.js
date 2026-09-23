const express = require("express");

const router = express.Router();

const {
  getAllComplaints,
  updateComplaint,
  getAgentComplaints,
  agentUpdateComplaint,
  getAllAgents,
  deleteComplaint,
  createAgent,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
  agentOnly,
} = require("../middleware/authMiddleware");

// Admin routes

router.get(
  "/complaints",
  protect,
  adminOnly,
  getAllComplaints
);

router.put(
  "/complaints/:id",
  protect,
  adminOnly,
  updateComplaint
);

// Get all agents
router.get(
  "/agents",
  protect,
  adminOnly,
  getAllAgents
);
router.post(
  "/agents",
  protect,
  adminOnly,
  createAgent
);


// Agent routes

router.get(
  "/agent/complaints",
  protect,
  agentOnly,
  getAgentComplaints
);

router.put(
  "/agent/complaints/:id",
  protect,
  agentOnly,
  agentUpdateComplaint
);

// Admin can delete any complaint
router.delete(
  "/complaints/:id",
  protect,
  adminOnly,
  deleteComplaint
);

module.exports = router;
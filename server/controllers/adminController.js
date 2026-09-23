const Complaint = require("../models/Complaint");
const User = require("../models/User");

// Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update complaint status and priority
const updateComplaint = async (req, res) => {
  try {
    const { status, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (status) {
      complaint.status = status;
    }

    if (priority) {
      complaint.priority = priority;
    }

    await complaint.save();

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get complaints assigned to logged-in agent
const getAgentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedAgent: req.user.id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Agent updates complaint
const agentUpdateComplaint = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (status) {
      complaint.status = status;
    }

    await complaint.save();

    res.json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await User.find(
      { role: "agent" },
      "name email"
    );

    res.json({
      count: agents.length,
      agents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================================
// DELETE ANY COMPLAINT - ADMIN
// =========================================

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      message: "Complaint deleted successfully by admin",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Create new agent
const createAgent = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const bcrypt = require("bcryptjs");

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "agent",
    });

    res.status(201).json({
      message: "Agent created successfully",
      agent: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }

};

module.exports = {
  getAllComplaints,
  updateComplaint,
  getAgentComplaints,
  agentUpdateComplaint,
  getAllAgents,
  deleteComplaint,
  createAgent,
};
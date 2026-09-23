const Complaint = require("../models/Complaint");

// Create Complaint
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      priority,
      forceSubmit,
    } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // =========================================
    // SMART DUPLICATE COMPLAINT CHECK
    // =========================================

    // Find active complaints with the same category
    const existingComplaints = await Complaint.find({
      category: category,
      status: { $in: ["Pending", "In Progress"] },
    }).sort({ createdAt: -1 });

    // Convert location and description into lowercase words
    const newLocation = location.trim().toLowerCase();

    const newDescriptionWords = description
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3);

    let similarComplaint = null;

    for (const existing of existingComplaints) {
      const existingLocation = existing.location
        .trim()
        .toLowerCase();

      // Check location similarity
      const locationMatches =
        existingLocation.includes(newLocation) ||
        newLocation.includes(existingLocation);

      if (!locationMatches) {
        continue;
      }

      // Check description similarity
      const existingDescriptionWords = existing.description
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3);

      const matchingWords = newDescriptionWords.filter((word) =>
        existingDescriptionWords.includes(word)
      );

      const similarity =
        newDescriptionWords.length > 0
          ? matchingWords.length / newDescriptionWords.length
          : 0;

      // Consider it similar if at least 30% of important words match
      if (similarity >= 0.3) {
        similarComplaint = existing;
        break;
      }
    }

    // If similar complaint exists, return warning
    // unless user has explicitly chosen "Submit Anyway"
    if (similarComplaint && !forceSubmit) {
      return res.status(409).json({
        duplicate: true,
        message: "A similar complaint already exists.",
        complaint: {
          id: similarComplaint._id,
          title: similarComplaint.title,
          description: similarComplaint.description,
          category: similarComplaint.category,
          location: similarComplaint.location,
          status: similarComplaint.status,
          priority: similarComplaint.priority,
        },
      });
    }

    // =========================================
    // CREATE NEW COMPLAINT
    // =========================================

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      priority: priority || "Medium",
      user: req.user.id,
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get My Complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

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

// Assign Complaint to Agent
const assignComplaint = async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({
        message: "Agent ID is required",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: agentId },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json({
      message: "Complaint assigned successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete My Complaint

const deleteMyComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    // Complaint does not exist
    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    // Check if complaint belongs to logged-in citizen
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own complaint",
      });
    }

    // Only Pending complaints can be deleted
    if (complaint.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending complaints can be deleted",
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  assignComplaint,
  deleteMyComplaint,
};
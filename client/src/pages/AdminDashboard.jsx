import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agentsLoading, setAgentsLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    fetchComplaints();
    fetchAgents();
  }, []);

  // Get all complaints
  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setComplaints(data.complaints);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // Get all agents
  const fetchAgents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/agents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setAgents(data.agents);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch agents.");
    } finally {
      setAgentsLoading(false);
    }
  };

  // Create new agent
  const createAgent = async (name, email, password) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/agents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return false;
      }

      setAgents((previous) => [
        ...previous,
        data.agent,
      ]);

      alert("Agent created successfully!");

      return true;
    } catch (error) {
      console.error(error);
      alert("Unable to create agent.");
      return false;
    }
  };

  // Update complaint status and priority
  const updateComplaint = async (id, status, priority) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            priority,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint._id === id
            ? data.complaint
            : complaint
        )
      );
    } catch (error) {
      console.error(error);
      alert("Unable to update complaint.");
    }
  };

  // Assign complaint to agent
  const assignComplaint = async (complaintId, agentId) => {
    if (!agentId) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${complaintId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            agentId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint._id === complaintId
            ? data.complaint
            : complaint
        )
      );

      alert("Complaint assigned successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to assign complaint.");
    }
  };

  // DELETE COMPLAINT - ADMIN
  const deleteComplaint = async (complaintId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/complaints/${complaintId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setComplaints((previous) =>
        previous.filter(
          (complaint) =>
            complaint._id !== complaintId
        )
      );

      alert("Complaint deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to delete complaint.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const total = complaints.length;

  const pending = complaints.filter(
    (complaint) =>
      complaint.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) =>
      complaint.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (complaint) =>
      complaint.status === "Resolved"
  ).length;

  return (
    <div className="admin-page">

      {/* Navbar */}
      <nav className="admin-navbar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            🏛️
          </div>

          <div>
            <h2>CivicCare</h2>
            <span>Administration Portal</span>
          </div>

        </div>

        <div className="admin-nav-right">

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="admin-logout"
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Main Content */}
      <main className="admin-content">

        <div className="admin-welcome">

          <div>

            <span className="admin-label">
              ADMINISTRATION
            </span>

            <h1>Dashboard</h1>

            <p>
              Monitor and manage civic complaints submitted by citizens.
            </p>

          </div>

        </div>

        {/* Statistics */}
        <div className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              📋
            </div>

            <div>
              <span>Total Complaints</span>
              <strong>{total}</strong>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>{pending}</strong>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🔄
            </div>

            <div>
              <span>In Progress</span>
              <strong>{inProgress}</strong>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ✓
            </div>

            <div>
              <span>Resolved</span>
              <strong>{resolved}</strong>
            </div>

          </div>

        </div>

        {/* Agent Management */}
        <section className="admin-agents">

          <div className="admin-section-header">

            <div>

              <h2>Agent Management</h2>

              <p>
                Create and manage complaint agents.
              </p>

            </div>

            <button
              onClick={() =>
                setShowAgentForm(!showAgentForm)
              }
              className="admin-add-agent-btn"
            >
              {showAgentForm
                ? "Cancel"
                : "+ Add Agent"}
            </button>

          </div>

          {showAgentForm && (

            <div className="admin-agent-form">

              <input
                type="text"
                placeholder="Agent Name"
                id="agentName"
              />

              <input
                type="email"
                placeholder="Agent Email"
                id="agentEmail"
              />

              <input
                type="password"
                placeholder="Agent Password"
                id="agentPassword"
              />

              <button
                onClick={async () => {

                  const name =
                    document.getElementById(
                      "agentName"
                    ).value;

                  const email =
                    document.getElementById(
                      "agentEmail"
                    ).value;

                  const password =
                    document.getElementById(
                      "agentPassword"
                    ).value;

                  if (
                    !name ||
                    !email ||
                    !password
                  ) {
                    alert(
                      "Please fill all fields."
                    );
                    return;
                  }

                  const success =
                    await createAgent(
                      name,
                      email,
                      password
                    );

                  if (success) {

                    document.getElementById(
                      "agentName"
                    ).value = "";

                    document.getElementById(
                      "agentEmail"
                    ).value = "";

                    document.getElementById(
                      "agentPassword"
                    ).value = "";

                    setShowAgentForm(false);
                  }

                }}
                className="admin-create-agent-btn"
              >
                Create Agent
              </button>

            </div>

          )}

        </section>

{agents.length > 0 && (
  <div className="admin-agent-list">
    <h3>Registered Agents</h3>

    <div className="agent-cards">
      {agents.map((agent) => (
        <div className="agent-card" key={agent._id}>
          <div className="agent-card-icon">
            👤
          </div>

          <div className="agent-card-info">
            <strong>{agent.name}</strong>
            <span>{agent.email}</span>
            <small>Complaint Agent</small>
          </div>

          <div className="agent-status">
            Active
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {/* Complaints */}
        <section className="admin-complaints">

          <div className="admin-section-header">

            <div>

              <h2>All Complaints</h2>

              <p>
                Review and manage citizen complaints.
              </p>

            </div>

            <span className="complaint-count">
              {total} Complaints
            </span>

          </div>

          {loading ? (

            <div className="admin-loading">
              Loading complaints...
            </div>

          ) : complaints.length === 0 ? (

            <div className="admin-empty">

              <div>📭</div>

              <h3>No complaints found</h3>

              <p>
                There are currently no citizen complaints.
              </p>

            </div>

          ) : (

            <div className="admin-complaint-list">

              {complaints.map((complaint) => (

                <div
                  className="admin-complaint"
                  key={complaint._id}
                >

                  <div className="admin-complaint-main">

                    <div className="complaint-title-row">

                      <div>

                        <span className="complaint-category">
                          {complaint.category}
                        </span>

                        <h3>
                          {complaint.title}
                        </h3>

                      </div>

                      <span
                        className={`admin-status status-${complaint.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {complaint.status}
                      </span>

                    </div>

                    <p className="admin-description">
                      {complaint.description}
                    </p>

                    <div className="admin-meta">

                      <span>
                        📍 {complaint.location}
                      </span>

                      <span>
                        👤{" "}
                        {complaint.user?.name ||
                          "Unknown Citizen"}
                      </span>

                      <span>
                        ✉️{" "}
                        {complaint.user?.email ||
                          "No email"}
                      </span>

                    </div>

                  </div>

                  {/* Controls */}
                  <div className="admin-controls">

                    <div className="admin-control">

                      <label>Status</label>

                      <select
                        value={complaint.status}
                        onChange={(e) =>
                          updateComplaint(
                            complaint._id,
                            e.target.value,
                            complaint.priority
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>

                      </select>

                    </div>

                    <div className="admin-control">

                      <label>Priority</label>

                      <select
                        value={complaint.priority}
                        onChange={(e) =>
                          updateComplaint(
                            complaint._id,
                            complaint.status,
                            e.target.value
                          )
                        }
                      >

                        <option value="Low">
                          Low
                        </option>

                        <option value="Medium">
                          Medium
                        </option>

                        <option value="High">
                          High
                        </option>

                      </select>

                    </div>

                    {/* Assign Agent */}
                    <div className="admin-control">

                      <label>Assign Agent</label>

                      <select
                        value={
                          complaint.assignedAgent?._id ||
                          complaint.assignedAgent ||
                          ""
                        }
                        onChange={(e) =>
                          assignComplaint(
                            complaint._id,
                            e.target.value
                          )
                        }
                        disabled={agentsLoading}
                      >

                        <option value="">
                          {agentsLoading
                            ? "Loading agents..."
                            : "Select Agent"}
                        </option>

                        {agents.map((agent) => (

                          <option
                            key={agent._id}
                            value={agent._id}
                          >
                            {agent.name}
                          </option>

                        ))}

                      </select>

                    </div>

                  </div>

                  <div className="admin-complaint-footer">

                    <span>
                      Complaint ID: {complaint._id}
                    </span>

                    <span>
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString()}
                    </span>

                    {/* Admin Delete */}
                    <button
                      onClick={() =>
                        deleteComplaint(
                          complaint._id
                        )
                      }
                      className="admin-delete-btn"
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
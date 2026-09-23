import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AgentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !user || user.role !== "agent") {
      navigate("/login");
      return;
    }

    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/agent/complaints",
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

  const updateComplaint = async (id, status) => {
    try {
      const complaint = complaints.find((item) => item._id === id);

      const response = await fetch(
        `http://localhost:5000/api/admin/agent/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            priority: complaint.priority,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setComplaints((previous) =>
        previous.map((item) =>
          item._id === id ? data.complaint : item
        )
      );
    } catch (error) {
      console.error(error);
      alert("Unable to update complaint.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const total = complaints.length;

  const pending = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  return (
    <div className="admin-page agent-page">
      <nav className="admin-navbar agent-navbar">
        <div className="admin-brand">
          <div className="admin-brand-icon">🛠️</div>

          <div>
            <h2>CivicCare</h2>
            <span>Agent Portal</span>
          </div>
        </div>

        <div className="admin-nav-right">
          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <div>
              <strong>{user?.name || "Agent"}</strong>
              <span>Complaint Agent</span>
            </div>
          </div>

          <button onClick={handleLogout} className="admin-logout">
            Logout
          </button>
        </div>
      </nav>

      <main className="admin-content">
        <div className="admin-welcome agent-welcome">
          <span className="admin-label">AGENT PORTAL</span>

          <h1>Complaint Management</h1>

          <p>
            Review citizen complaints and update their progress.
          </p>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📋</div>

            <div>
              <span>Total Complaints</span>
              <strong>{total}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">⏳</div>

            <div>
              <span>Pending</span>
              <strong>{pending}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🔄</div>

            <div>
              <span>In Progress</span>
              <strong>{inProgress}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">✓</div>

            <div>
              <span>Resolved</span>
              <strong>{resolved}</strong>
            </div>
          </div>
        </div>

        <section className="admin-complaints">
          <div className="admin-section-header">
            <div>
             <h2>My Assigned Complaints</h2>

              <p>
                Review complaints and update their status.
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
                  className="admin-complaint agent-complaint-card"
                  key={complaint._id}
                >
                  <div className="admin-complaint-main">
                    <div className="complaint-title-row">
                      <div>
  <span className="agent-assigned-label">
    ASSIGNED TO YOU
  </span>

  <span className="complaint-category">
    {complaint.category}
  </span>

  <h3>{complaint.title}</h3>
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

                  <div className="admin-controls agent-controls">
                    <div className="admin-control agent-status-control">
                      <label>Update Status</label>

                      <select
                        value={complaint.status}
                        onChange={(e) =>
                          updateComplaint(
                            complaint._id,
                            e.target.value
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

export default AgentDashboard;
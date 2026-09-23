import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints/my",
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

  // =========================================
  // DELETE COMPLAINT
  // =========================================

  const handleDelete = async (complaintId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${complaintId}`,
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

      // Remove deleted complaint from screen
      setComplaints((prevComplaints) =>
        prevComplaints.filter(
          (complaint) => complaint._id !== complaintId
        )
      );

      alert("Complaint deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* Navbar */}

      <nav className="dashboard-navbar">

        <div className="logo">
          🏛️ CivicCare
        </div>

        <div className="dashboard-nav-right">

          <span>Welcome, {user?.name}</span>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Main Content */}

      <main className="dashboard-content">

        <div className="dashboard-header">

          <div>

            <h1>Citizen Dashboard</h1>

            <p>
              Manage and track your civic complaints.
            </p>

          </div>

          <Link
            to="/complaint"
            className="primary-btn"
          >
            + New Complaint
          </Link>

        </div>

        {/* Stats */}

        <div className="dashboard-stats">

          <div className="stat-card">

            <span>Total Complaints</span>

            <strong>
              {complaints.length}
            </strong>

          </div>

          <div className="stat-card">

            <span>Pending</span>

            <strong>
              {
                complaints.filter(
                  (c) => c.status === "Pending"
                ).length
              }
            </strong>

          </div>

          <div className="stat-card">

            <span>In Progress</span>

            <strong>
              {
                complaints.filter(
                  (c) => c.status === "In Progress"
                ).length
              }
            </strong>

          </div>

          <div className="stat-card">

            <span>Resolved</span>

            <strong>
              {
                complaints.filter(
                  (c) => c.status === "Resolved"
                ).length
              }
            </strong>

          </div>

        </div>

        {/* Complaints */}

        <section className="complaints-section">

          <h2>My Complaints</h2>

          {loading ? (

            <p>Loading complaints...</p>

          ) : complaints.length === 0 ? (

            <div className="empty-state">

              <h3>No complaints yet</h3>

              <p>
                You haven't submitted any civic complaints.
              </p>

              <Link
                to="/complaint"
                className="primary-btn"
              >
                Submit Your First Complaint
              </Link>

            </div>

          ) : (

            <div className="complaints-list">

              {complaints.map((complaint) => (

                <div
  className="complaint-card"
  key={complaint._id}
>
  <div className="complaint-top">

    <div>
      <h3>
        {complaint.title}
      </h3>

      <p>
        {complaint.description}
      </p>
    </div>

    <span
      className={`status status-${complaint.status
        .toLowerCase()
        .replace(" ", "-")}`}
    >
      {complaint.status}
    </span>

  </div>


  <div className="complaint-details">

    <span>
      📂 {complaint.category}
    </span>

    <span>
      📍 {complaint.location}
    </span>

    <span>
      ⚡ {complaint.priority}
    </span>

  </div>


  {/* Complaint Status Timeline */}

  <div className="complaint-timeline">

    <div
      className={`timeline-step ${
        ["Pending", "In Progress", "Resolved"].includes(
          complaint.status
        )
          ? "completed"
          : ""
      }`}
    >
      <div className="timeline-dot">
        {["Pending", "In Progress", "Resolved"].includes(
          complaint.status
        )
          ? "✓"
          : "1"}
      </div>

      <span>Complaint Submitted</span>
    </div>


    <div
      className={`timeline-step ${
        ["Pending", "In Progress", "Resolved"].includes(
          complaint.status
        )
          ? "completed"
          : ""
      }`}
    >
      <div className="timeline-dot">
        {["Pending", "In Progress", "Resolved"].includes(
          complaint.status
        )
          ? "✓"
          : "2"}
      </div>

      <span>Pending</span>
    </div>


    <div
      className={`timeline-step ${
        ["In Progress", "Resolved"].includes(
          complaint.status
        )
          ? "completed"
          : ""
      }`}
    >
      <div className="timeline-dot">
        {["In Progress", "Resolved"].includes(
          complaint.status
        )
          ? "✓"
          : "3"}
      </div>

      <span>In Progress</span>
    </div>


    <div
      className={`timeline-step ${
        complaint.status === "Resolved"
          ? "completed"
          : ""
      }`}
    >
      <div className="timeline-dot">
        {complaint.status === "Resolved"
          ? "✓"
          : "4"}
      </div>

      <span>Resolved</span>
    </div>

  </div>


  <div className="complaint-bottom">

    <small>
      Complaint ID: {complaint._id}
    </small>

    {/* Delete only for Pending complaints */}

    {complaint.status === "Pending" && (
      <button
        onClick={() =>
          handleDelete(complaint._id)
        }
        className="delete-complaint-btn"
      >
        🗑 Delete
      </button>
    )}

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

export default Dashboard;
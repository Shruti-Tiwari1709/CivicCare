import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Complaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);

  // Duplicate complaint state
  const [duplicateComplaint, setDuplicateComplaint] = useState(null);
  const [showDuplicate, setShowDuplicate] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e, forceSubmit = false) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            category,
            location,
            priority,
            forceSubmit,
          }),
        }
      );

      const data = await response.json();

      // Similar complaint found
      if (response.status === 409 && data.duplicate) {
        setDuplicateComplaint(data.complaint);
        setShowDuplicate(true);
        return;
      }

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Complaint submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnyway = async () => {
    setShowDuplicate(false);
    setDuplicateComplaint(null);

    await handleSubmit(
      {
        preventDefault: () => {},
      },
      true
    );
  };

  const handleCancelDuplicate = () => {
    setShowDuplicate(false);
    setDuplicateComplaint(null);
  };

  return (
    <div className="complaint-page">
      <div className="complaint-background-glow glow-one"></div>
      <div className="complaint-background-glow glow-two"></div>

      <div className="complaint-card">
        <div className="complaint-card-header">
          <Link to="/dashboard" className="complaint-back-link">
            ← Dashboard
          </Link>

          <div className="complaint-brand">
            <div className="complaint-brand-icon">C</div>

            <div>
              <div className="complaint-brand-name">CivicCare</div>
              <div className="complaint-brand-subtitle">
                SMART CIVIC SERVICES
              </div>
            </div>
          </div>

          <div className="complaint-heading">
            <span className="complaint-label">
              REPORT A CIVIC ISSUE
            </span>

            <h1>Submit a Complaint</h1>

            <p>
              Tell us about the issue and provide the details
              needed to help get it resolved.
            </p>
          </div>
        </div>

        <form
          className="complaint-form"
          onSubmit={(e) => handleSubmit(e, false)}
        >
          <div className="complaint-form-section">
            <div className="form-section-title">
              <span>01</span>

              <div>
                <h2>Issue Details</h2>
                <p>What problem would you like to report?</p>
              </div>
            </div>

            <div className="form-group">
              <label>Complaint Title</label>

              <input
                type="text"
                placeholder="Example: Pothole on Main Road"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                placeholder="Describe the problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="complaint-form-section">
            <div className="form-section-title">
              <span>02</span>

              <div>
                <h2>Issue Information</h2>
                <p>
                  Help us understand where and what the issue is.
                </p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Road">Road</option>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Street Light">
                    Street Light
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                placeholder="Enter complaint location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="complaint-submit-area">
            <div className="submit-note">
              <span>✓</span>

              <p>
                Your complaint will be securely registered and
                can be tracked from your dashboard.
              </p>
            </div>

            <button
              type="submit"
              className="complaint-submit-btn"
              disabled={loading}
            >
              {loading ? "Checking..." : "Submit Complaint"}

              {!loading && <span>→</span>}
            </button>
          </div>
        </form>

        <div className="complaint-footer">
          CivicCare • Making civic reporting simpler and more transparent.
        </div>
      </div>

      {/* =========================================
          DUPLICATE COMPLAINT MODAL
      ========================================= */}

      {showDuplicate && duplicateComplaint && (
        <div className="duplicate-overlay">
          <div className="duplicate-modal">
            <div className="duplicate-icon">!</div>

            <span className="duplicate-label">
              SIMILAR COMPLAINT FOUND
            </span>

            <h2>We found a similar complaint</h2>

            <p className="duplicate-message">
              A similar active complaint has already been
              reported for this issue and location.
            </p>

            <div className="duplicate-existing">
              <div className="duplicate-existing-top">
                <span>{duplicateComplaint.category}</span>

                <strong className={`status status-${duplicateComplaint.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}>
                  {duplicateComplaint.status}
                </strong>
              </div>

              <h3>{duplicateComplaint.title}</h3>

              <p>{duplicateComplaint.description}</p>

              <div className="duplicate-location">
                📍 {duplicateComplaint.location}
              </div>
            </div>

            <p className="duplicate-question">
              Is this a different issue?
            </p>

            <div className="duplicate-actions">
              <button
                type="button"
                className="duplicate-cancel-btn"
                onClick={handleCancelDuplicate}
              >
                Go Back
              </button>

              <button
                type="button"
                className="duplicate-submit-btn"
                onClick={handleSubmitAnyway}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Anyway"}
                {!loading && <span>→</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Complaint;
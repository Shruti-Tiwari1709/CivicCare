import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Complaint from "./pages/Complaint";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";

import "./App.css";

function Home() {
  return (
    <div className="premium-home">

      {/* ================= NAVBAR ================= */}

      <nav className="premium-navbar">
        <Link to="/" className="premium-logo">
          <div className="logo-mark">C</div>

          <div>
            <div className="logo-name">CivicCare</div>
            <div className="logo-subtitle">SMART CIVIC SERVICES</div>
          </div>
        </Link>

        <div className="premium-nav-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>

          <Link to="/login" className="premium-login">
            Login
            <span>→</span>
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="premium-hero">

        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>

        <div className="hero-grid">

          {/* LEFT SIDE */}

          <div className="premium-hero-content">

            <div className="premium-badge">
              <span className="badge-dot"></span>
              SMART CIVIC COMPLAINT PLATFORM
            </div>

            <h1>
              Better Cities
              <br />
              <span>Start With You.</span>
            </h1>

            <p className="premium-hero-text">
              Report civic problems, track their progress and
              stay connected with the people working to make
              your city better.
            </p>

            <div className="premium-hero-buttons">

              <Link to="/register" className="premium-primary-btn">
                Report an Issue
                <span>→</span>
              </Link>

              <Link to="/login" className="premium-secondary-btn">
                Track Complaint
              </Link>

            </div>

            <div className="hero-trust">

              <div className="trust-item">
                <strong>24/7</strong>
                <span>Accessible</span>
              </div>

              <div className="trust-line"></div>

              <div className="trust-item">
                <strong>100%</strong>
                <span>Trackable</span>
              </div>

              <div className="trust-line"></div>

              <div className="trust-item">
                <strong>1</strong>
                <span>Connected Platform</span>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="premium-visual">

            <div className="visual-orbit orbit-one"></div>
            <div className="visual-orbit orbit-two"></div>

            <div className="city-glow"></div>

            <div className="dashboard-preview">

              <div className="preview-header">

                <div>
                  <span className="preview-label">
                    CIVICCARE DASHBOARD
                  </span>

                  <h3>Complaint Overview</h3>
                </div>

                <div className="preview-menu">•••</div>

              </div>

              <div className="preview-stats">

                <div className="preview-stat">
                  <span className="stat-icon blue">◈</span>
                  <div>
                    <strong>12</strong>
                    <small>Total</small>
                  </div>
                </div>

                <div className="preview-stat">
                  <span className="stat-icon orange">◷</span>
                  <div>
                    <strong>04</strong>
                    <small>Pending</small>
                  </div>
                </div>

                <div className="preview-stat">
                  <span className="stat-icon green">✓</span>
                  <div>
                    <strong>08</strong>
                    <small>Resolved</small>
                  </div>
                </div>

              </div>

              <div className="preview-chart">

                <div className="chart-heading">
                  <span>Complaint Activity</span>
                  <span className="chart-period">This Month</span>
                </div>

                <div className="chart-area">

                  <div className="chart-line line-one"></div>
                  <div className="chart-line line-two"></div>
                  <div className="chart-line line-three"></div>
                  <div className="chart-line line-four"></div>

                  <div className="chart-bars">
                    <span style={{ height: "35%" }}></span>
                    <span style={{ height: "50%" }}></span>
                    <span style={{ height: "42%" }}></span>
                    <span style={{ height: "68%" }}></span>
                    <span style={{ height: "57%" }}></span>
                    <span style={{ height: "82%" }}></span>
                    <span style={{ height: "72%" }}></span>
                    <span style={{ height: "92%" }}></span>
                  </div>

                </div>

              </div>

              <div className="preview-complaint">

                <div className="complaint-mini-icon">
                  !
                </div>

                <div className="mini-complaint-info">
                  <strong>Street Light Issue</strong>
                  <span>Sector 12 • Submitted today</span>
                </div>

                <div className="mini-status">
                  In Progress
                </div>

              </div>

            </div>

            {/* FLOATING CARDS */}

            <div className="floating-card floating-top">

              <div className="floating-icon">
                ✓
              </div>

              <div>
                <strong>Issue Resolved</strong>
                <span>Complaint #CC1024</span>
              </div>

            </div>

            <div className="floating-card floating-bottom">

              <div className="floating-avatar">
                CC
              </div>

              <div>
                <strong>Stay Updated</strong>
                <span>Real-time status tracking</span>
              </div>

            </div>

          </div>

        </div>

        <div className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-line"></div>
        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section className="premium-about" id="about">

        <div className="section-heading">

          <span className="section-label">
            WHY CIVICCARE
          </span>

          <h2>
            Your city has problems.
            <br />
            <span>Now you have a voice.</span>
          </h2>

          <p>
            CivicCare brings citizens and civic administration
            together through one simple, transparent platform.
          </p>

        </div>

        <div className="about-grid">

          <div className="about-card about-large">

            <div className="about-number">01</div>

            <div className="about-icon">↗</div>

            <h3>Report Without the Hassle</h3>

            <p>
              Submit civic complaints with essential details,
              category and location in just a few simple steps.
            </p>

            <div className="about-decoration"></div>

          </div>

          <div className="about-card">

            <div className="about-number">02</div>

            <div className="about-icon">◉</div>

            <h3>Know What Happens Next</h3>

            <p>
              Follow your complaint from submission to
              resolution with clear status updates.
            </p>

          </div>

          <div className="about-card">

            <div className="about-number">03</div>

            <div className="about-icon">⌁</div>

            <h3>Connected Civic Action</h3>

            <p>
              Citizens, agents and administrators work
              through one connected complaint system.
            </p>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="premium-features" id="features">

        <div className="section-heading">

          <span className="section-label">
            THE CIVICCARE EXPERIENCE
          </span>

          <h2>
            Everything you need to
            <br />
            <span>make an impact.</span>
          </h2>

        </div>

        <div className="feature-showcase">

          <div className="feature-item">
            <span>01</span>
            <h3>Easy Reporting</h3>
            <p>
              Turn a civic problem into a registered complaint
              in minutes.
            </p>
          </div>

          <div className="feature-item active-feature">
            <span>02</span>
            <h3>Live Tracking</h3>
            <p>
              See the current status of your complaint without
              repeatedly asking for updates.
            </p>
          </div>

          <div className="feature-item">
            <span>03</span>
            <h3>Smart Assignment</h3>
            <p>
              Complaints can be assigned to the appropriate
              civic agent for action.
            </p>
          </div>

          <div className="feature-item">
            <span>04</span>
            <h3>Transparent Process</h3>
            <p>
              Keep citizens informed throughout the complaint
              lifecycle.
            </p>
          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="premium-how" id="how">

        <div className="section-heading">

          <span className="section-label">
            SIMPLE PROCESS
          </span>

          <h2>
            From problem to
            <br />
            <span>progress.</span>
          </h2>

        </div>

        <div className="premium-steps">

          <div className="premium-step">
            <div className="step-number">01</div>
            <h3>Register</h3>
            <p>Create your CivicCare account.</p>
          </div>

          <div className="step-connector"></div>

          <div className="premium-step">
            <div className="step-number">02</div>
            <h3>Report</h3>
            <p>Tell us about the civic issue.</p>
          </div>

          <div className="step-connector"></div>

          <div className="premium-step">
            <div className="step-number">03</div>
            <h3>Track</h3>
            <p>Follow the progress of your complaint.</p>
          </div>

          <div className="step-connector"></div>

          <div className="premium-step">
            <div className="step-number">04</div>
            <h3>Resolve</h3>
            <p>See the issue move toward resolution.</p>
          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="premium-cta">

        <div className="cta-glow"></div>

        <div className="cta-content">

          <span className="section-label">
            YOUR CITY. YOUR VOICE.
          </span>

          <h2>
            See a problem?
            <br />
            <span>Speak up.</span>
          </h2>

          <p>
            Start your CivicCare journey today and make
            reporting civic issues simpler.
          </p>

          <Link to="/register" className="premium-primary-btn">
            Get Started
            <span>→</span>
          </Link>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="premium-footer">

        <div className="footer-brand">

          <Link to="/" className="premium-logo">
            <div className="logo-mark">C</div>

            <div>
              <div className="logo-name">CivicCare</div>
              <div className="logo-subtitle">SMART CIVIC SERVICES</div>
            </div>
          </Link>

          <p>
            Making civic complaint management
            simpler, smarter and more transparent.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <span>PLATFORM</span>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
          </div>

          <div>
            <span>ACCOUNT</span>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 CivicCare. Built for better civic services.
        </div>

      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/complaint" element={<Complaint />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/agent" element={<AgentDashboard />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
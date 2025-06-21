import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Last Created Resume",
      description: "Continue editing your most recent resume.",
      image: "/cv.png",
      action: () => navigate("/resume/latest"),
    },
    {
      title: "Account Settings",
      description: "Update your personal information and preferences.",
      image: "/settings.png",
      action: () => navigate("/settings"),
    },
    {
      title: "Subscription",
      description: "Manage your plan or upgrade.",
      image: "/card.png",
      action: () => navigate("/payment"),
    },
    {
      title: "Download Resume",
      description: "Download your resume in PDF format or get a URL link.",
      image: "/download.png",
      action: () => alert("Download feature coming soon!"),
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Dashboard</h1>
      <div className="card-grid">
        {cards.map((card, index) => (
          <div className="dashboard-card" key={index} onClick={card.action}>
            <img src={card.image} alt={card.title} className="card-image" />
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

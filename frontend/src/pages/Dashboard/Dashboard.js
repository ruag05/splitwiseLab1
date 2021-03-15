import "./Dashboard.css";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState({
    totalBorrowed: 0,
    totalOwened: 0,
    authored: [],
    borrowed: [],
  });
  useEffect(() => {
    axios
      .get(`/groups/getStats`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(console.log);
  }, []);

  return (
    <nav>
      <header className="dashboard-header">
        <div className="spltwse-icon"></div>
        <h1 className="dashboard-heading">Splitwise</h1>
        <h3></h3>
        <div className="usernameimg">
          <div className="headimg"></div>
          <button className="username">
            Ruchir! <i className="fas fa-caret-down"></i>
          </button>
        </div>
      </header>
      <nav className="main">
        <Sidebar />
        <nav className="main-nav">
          <nav className="dashheader">
            <nav className="dashtop">
              <h1 className="dashboardtitle">Dashboard</h1>
              <div className="dashbuttons">
                <button className="dash-button">Add A Bill</button>
                <a className="dash-settle-button">Settle Up</a>
              </div>
            </nav>
            <div className="dashbottom">
              <div className="flextotalbalanc">
                <p className="titleowe">total balance</p>
                <p>$ {data.totalOwened - data.totalBorrowed}</p>
              </div>
              <div className="flexowed">
                <p className="titleowe">you owe</p>
                <p className="ioweyou">$ {data.totalBorrowed}</p>
              </div>
              <div className="flexowed">
                <p className="titleowe">you are owed</p>
                <p className="youoweme">${data.totalOwened}</p>
              </div>
            </div>
          </nav>
          <div className="row mt-5">
            <div className="col-6">
              <strong>You owe</strong>
              <hr />
              {data.borrowed.map((ele, i) => (
                <p className="text-danger" key={i}>
                  You owe {ele.amount} to user {ele.author}
                </p>
              ))}
            </div>
            <div className="col-6">
              <strong>You are owened</strong>
              {data.authored.map((ele, i) => (
                <p className="text-success" key={i}>
                  User {ele.borrowerId} owes you {ele.amount}
                </p>
              ))}
            </div>
          </div>
        </nav>
      </nav>
    </nav>
  );
}

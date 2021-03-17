import "./Dashboard.css";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Dashboard() {
  const [borrowerId, setBorrowerId] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [sUsers, setSUsers] = useState([]);
  const [data, setData] = useState({
    totalBorrowed: 0,
    totalOwened: 0,
    authored: [],
    borrowed: [],
  });
  const customStyles = {
    content: {
      top: '40%',
      left: '50%',
      right: '50%',
      bottom: 'auto',
      marginRight: '-40%',
      transform: 'translate(-40%, -40%)'
    }
  };
  useEffect(() => {
    axios
      .get(`/groups/getStats`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(console.log);
    axios
      .get(`/groups/getTusers`)
      .then((res) => {
        let users = [];
        res.data.users.map((u) => {
          if (users.includes(u.borrowerId)) {
            // do nothing
          } else {
            // add to array
            return users.push(u.borrowerId);
          }
        });
        setSUsers([...users]);
        console.log(sUsers);
      })
      .catch(console.log);
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {

  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSettle = (e) => {
    e.preventDefault();
    console.log(borrowerId);
    if (borrowerId === "none") {
      alert("Please select a user first");
      return;
    }
    if (!borrowerId) {
      alert("Please select a user to settle with");
      return;
    }
    axios
      .post("/users/settle", { borrowerId })
      .then((res) => {
        alert("Successfully settled all with the user.");
        closeModal();
      })
      .catch((err) => { });
  };

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
                <button className="add-bill-button">Add A Bill</button>
                <button className="dash-button" onClick={openModal}>
                  Settle Up
                </button>
                <Modal
                  isOpen={modalIsOpen}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  contentLabel="Add Expense"
                  style={customStyles}>
                  <h2 className="settle-form">Settle Up!</h2>
                  <hr />
                  <form onSubmit={handleSettle}>
                    <section className="container">
                      <div className="left">Choose friend to settle up with:</div>
                      <div >
                        <select className="right"
                          name="borrowerId"
                          onChange={(e) => {
                            setBorrowerId(e.target.value);
                          }}>
                          <option value="none" key="none">
                            Select
                        </option>
                          {sUsers.map((u) => (
                            <option value={u} key={u}>
                              User-{u}
                            </option>
                          ))}
                        </select>
                      </div>
                    </section>
                    <div className='buttons'>
                      <button onClick={closeModal} className="cancelbutton">Cancel</button>
                      <input type="submit" value="Save" className="savebutton" />
                    </div>
                  </form>
                </Modal>
              </div>
            </nav>
            <div className="dashbottom">
              <div className="flextotalbalanc">
                <p className="titleowe">total balance</p>
                <p>$ {data.totalOwened - data.totalBorrowed || 0}</p>
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
              {data.borrowed &&
                data.borrowed.map((ele, i) => (
                  <p className="text-danger" key={i}>
                    You owe {ele.amount} to user {ele.author}
                  </p>
                ))}
            </div>
            <div className="col-6">
              <strong>You are owened</strong>
              {data.authored &&
                data.authored.map((ele, i) => (
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

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Modal from "react-modal";
import "./GroupInfo.css";

Modal.setAppElement("#root");

export default function GroupInfo() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [data, setData] = useState({ title: "", amount: 0 });
  const [trans, setTrans] = useState([]);
  const [stats, setStats] = useState(new Map());
  const [back, setBack] = useState(new Map());

  const customStyles = {
    content: {
      top: "40%",
      left: "50%",
      right: "60%",
      bottom: "auto",
      marginRight: "-40%",
      transform: "translate(-40%, -40%)",
    },
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  const { gid } = useParams();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    axios
      .post("/groups/addExpense", { ...data, gid })
      .then(() => {
        closeModal();
        setData({ title: "", amount: 0 });
        fetchTransactions();
        alert("Expense Added");
      })
      .catch(console.log);
  };

  function fetchTransactions() {
    axios
      .get(`/groups/getTransactions/${gid}`)
      .then((res) => {
        console.log(res.data.trans);
        setTrans(res.data.trans);
        createUserStats();
      })
      .catch(console.log);
  }

  const createUserStats = () => {
    const stats = new Map();
    trans.forEach((t) => {
      if (stats.has(t.borrowerId)) {
        stats.set(
          t.borrowerId,
          parseInt(stats.get(t.borrowerId), 10) + +t.amount
        );
      } else {
        stats.set(t.borrowerId, parseInt(t.amount, 10));
      }
    });
    setStats(stats);
    // console.log(stats);
    const b = new Map();
    trans.forEach((t) => {
      if (b.has(t.borrowerId)) {
        b.set(t.borrowerId, parseInt(b.get(t.borrowerId), 10) + +t.amount);
      } else {
        b.set(t.borrowerId, parseInt(t.amount, 10));
      }
    });
    setBack(b);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    createUserStats();
  }, [trans]);

  return (
    <div>
      <div className="row">
        <button
          className="ml-auto mr-5 btn btn-success btn-md "
          onClick={openModal}
        >
          Add Expense
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Add Expense"
        style={customStyles}
      >
        <h2 className="add-a-bill">Add New Expense</h2>
        <hr />
        <form onSubmit={handleAddExpense}>
          <h2 className="addfriendslabel">With you and Group: {gid}</h2>
          <span className="leftinput">
            <input
              className="descrp"
              type="text"
              name="title"
              placeholder="Enter a description"
              required
              value={data.title}
              onChange={handleChange}
            />
            <div className="amount">
              <div className="dollar">$</div>
              <input
                className="amtinput"
                type="number"
                min="1"
                name="amount"
                required
                step="0.01"
                value={data.amount}
                placeholder="0.00"
                onChange={handleChange}
              />
            </div>
          </span>
          <br />
          <div className="buttons">
            <button onClick={closeModal} className="cancelbutton">
              Cancel
            </button>
            <input type="submit" value="Save" className="savebutton" />
          </div>
        </form>
      </Modal>
      <div className="container">
        <div className="row">
          <div className="col-8">
            <ul style={{ listStyle: "none" }}>
              {trans.map((t) => {
                const d = new Date(t.createdAt);

                return (
                  <li
                    key={t.id}
                    className="bg-danger pl-5 py-2 rounded my-2 text-white"
                  >
                    <span>{d.toDateString()}</span> <br />
                    <span>{t.title}</span> <br />
                    <span>
                      {/* <strong>Amount </strong> */}
                      <strong>{t.borrowerName}</strong> owes {t.currency} -{" "}
                      <strong> {t.amount}</strong>
                    </span>
                  </li>
                );
              })}
            </ul>
            {trans.length < 1 ? <h2>No Transactions yet</h2> : null}
          </div>
          <div className="col-4">
            <strong>Group balance</strong>
            <div className="">
              {Array.from(stats).map((st) => {
                return (
                  <p className="bg-danger p-2 text-white rounded">
                    User {st[0]} owes {st[1]}
                  </p>
                );
              })}
              {Array.from(stats).length < 1 && Array.from(back).length < 1
                ? "Nothing to show"
                : null}
            </div>
            <div>
              {Array.from(back).map((st) => {
                return (
                  <p className="bg-info p-2 text-white rounded">
                    User {st[0]} will get back {st[1]}
                  </p>
                );
              })}
              {/* {Array.from(back).length < 1 ? "Nothing to show" : null} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

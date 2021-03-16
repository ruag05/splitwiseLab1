import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function GroupInfo() {
  var subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [data, setData] = useState({ title: "", amount: 0 });
  const [trans, setTrans] = useState([]);
  const [stats, setStats] = useState(new Map());
  const [back, setBack] = useState(new Map());

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const { gid } = useParams();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    // console.log(data, gid);
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
      <button onClick={openModal}>Add Expense</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Add Expense"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Add New Expense</h2>
        <hr />
        <form onSubmit={handleAddExpense}>
          <input
            type="text"
            name="title"
            placeholder="Enter Expense Title"
            required
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <br />
          <input
            type="number"
            min="1"
            placeholder="Enter Amount"
            name="amount"
            required
            value={data.amount}
            onChange={handleChange}
          />
          <br />
          <br />
          <input type="submit" value="Add" />
          <hr />
          <button onClick={closeModal}>close</button>
        </form>
      </Modal>
      <div className="container">
        <div className="row">
          <div className="col-8">
            <ul>
              {trans.map((t) => {
                const d = new Date(t.createdAt);

                return (
                  <li key={t.id}>
                    <span>{d.toDateString()}</span> <br />
                    <span>{t.title}</span> <br />
                    <span>
                      {/* <strong>Amount </strong> */}
                      UserId {t.borrowerId} owes {t.amount}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col-4">
            <strong>Group balance</strong>
            <div className="">
              {Array.from(stats).map((st) => {
                // console.log(st);
                return (
                  <p>
                    User {st[0]} owes {st[1]}
                  </p>
                );
              })}
              {Array.from(stats).length < 1 ? "Nothing to show" : null}
            </div>
            <div className="">
              {Array.from(back).map((st) => {
                // console.log(st);
                return (
                  <p>
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

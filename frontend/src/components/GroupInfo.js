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
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState([]);

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
        console.log(res.data);
        setTrans(res.data.trans);
        setHistory(res.data.history);
        setStats(res.data.result);
      })
      .catch(console.log);
  }
  useEffect(() => {
    fetchTransactions();
  }, []);

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
              {history.map((t) => {
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
                      {/* <strong>{t.borrowerName}</strong> owes {t.currency} -{" "} */}
                      {/* <strong> {t.amount}</strong> */}
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
              {stats.map((st) => {
                return (
                  <p className="bg-warning p-2 text-white rounded">{st}</p>
                );
              })}
              {stats.length < 1 ? "Nothing to show" : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [gName, setGName] = useState(new Map());

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

  function afterOpenModal() { }

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
        setStats(res.data.groupBalances);
      })
      .catch(console.log);

    axios
      .get(`/groups/${gid}`)
      .then((res) => {
        let name = res.data.group.name;
        setGName(name);
      })
      .catch()
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  function formatNumber(int) {
    return int.toFixed(2);
  }
  return (
    <div>
      <div className="row" style={{ height: 40 }}>
        <button style={{ backgroundColor: "gray", color: "white", alignContent: "center", marginTop: 20, marginLeft: "15%", height: 40 }}
          onClick={openModal}>
          Add Expense
</button>
      </div>
      <br></br>
      <hr></hr>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Add Expense"
        style={customStyles}>
        <h2 className="add-a-bill">Add New Expense</h2>
        <hr />
        <form onSubmit={handleAddExpense}>
          <span>
            <h3 className="addfriendslabel">With
        "<p style={{ fontSize: 22, color: "gray" }}>You" </p>
        and Group "<p style={{ fontSize: 22, color: "Gray" }}>{gName}"</p></h3>

          </span>

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
      <div className="container" style={{marginTop: 20,}}>
        <div className="row">       
          <div className="col-8">
          <h4 className="ml-5">Group History</h4>
            <ul style={{ listStyle: "none", marginTop:"20px" }}>
              {history.map((t) => {
                const d = new Date(t.createdAt);
                return (
                  <li
                    key={t.id} style={{backgroundColor: "gray", color: "white", marginTop: 20, }}
                    className="pl-5 py-2 rounded my-2 text-white"
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
            <h4 className="ml-2">Group balance</h4>
            <div className="">
              {stats.map((st) => {
                return (
                  <p style={{backgroundColor: "gray", color: "white", marginTop: 20, }} className="p-2 text-white rounded">{st}</p>
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

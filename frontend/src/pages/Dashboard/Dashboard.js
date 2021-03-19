import "./Dashboard.css";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Dashboard() {
  const [borrowerId, setBorrowerId] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  // const [grps, setGrps] = useState([]);
  const [owe, setOwe] = useState([]);
  const [pay, setPay] = useState([]);
  const [sUsers, setSUsers] = useState(new Map());
  const [data, setData] = useState({
    totalBorrowed: 0,
    totalOwened: 0,
    authored: [],
    borrowed: [],
  });
  const customStyles = {
    content: {
      top: "40%",
      left: "50%",
      right: "50%",
      bottom: "auto",
      marginRight: "-40%",
      transform: "translate(-40%, -40%)",
    },
  };

  const fetchRes = () => {
    setData([]);
    axios
      .get(`/groups/getStats`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(console.log);
    console.log("sUsers about to initialize");
    setSUsers(new Map());

    axios
      .get(`/groups/getDashboardData`)
      .then((res) => {
        setPay([]);
        setOwe([]);
        console.log("Res data is " + res.data.finalDashboardData);
        res.data.finalDashboardData.map((e) => {
          if (e.includes("owe")) {
            setOwe((ps) => [...ps, e]);
          }
          else {
            setPay((ps) => [...ps, e]);
          }
        })
      })
      .catch(console.log);

    axios
      .get(`/groups/getTusers`)
      .then((res) => {
        let usersId = new Map();
        console.log("*********res.data.users*********");
        console.log(typeof (res.data.users));
        Object.entries(res.data.users).map(([key, u]) => {
          console.log("User is:");
          console.log({ key, u });
        });
        res.data.users.map((u) => {
          // if (Object.entries(u)[1][1] === u.borrowerId) {
          //   // do nothing
          // } else {
          //   // add to array
          //   return users.push(u);
          // }
          // if (!usersId.includes(u.borrowerId)) usersId.push(u.borrowerId);

          // if current user is not author of any transaction but is borrower of some/few then include authorId in 'select' settle dropdown
          // LOGIC: check if borrowerId is equal to current user -> if yes then add authorId else add borrowerId, to 'select' settle dropdown
          // if (u.borrowerId)
          //   usersId.set(u.authorId, u);
          // else
          usersId.set(u.borrowerId, u);
          return null;
        });

        setSUsers(usersId);
      })
      .catch(console.log);

    // axios.get("/users/getGroups").then((res) => {
    //   // setPay([]);
    //   // setOwe([]);
    //   // res.data.groups.map((gid) => {
    //   //   axios.get(`/groups/getTransactions/${gid}`).then((res) => {
    //   //     res.data.finalDashboardData.map((e) => {
    //   //       if (e.includes("owe")) {
    //   //         setPay((ps) => [...ps, e]);
    //   //       }
    //   //       else {
    //   //         setOwe((ps) => [...ps, e]);
    //   //       }
    //   //     })
    //   // res.data.result.map((e) => {
    //   //   if (e.includes("pay")) {
    //   //     setPay((ps) => [...ps, e]);
    //   //     console.log("p", e);
    //   //   }
    //   //   if (e.includes("back")) {
    //   //     console.log("o", e);
    //   //     setOwe((ps) => [...ps, e]);
    //   //   }
    //   //   return null;
    //   // });
    // });
  };

  useEffect(() => {
    fetchRes();
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() { }

  function closeModal() {
    console.log(sUsers);
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
        // alert("Successfully settled all with the user.");
        // axios
        //   .get(`/groups/getStats`)
        //   .then((res) => {
        //     console.log(res.data);
        //     setData(res.data);
        //   })
        //   .catch(console.log);
        // axios
        //   .get(`/groups/getTusers`)
        //   .then((res) => {
        //     let users = [];
        //     res.data.users.map((u) => {
        //       if (Object.entries(u)[0][1] === u.borrowerId) {
        //         // do nothing
        //       } else {
        //         // add to array
        //         return users.push(u);
        //       }
        //     });
        //     setSUsers([...users]);
        //     console.log(sUsers);
        //   })
        //   .catch(console.log);
        fetchRes();
        closeModal();
      })
      .catch((err) => { });
  };

  return (
    <nav>
      <nav className="main">
        <Sidebar />
        <nav className="main-nav">
          <nav className="dashheader">
            <nav className="dashtop">
              <h2 className="dashboardtitle" style={{ fontWeight: "bold" }}>Dashboard</h2>
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
                  style={customStyles}
                >
                  <h2 className="settle-form">Settle Up!</h2>
                  <hr />
                  <form onSubmit={handleSettle}>
                    <section className="container">
                      <div className="left">
                        Choose friend to settle up with:
                      </div>
                      <div>
                        <select
                          className="right"
                          name="borrowerId"
                          onChange={(e) => {
                            setBorrowerId(e.target.value);
                          }}
                        >
                          <option value="none" key="none">
                            Select
                          </option>
                          {Array.from(sUsers).map(([key, u]) => {
                            console.log({ key, u });
                            if (u.author != u.borrowerId) {
                              return (
                                <option value={u.borrowerId} key={u.borrowedId}>
                                  {u.borrowerName}
                                </option>
                              );
                            }
                          })}
                        </select>
                      </div>
                    </section>
                    <div className="buttons">
                      <button onClick={closeModal} className="cancelbutton">
                        Cancel
                      </button>
                      <input
                        type="submit"
                        value="Save"
                        className="savebutton"
                      />
                    </div>
                  </form>
                </Modal>
              </div>
            </nav>
            <div className="dashbottom">
              <div className="flextotalbalanc">
                <p className="titleowe">Total balance</p>
                <p style={{ marginLeft: 25 }}>$ {data.totalOwened - data.totalBorrowed || 0}</p>
              </div>
              <div className="flexowed">
                <p className="titleowe">You owe</p>
                <p className="ioweyou">$ {data.totalBorrowed}</p>
              </div>
              <div className="flexowed">
                <p className="titleowe">You are owed</p>
                <p className="youoweme">${data.totalOwened}</p>
              </div>
            </div>
          </nav>
          <div className="row mt-2 pl-2">
            <div className="col-6 border-right">
              <p style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 80, color: "darkgray" }}>You owe</p>
              <hr />
              {owe &&
                owe.map((ele, i) => (
                  <p className="text-danger" key={i}>
                    {/* You owe {ele.amount} to {ele.authorName} */}
                    {ele}
                  </p>
                ))}
            </div>
            <div className="col-6">
              <p style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 50, color: "darkgray" }}>You are owed</p>
              <hr />
              {pay &&
                pay.map((ele, i) => (
                  <p className="text-success" key={i}>
                    {/* {ele.borrowerName} owes you {ele.amount} */}
                    {ele}
                  </p>
                ))}
            </div>
          </div>
        </nav>
      </nav>
    </nav>
  );
}

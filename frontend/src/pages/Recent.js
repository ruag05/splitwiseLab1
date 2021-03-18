import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Recent.css"
export default function Recent() {
  const [history, setHistory] = useState([]);
  const [gids, setGids] = useState([]);
  const [toShow, setToShow] = useState([]);

  function sortBydate(a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }

  const handleSort = (e) => {
    if (e.target.value === "all") {
      setToShow([...history.sort(sortBydate)]);
      return;
    }
    let newList = history.filter((g) => g.groupId === parseInt(e.target.value));
    setToShow([...newList.reverse()]);
  };

  useEffect(() => {
    axios
      .get("/users/getAllHistory")
      .then((res) => {
        setHistory(res.data.history.sort(sortBydate));
        setToShow(res.data.history.sort(sortBydate));
        setGids(res.data.gids);
      })
      .catch((err) => { });
  }, []);
  return (
    <div style={{ marginTop: 20 }}>
      <div className="container">
        <span className="outer">
          <h5>
            Select a group to view specific history
          </h5>
        </span>
        <div className="inner">
          <select onChange={handleSort} style={{ border: 0, textAlign: "center" }}>
            <option value="all" key="dfds">
              All
            </option>
            {gids.map((g) => {
              return (
                <option key={g} value={g}>
                  Group: {g}
                </option>
              );
            })}
          </select>
        </div>
        {toShow.map((h) => {
          return (
            <div className="bg-info p-3 m-1 text-white">{h.title}</div>
          );
        })}
        {!toShow.length && (
          <div className="bg-warning">Nothing to show</div>
        )}
      </div>
    </div>

  );
}

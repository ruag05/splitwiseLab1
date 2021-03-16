import axios from "axios";
import React, { useState, useEffect } from "react";

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
      .catch((err) => {});
  }, []);
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col">
            <span className="mr-2">
              Select a group to view specific history{" "}
            </span>
            <select onChange={handleSort}>
              <option value="all" key="dfds">
                All
              </option>
              {gids.map((g) => {
                return (
                  <option key={g} value={g}>
                    Group - {g}
                  </option>
                );
              })}
            </select>
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
      </div>
    </div>
  );
}

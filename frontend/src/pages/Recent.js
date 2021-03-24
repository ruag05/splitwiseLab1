import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Recent.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCartPlus } from "react-icons/fa";

export default function Recent() {
  const [history, setHistory] = useState([]);
  const [gids, setGids] = useState([]);
  const [gNames, setGNames] = useState(new Map());
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
      .get("/groups/getAllGroupsName")
      .then((res) => {
        let names = new Map();
        res.data.groups.map((g) => {
          names.set(g.id, g.name);
        });
        setGNames(names);
        gNames.map(entry=>{
          entry.createdAt=entry.createdAt.getDay()
        });

      })
      .catch((err) => { });
    axios
      .get("/users/getAllHistory")
      .then((res) => {
        setHistory(res.data.history.sort(sortBydate));
        setToShow(res.data.history.sort(sortBydate));
        setGids(res.data.gids);
      })
      .catch((err) => { });
  }, []);
  
  function formatDate(string){
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(string).toLocaleDateString([],options);
}
  return (
    <div style={{ marginTop: 20  }}>
      <div className="container" style={{height:47, backgroundColor:"darkgray"}}>
        <span className="outer">
          <h5 style={{paddingTop:10, color: "white", backgroundColor:"transparent" }}>Select a group to view its history</h5>
        </span>
        <div className="inner">
          <select onChange={handleSort} style={{border: 0, paddingTop:5, fontSize: 20, width: 60, color: "white", backgroundColor:"darkgray" }}>
            <option value="all" key="dfds">All</option>
            {gids.map((g) => {
              return (
                <option key={g} value={g}>
                  Group: {gNames.get(g)}
                </option>
              );
            })}
          </select>
        </div>
        <hr></hr>
        {toShow.map((h) => {
          return (
            <div className="m-2" style={{borderLeft:"darkgray", borderLeftWidth:"5px", borderLeftStyle:"solid"}}>
              <div className="t-icon">
                <FaCartPlus color="gray" size="30" />
              </div>
              <p className="pl-5" style={{ color: "gray" }}>
                <span>
                  <h5 style={{fontSize:20, fontWeight:"bolder", color:"gray"}}>Group: {gNames.get(h.groupId)}</h5>
                  <h6 style={{fontSize:16, color:"gray"}}>{h.title}</h6>
                </span>
                {gNames.get(h.groupId).getDay}
                <p style={{fontSize:12, fontWeight:"bold", color:"darkgray"}}>{formatDate(h.createdAt)}</p>
              </p>
            </div>
          );
        })}
        {!toShow.length && (
          <div className="bg-warning">Nothing to show</div>
        )}
      </div>
    </div>
  );
}
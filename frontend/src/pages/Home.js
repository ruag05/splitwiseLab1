import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import axios from "axios";
import { authContext } from "../context/AuthContext";

export default function Home() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="d-none d-md-flex col-lg-12 col-lg-12 bg-image-home"></div>        
          <div className="login d-flex">          
          </div>       
      </div>
    </div>
  );
}

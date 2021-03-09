import React from "react";
import CreateGroup from "../components/CreateGroup";
// import CreateInvite from "../components/CreateInvite";

export default function Groups() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <CreateGroup />
        </div>
      </div>
      <div className="container mt-2 mb-4">
        {/* <div className="text-center">
          <CreateInvite />
        </div> */}
      </div>
    </div>
  );
}

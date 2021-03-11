import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateInvite from "./components/CreateInvite";
import Groups from "./pages/CreateGroups";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
          <ProtectedRoutes path="/profile" exact>
          <Profile />
        </ProtectedRoutes>
          <ProtectedRoutes path="/" exact>
            <Home />
          </ProtectedRoutes>
          <ProtectedRoutes path="/groups/create" exact>
          <Groups />
        </ProtectedRoutes>
        <ProtectedRoutes path="/groups/invite" exact>
            <CreateInvite />
          </ProtectedRoutes>         
          <Route>
            <h2 className="text-center mt-5">Page Not found</h2>
            <div className="text-center">
              <button className="btn btn-lg btnprimary">
                <Link to="/"> Goto Home</Link>
              </button>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

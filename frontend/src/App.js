import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';
import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
        </Switch>
      </Router>
    </div>
  );
}

export default App;

import "./Dashboard.css";
import Sidebar from "./Sidebar";

export default function Dashboard() {
    return (
        <nav>
            <header className="dashboard-header">                
                    <div className="spltwse-icon"></div>
                    <h1 className="dashboard-heading">Splitwise</h1>
                    <h3></h3>
                    <div className="usernameimg">
                        <div className="headimg"></div>
                        <button className='username'>Ruchir! <i className="fas fa-caret-down"></i></button>
                    </div>               
            </header>
            <nav className="main">
                <Sidebar />
                <nav className="main-nav">
                    <nav className="dashheader">
                        <nav className="dashtop">
                            <h1 className="dashboardtitle">Dashboard</h1>
                            <div className="dashbuttons">
                                <button className='dash-button'>Add A Bill</button>
                                <a className='dash-settle-button'>Settle Up</a>
                            </div>
                        </nav>
                        <div className='dashbottom'>
                        <div className='flextotalbalanc'>
                            <p className='titleowe'>total balance</p>
                            <p>$50</p>
                        </div>    
                        <div className='flexowed'>
                                <p className='titleowe'>you owe</p>
                                <p className="ioweyou" >$50</p>
                            </div>
                            <div className='flexowed'>
                                <p className='titleowe'>you are owed</p>
                                <p className="youoweme">$100</p>
                            </div>
                        </div>
                    </nav>
                    <nav className="main-nav-img"></nav>
                </nav>
            </nav>
        </nav>
    );
}
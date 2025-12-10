import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import AnnkutSevakList from "./pages/AnnkutSevakList";
import MandalSevakList from "./pages/MandalSevakList";
import ReceiptBooks from "./pages/ReceiptBooks";
import AdminHome from "./pages/AdminHome";
import LeaderHome from "./pages/SupervisorHome";
import TeamHome from "./pages/TeamHome";
import SamparkVyaktiDetails from "./pages/SamparkVyaktiDetails";
import AdminManageTeams from "./pages/ManageTeams";
import SupervisorHome from "./pages/SupervisorHome";
import ManageTeams from "./pages/ManageTeams";
import ManageSamparSevakkDetails from "./pages/ManageSamparSevakkDetails";
import ManageSupervisors from "./pages/ManageSupervisors";
import NirdeshakHome from "./pages/NirdeshakHome";
import NirikshakHome from "./pages/NirikshakHome";
import SanchalakHome from "./pages/SanchalakHome";
import ManageMandalTeams from "./pages/ManageMandalTeams";
import ManageMandalYuvaks from "./pages/ManageMandalYuvaks";
import SamparkYuvakDetailsTeamWise from "./pages/SamparkYuvakDetailsTeamWise";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/supervisor-home" element={<SupervisorHome />} />
          <Route path="/nirdeshak-home" element={<NirdeshakHome />} />
          <Route path="/nirikshak-home" element={<NirikshakHome />} />
          <Route path="/sanchalak-home" element={<SanchalakHome />} />
          <Route path="/team-home" element={<TeamHome />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/annkut-sevak-list" element={<AnnkutSevakList />} />
          <Route path="/receipt-books" element={<ReceiptBooks />} />
          <Route path="/mandal-sevak-list" element={<MandalSevakList />} />
          <Route path="/sampark-vyakti-details" element={<SamparkVyaktiDetails />} />
          <Route path="/manage-sampark-sevak-details" element={<ManageSamparSevakkDetails />} />
          <Route path="/manage-teams" element={<ManageTeams />} />
          <Route path="/manage-supervisor" element={<ManageSupervisors />} />
          <Route path="/manage-mandal-teams" element={<ManageMandalTeams />} />
          <Route path="/manage-mandal-yuvaks" element={<ManageMandalYuvaks />} />
          <Route path="/sampark-yuvak-team-wise" element={<SamparkYuvakDetailsTeamWise />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
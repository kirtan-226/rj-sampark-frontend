import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../api/api";

function Header(props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/");
  };
  const handleTeamDetails = () => {
    navigate("/manage-teams");
  };

  const handleVyaktiDetails = () => {
    navigate("/sampark-vyakti-details");
  };

  const handleManageSSDetails = () => {
    navigate("/manage-sampark-sevak-details");
  };

  const handleManageSupervisors = () => {
    navigate("/manage-supervisor");
  }

  const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails"));
  const role = sevakDetails.role;
  console.log(role, 'role');

  const handleRedirection = () => {
    if (role === "Admin") navigate("/admin-home");
    else if (role === "Nirdeshak") navigate("/nirdeshak-home");
    else if (role === "Nirikshak") navigate("/nirikshak-home");
    else if (role === "Sanchalak") navigate("/sanchalak-home");
    else if (role === "Team") navigate("/team-home");
    else navigate("/");
  };

  return (
    // <div>
    //   <Navbar
    //     style={{ background: "#ED3237", marginBottom: "7px", zIndex: 1000 }}
    //   >
    //     <NavbarBrand style={{ color: "#ffffffff" }} onClick={handleRedirection}>
    //       <i className="bi bi-house-door-fill"></i>
    //       <span style={{ margin: "10px" }}>Sampark 2025</span>
    //     </NavbarBrand>

    //     <NavbarToggler style={{ background: "#ffffff" }} onClick={toggle} />
    //     <Collapse isOpen={isOpen} navbar>
    //       <Nav className="me-auto" navbar>
    //         {(role === "Sanchalak") && (
    //           <>
    //             {/* <NavItem style={{ margin: "5px" }}>
    //               <Button color="warning" onClick={handleManageSSDetails}>
    //                 Manage Sampark Sevak
    //               </Button>
    //             </NavItem> */}
    //           </>
    //         )}
    //         {role === "Admin" && (
    //           <>
    //             <NavItem style={{ margin: "5px" }}>
    //               <Button color="warning" onClick={handleVyaktiDetails}>
    //                 સંપર્ક થયેલા યુવકોની માહિતી
    //               </Button>
    //             </NavItem>
    //             <NavItem style={{ margin: "5px" }}>
    //               <Button color="warning" onClick={handleTeamDetails}>
    //                 Manage Teams
    //               </Button>
    //             </NavItem>
    //             <NavItem style={{ margin: "5px" }}>
    //               <Button color="warning" onClick={handleManageSupervisors}>
    //                 Manage Supervisors
    //               </Button>
    //             </NavItem>
    //           </>
    //         )}

    //         {role === "Admin" && (
    //           <>

    //           </>
    //         )}

    //         <NavItem style={{ margin: "5px" }}>
    //           <Button
    //             style={{
    //               background: "#ffffff",
    //               color: "black",
    //               fontWeight: "bold",
    //             }}
    //             onClick={handleLogout}
    //           >
    //             Logout
    //           </Button>
    //         </NavItem>
    //       </Nav>
    //     </Collapse>
    //   </Navbar>
    // </div>


    ///////////////////////////////

    <div>
      <Navbar
        style={{ background: "#ED3237", marginBottom: "7px", zIndex: 1000 }}
        expand="md"
      >
        {/* LEFT SIDE BRAND */}
        <NavbarBrand
          style={{ color: "#ffffffff", cursor: "pointer" }}
          onClick={handleRedirection}
        >
          <i className="bi bi-house-door-fill"></i>
          <span style={{ margin: "10px" }}>Sampark 2025</span>
        </NavbarBrand>

        {/* RIGHT SIDE LOGOUT BUTTON */}
        <div style={{ marginLeft: "auto" }}>
          <Button
            style={{
              background: "#ffffff",
              color: "black",
              fontWeight: "bold",
              padding: "6px 14px",
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Navbar>
    </div>

  );
}

export default Header;

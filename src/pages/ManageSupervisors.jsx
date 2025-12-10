import React, { useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import AddSupervisorModal from '../components/AddSupervisorModal';
import Header from '../components/Header';

const ManageSupervisors = () => {
    const navigate = useNavigate();
    const [showAddSupervisor, setShowAddSupervisor] = useState(false);

    const handleAddSupervisor = () => setShowAddSupervisor(true);

    const showUpdateSupervisorModal = () => {
        alert("Update Supervisor clicked");
    }

    const showDeleteSupervisorModal = () => {
        alert("Delete Supervisor clicked");
    }

    return (
        <>
            <Header />
            <div style={{ padding: '20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px'
                }}>
                    <h5 style={{ margin: 0 }}>Manage Supervisors</h5>

                    <Button color="warning" onClick={handleAddSupervisor}>
                        Add Supervisor
                    </Button>
                </div>
                <div style={{ overflowX: "auto", marginTop: "20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Post</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Mandal</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Phone</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>1</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Ravi Patel</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Nirdeshak</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>SJ</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>9876543210</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                                    <FaEdit style={{ cursor: "pointer", marginRight: "15px" }} size={18} color="green"
                                        onClick={showUpdateSupervisorModal}
                                    />
                                    <FaTrash style={{ cursor: "pointer" }} size={18} color="red"
                                        onClick={showDeleteSupervisorModal}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>2</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Aryan Vyas</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Sanchalak</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>NK</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>8765432109</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                                    <FaEdit style={{ cursor: "pointer", marginRight: "15px" }} size={18} color="green" />
                                    <FaTrash style={{ cursor: "pointer" }} size={18} color="red" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div >

            {showAddSupervisor && (
                <AddSupervisorModal modal={showAddSupervisor} setModal={setShowAddSupervisor} />
            )}
        </>
    )
}

export default ManageSupervisors
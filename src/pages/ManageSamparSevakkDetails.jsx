import React, { useState } from 'react'
import Header from '../components/Header'
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import AddSupervisorModal from '../components/AddSupervisorModal';
import ListingTable from '../components/ListingTable';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditSamparkSevakModal from '../components/EditSamparkSevakModal';

const ManageSamparSevakkDetails = () => {

    const navigate = useNavigate();
    const [showEditSS, setShowEditSS] = useState(false);

    const showUpdateSSModal = () => setShowEditSS(true);

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
                    <h5 style={{ margin: 0 }}>Sampark Sevak List</h5>
                </div>
                <div style={{ overflowX: "auto", marginTop: "20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Mandal</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Phone</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>1</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Sevak 1</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>SJ</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>9876543210</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                                    <FaEdit style={{ cursor: "pointer", marginRight: "15px" }} size={18} color="green"
                                        onClick={showUpdateSSModal}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>2</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Sevak 2</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>NK</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>8765432109</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                                    <FaEdit style={{ cursor: "pointer", marginRight: "15px" }} size={18} color="green"
                                        onClick={showUpdateSSModal}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div >

            {showEditSS && (
                <EditSamparkSevakModal modal={showEditSS} setModal={setShowEditSS} />
            )}
        </>
    )
}

export default ManageSamparSevakkDetails;
import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { Modal } from "bootstrap";

const ApproveList = ()=>{
    const location = useLocation();

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="text-end my-3" >
                        <NavLink className={`nav-link ${location.pathname === '/approveWrite' ? 'active' : ''}`} to="/approveWrite">
                            <button className="btn btn-info">기안 상신 작성</button>
                        </NavLink>
                    </div>

                    <div className="btn-group text-start" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio1"/>
                        <label className="btn btn-outline-primary" for="btnradio1">수신</label>
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio2"/>
                        <label className="btn btn-outline-primary" for="btnradio2">발신</label>
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio3"/>
                        <label className="btn btn-outline-primary" for="btnradio3">완료</label>
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio4"/>
                        <label className="btn btn-outline-primary" for="btnradio4">참조</label>
                    </div>

                    <div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ApproveList;
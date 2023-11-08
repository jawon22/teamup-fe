import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { levelState, userState } from '../recoil';
import Emp from './emp';
import {CgProfile} from "react-icons/cg";
import {BsFillBellFill} from "react-icons/bs";
import {RiKakaoTalkFill} from "react-icons/ri";

const Sidebar = () => {
    // const [user, setUser] = useState({});
    const [user, setUser] = useRecoilState(userState);
    const [level, setLevel] = useRecoilState(levelState);

    return (
        <div>

            <div className="side-bar">
                <div className="icon">
                    <div>▼</div>
                    <div>▶</div>
                </div>

                <div className='row'>
                    <div className='col'>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <div className="sidebar-menu  me-1">
                            <div className='text-end border  border-radius pe-3' >
                                {user}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content container-fluid">
                
                <nav className="navbar navbar-expand-lg bg-white pe-4 ps-5 ms-5" data-bs-theme="light">
                    <div className="container-fluid ">
                        <NavLink className="navbar-brand">Navbar</NavLink>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarColor03">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <NavLink className="nav-link active">Home
                                        <span className="visually-hidden">(current)</span>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link">Features</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link">Pricing</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link">About</NavLink>
                                </li>
                                <li className="nav-item dropdown">
                                    <NavLink className="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</NavLink>
                                    <div className="dropdown-menu">
                                        <NavLink className="dropdown-item">Action</NavLink>
                                        <NavLink className="dropdown-item">Another action</NavLink>
                                        <NavLink className="dropdown-item">Something else here</NavLink>
                                        <div className="dropdown-divider"></div>
                                        <NavLink className="dropdown-item">Separated link</NavLink>
                                    </div>
                                </li>
                            </ul>
                            <div className="d-flex">
                                <RiKakaoTalkFill className="text-primary ms-2 mt-1"size="40"/>
                                <BsFillBellFill className="text-primary ms-2 mt-1"size="40"/>
                                <CgProfile className="text-primary ms-2"size="50"/>
                            </div>
                        </div>
                    </div>
                </nav>
                {/* 본문 */}

        


                <Emp/>






                <h1>Test</h1>
                <input className='form-control' />
                <button classNames="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Toggle right offcanvas</button>
            </div>




            {/* offcanvas  */}
            <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">Toggle top offcanvas</button>

                <div className="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasTopLabel">Offcanvas top</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    ...
                </div>
                </div>
        </div>

    );
}
export default Sidebar
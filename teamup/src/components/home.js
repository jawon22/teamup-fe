import React from "react";
import { NavLink } from "react-router-dom";
const Home = ()=>{


    return (<>
        <h1>홈페이지</h1>

        <NavLink to="/myPage">마이페이지</NavLink>
    </>);
};
export default Home;
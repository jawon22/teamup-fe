import axios from "axios";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";
import {useNavigate} from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState);

    const [loginUser, setLoginUser] = useState({
        empId:"",
        empPW:""
    });

    const login =()=>{
        axios({
            url:"http://localhost:8080/emp/login/",
            method:"post",
            data:loginUser

        }).then(respones=>{
            console.log(respones.data)
            if(respones.data ===true){
                setUser(loginUser.empId);
                setTimeout(()=>{
                    navigate('/home');
                },1000);
                

            }
        })
    }

    const inputChange =(e)=>{
        setLoginUser({
            ...loginUser,
            [e.target.name] : e.target.value
        })

    }




    return (
        <>

            <div className="container">
                <h1>로그인 페이지</h1>

                <div className="row mt-4">
                    <div className="col-ms-6 offset-ms -3">
                        <label>아이디</label> <input type="text" name="empId" onChange={inputChange} className="form-control"></input>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-ms-6 offset-ms -3">
                        <label>비밀번호</label>
                        <input type="password" className="form-control" name="empPw" onChange={inputChange}></input>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-ms-6 offset-ms -3">
                        <button className=" btn btn-primary w-100" onClick={login}>로그인</button>

                    </div>
                </div>


            </div>


        </>


    );

};
export default Login;
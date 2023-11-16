import axios from "axios";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../recoil";
import { useNavigate } from 'react-router-dom'
import jwt_decode, { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';


const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState);
    const [token, setToken] = useRecoilState(tokenState);

    const [loginUser, setLoginUser] = useState({
        empId: "",
        empPw: ""
    });

    const login = () => {
        axios({
            url: "http://localhost:8080/emp/login/",
            method: "post",
            data: loginUser

        }).then(response => {
            console.log(response.data)
            if (response.data !== null) {
                Cookies.set('userId',response.data);
               const decode = jwtDecode(response.data); 


                const userId = decode.sub;

                



                // 리코일에 저장
                setUser(userId);
                setTimeout(() => {
                    navigate('/home');
                }, 500);


            }
            else{
                alert("실패")
            }
        })
    }

    const inputChange = (e) => {
        setLoginUser({
            ...loginUser,
            [e.target.name]: e.target.value
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
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { companyState, tokenState, userState } from "../recoil";
import { useNavigate } from 'react-router-dom'
import jwt_decode, { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';


const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState);
    const [company, setCompany] = useRecoilState(companyState);
    const [comId, setComId] = useRecoilState(companyState);

    const savedToken = Cookies.get('userId');

    
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
            if (response.data !== null) {
                console.log(response.data);
                const savedToken = response.data;

                Cookies.set('userId', savedToken);

                // 리코일에 저장
                axios({
                    url: `http://localhost:8080/emp/findtoken/${savedToken}`,
                    method: 'get',
                }).then(res => {
                    if (savedToken && savedToken === res.data.token) {
                        const decode = jwtDecode(savedToken)
                        const userId = decode.sub
                        setUser(userId);
                        console.log(userId)
                        let userNo = userId.substring(6);


                        axios({
                            url: `http://localhost:8080/emp/mypage/${userNo}`,
                            method: 'get'
                        }).then(response => {
                            console.log(response.data);
                            setCompany(response.data.comId);
                        });
                    }
                });

                setTimeout(() => {
                    navigate('/home');
                  }, 500);  // 1초 후에 '/home'으로 이동
            } else {
                alert("실패");
            }
        });
    };

    const inputChange = (e) => {
        setLoginUser({
            ...loginUser,
            [e.target.name]: e.target.value
        })

    }








    return (
            <>
                <div className="container">

                    <div className="d-flex row">

                        {/* 이미지 부분 */}
                        <div className="col-8" style={{ height: "100vh", overflow: "hidden" }}>
                            <img src="img/company.png" style={{ maxWidth: "100%", height: "100%" }} alt="Company Logo"></img>
                        </div>
                        
                        {/* 로그인 부분 */}
                        <div className="col-4 right">

                            {/* 로고 */}
                            <div style={{ textAlign: "right" }}>
                                <img src="img/TeamUpLogo.png" style={{ maxWidth: "30%", height: "100%" }} alt="TeamUp Logo" />
                            </div>
                                id: 202384107<br />
                                pw: 83a5dbf03f<br />
                                수정중입니다 로그인페이지

                            <div className="row mt-4">
                                <div className="col-ms-6 offset-ms -3">
                                    <input type="text" name="empId" onChange={inputChange} 
                                    className="form-control" placeholder="id"></input>
                                </div>
                            </div>

                            {/* 아이디 */}
                            <div className="row mt-4">
                                <div className="col-ms-6 offset-ms -3">
                                    <input type="passwosrd" className="form-control" name="empPw" 
                                    onChange={inputChange} placeholder="password"></input>
                                </div>
                            </div>

                            {/* 패스워드 */}
                            <div className="row mt-4">
                                <div className="col-ms-6 offset-ms -3">
                                    <button className=" btn btn-primary w-100" onClick={login}>로그인</button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );

};
export default Login;
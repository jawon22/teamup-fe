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

    const [comId ,setComId] = useRecoilState(companyState);

    const [token, setToken] = useRecoilState(tokenState);
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
                console.log(response.data)
                Cookies.set('userId', response.data);

                // 리코일에 저장
                loadInfo();
                setTimeout(() => {
                    navigate('/home');
                }, 1000);


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




    const loadInfo = () => {

        console.log("????",savedToken)
        axios({
          url: `http://localhost:8080/emp/findtoken/${savedToken}`,
          method: 'get',
        }).then(res => {
          console.log("?", res.data.token)
          console.log("sav", savedToken)
          console.log("compare", savedToken && savedToken === res.data.token)
    
          if (savedToken && savedToken === res.data.token) {
            const decode = jwtDecode(savedToken)
            console.log(savedToken)
            console.log(decode)
            const userId = decode.sub
            console.log(userId);
            console.log(user);
            setUser(userId);
            console.log(userId)
            let userNo = userId.substring(6);
    
    
            axios({
              url: `http://localhost:8080/emp/mypage/${userNo}`,
              method: 'get'
            }).then(response => {
              console.log(response.data)
              setComId(response.data.comId)
              navigate("/home")
    
    
            });
    
          }
    
    
        }
    
    
        )
    
    
    
    
    
      }
      useEffect(() => {
        loadInfo();
      }, []);
    



    return (
        <>

            <div className="container">
                <h1>로그인 페이지</h1>
                id: 202384107<br/>
                pw: 83a5dbf03f<br/>
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
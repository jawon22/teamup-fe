import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { companyState, tokenState, userState } from "../recoil";
import { useNavigate } from 'react-router-dom'
import jwt_decode, { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { Modal } from "bootstrap";

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
            url: `${process.env.REACT_APP_REST_API_URL}/emp/login/`,
            method: "post",
            data: loginUser
        }).then(response => {
            if (response.data !== null) {
                const savedToken = response.data;

                Cookies.set('userId', savedToken);

                // 리코일에 저장
                axios({
                    url: `${process.env.REACT_APP_REST_API_URL}/emp/findtoken/${savedToken}`,
                    method: 'get',
                }).then(res => {
                    if (savedToken && savedToken === res.data.token) {
                        const decode = jwtDecode(savedToken)
                        const userId = decode.sub
                        setUser(userId);
                        let userNo = userId.substring(6);


                        axios({
                            url: `${process.env.REACT_APP_REST_API_URL}/emp/mypage/${userNo}`,
                            method: 'get'
                        }).then(response => {
                            setCompany(response.data.comId);
                            sessionStorage.setItem("userName", response.data.empName);
                            navigate('/home');

                        });
                    }
                });


            } else {
                alert("실패");
            }
        }).catch(error => {
            console.log(error.request.status)
            if (error.request.status === 500) {
                if (loginUser.empId.length <= 0) {
                    alert('모든값을 입력해 주세요')
                }
                else {
                    alert("정확한 값을 입력해 주세요")
                }
            }
        });
    };

    const inputChange = (e) => {
        setLoginUser({
            ...loginUser,
            [e.target.name]: e.target.value
        })

    }




    const bsModal = useRef();

    const closeModal = () => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();

        // clearProfile();
    };
    const openModal = () => {
        const modal = new Modal(bsModal.current);
        modal.show();
    }



    const [info, setInfo] = useState(
        {
            empId: "",
            empEmail: "",
        }
    );

    const changeInfo = (e) => {

        setInfo({
            ...info,
            [e.target.name]: e.target.value
        }
        )
    }

    const findPw = () => {
        axios({
            url: "http://localhost:8080/emp/empFindPw/",
            method: "post",
            data: info
        }).then(res => {
            alert("success")
        });
    }



    const [capsLockOn, setCapsLockOn] = useState(false);

    const handleKeyPress = (event) => {
        // 이벤트의 getModifierState 메서드를 사용하여 Caps Lock 상태 확인
        const capsLockIsOn = event.getModifierState('CapsLock');
        setCapsLockOn(capsLockIsOn);
    };

    useEffect(() => {
        // 컴포넌트가 마운트되면 이벤트 리스너 추가
        window.addEventListener('keydown', handleKeyPress);

        // 컴포넌트가 언마운트되면 이벤트 리스너 제거
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);


        const findPw =()=>{
            axios({
                url:`${process.env.REACT_APP_REST_API_URL}/emp/empFindPw/`,
                method:"post",
                data:info
            }).then(res=>{
                alert("success")
            });
        }


    return (
        <form autoComplete="off">
            <div className="">

                <div className="d-flex row me-5">

                    {/* 이미지 부분 */}
                    <div className="col-8" style={{ height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ height: "100%", width: "100%" }}>
                            <img
                                src="img/company.png"
                                style={{
                                    maxWidth: "100%",
                                    height: "100%",
                                    objectFit: "cover" // 이미지를 화면에 꽉 차게 표시
                                }}
                                alt="Company Logo"
                            />
                        </div>
                    </div>

                    {/* 로그인 부분 */}
                    <div className="col-4 right p-5 mt-5">

                        {/* 로고 */}
                        <div style={{ textAlign: "center" }} className="me-5 mt-5 pt-5">
                            <img src="img/TeamUpLogo.png" style={{ maxWidth: "35%", height: "100%" }} alt="TeamUp Logo" />
                        </div>



                        {/* 아이디 */}
                        <div className="row mt-5 me-5">
                            <div className="col-ms-6 offset-ms-3">
                                <input type="text" name="empId" onChange={inputChange}
                                    className="form-control p-4" placeholder="id"></input>

                            </div>
                        </div>

                        {/* 패스워드 */}
                        <div className="row mt-2 me-5 mb-3">
                            <div className="col-ms-6 offset-ms-3">
                                <input type="password" className="form-control p-4" name="empPw"
                                    onChange={inputChange} placeholder="password"></input>
                            </div>
                        </div>
                        <div>
                        {capsLockOn?  <p>Caps Lock이 켜져 있습니다!</p> :<p>　</p>}
                                {/* 나머지 컴포넌트 내용 */}
                        </div>

                        {/* 로그인 버튼 */}
                        <div className="row mt-4 me-5">
                            <div className="col-ms-6 offset-ms-3">
                                <button type="button" className=" btn btn-primary w-100 p-3 text-bold" onClick={login}>Login</button>
                            </div>
                        </div>


                        {/* 회사가입 링크 / 링크 추가해야함 */}
                        <div className="row">
                            <div className="col-ms-6 offset-ms-3 mt-2 ms-5" style={{ textAlign: "center" }}>
                                <NavLink to="/companyJoin" className="ms-5">관리자로그인</NavLink>
                                <NavLink to="/com" className="ms-1 link">회사가입</NavLink>
                            </div>
                        </div>



                        {/* 비밀번호 찾기 / 링크 추가해야함 */}
                        <div className="row">
                            <div className="col-ms-6 offset-ms-3 mt-2 d-flex mt-5" >

                                <div>
                                    <span className="me-3">비밀번호를 잊어버리셨나요?</span>
                                    <button type="button" className="btn btn-primary" onClick={openModal} style={{ backgroundColor: "rgb(195, 195, 195)", border: "none" }}>비밀번호 찾기</button>
                                </div>

                            </div>
                        </div>

                    </div>





                    <div class="modal fade" ref={bsModal} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">비밀번호 찾기</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div className="row">
                                        <div className="col">
                                            <label className="form-label">사원번호</label>
                                            <input className="form-control" name="empId" value={info.empId} onChange={changeInfo} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label className="form-label">이메일</label>
                                            <input className="form-control" name="empEmail" value={info.empEmail} onChange={changeInfo} />
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" onClick={closeModal} >취소</button>
                                    <button type="button" class={`btn btn-primary`} onClick={findPw}>비밀번호 찾기</button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

            </div>
        </form>
    );

};
export default Login;
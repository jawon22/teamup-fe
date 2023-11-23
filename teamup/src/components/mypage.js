import { useRecoilState } from "recoil";
import React, { useEffect, useState } from "react";
import { userState } from "../recoil";
import axios from "axios";
import Attend from './attend';
import surf from "./images/profileImage.png";
import { FaEdit } from "react-icons/fa";
import { IoCamera } from "react-icons/io5";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { RiDeleteBin6Fill } from "react-icons/ri";


const Mypage = () => {
    const [empInfo, setEmpInfo] = useState({
        comId: '',
        deptNo: '',
        empId: '',
        empName: '',
        empEmail: '',
        empPositionNo: '',
        empTel: '',
        empJoin: ''
    });
    const [user, setUser] = useRecoilState(userState);

    const empNo = user.substring(6);

    const myInfo = () => {
        axios({
            url: `http://localhost:8080/emp/mypage/${empNo}`,
            method: 'get',
        }).then(response => {
            console.log("정보={}",response.data);
            setEmpInfo(response.data);
        });
    };

    useEffect(() => {
        myInfo();
    }, []);



    //로그인한 회원의 마이페이지 프로필이미지
    const [profile, setProfile] = useState({
        attach: "",
        empTel: "",
        empEmail: "",
        profileTitle: "",
        profileContent: ""
    });
    // console.log(profile);

    const loggedInEmpNo = parseInt(user.substring(6));

    // const bsModal = useRef();
    const [showModal, setShowModal] = useState(false);


    //프로필 조회
    const loadProfile = (empNo) => {
        axios({
            url: `http://localhost:8080/profile/${empNo}`,
            method: "get",
        })
            .then(response => {//성공
                // console.log(response);
                setProfile(response.data);
                // 이미지 정보 업데이트
                updateImagePreview();

                // 프로필 로드가 완료된 후에 모달 열기
                // openModal();
            })
            .catch(err => {//실패
                console.error(err);
            });
    };

    useEffect(() => {
        loadProfile(loggedInEmpNo);
    }, []);



    //이미지 미리보기 업데이트
    const updateImagePreview = () => {
        const changeImage = document.getElementById("changeImage");
        const previewImage = document.getElementById("previewImage");
        const previewImage2 = document.getElementById("previewImage2");

        if (changeImage && changeImage.files && changeImage.files[0]) {

            const file = changeImage.files[0];

            // 미리보기 업데이트
            previewImage.src = URL.createObjectURL(file);
            previewImage2.src = URL.createObjectURL(file);

        }

    };


    // 프로필 수정창 열기
    const editProfile = () => {

        openModal();
    };


    //수정한 값 처리
    const changeProfile = (e) => {
        if (e.target.type === "file") {
            // 파일 업로드 시
            const file = e.target.files[0];
            setProfile({
                ...profile,
                attach: file,
            });
            updateImagePreview(file);
        } else {
            // 텍스트 입력 시
            setProfile({
                ...profile,
                [e.target.name]: e.target.value,
            });
        }
    };


    //프로필 수정 처리
    const updateProfile = async () => {

        //이미지 파일 가져가기(input[type="file"]을 사용한다고 가정)
        const changeImage = document.getElementById("changeImage");
        // console.log(changeImage);
        const attach = changeImage.files[0];
        // console.log(attach);

        //프로필 데이터를 FormData로 만듦
        const formData = new FormData();
        formData.append("empTel", profile.empTel);
        formData.append("empEmail", profile.empEmail);
        formData.append("profileTitle", profile.profileTitle);
        formData.append("profileContent", profile.profileContent);
        // formData.append("attach", attach);

        // 이미지 파일이 있는 경우에만 FormData에 추가
        if (attach) {
            formData.append("attach", attach);
        }

        try {
            //서버로 업데이트 요청 전송
            await axios({
                url: `http://localhost:8080/profile/${loggedInEmpNo}`,
                method: "put",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });


            // FormData에 파일을 추가하고 나서 프로필 상태 업데이트
            setProfile({
                ...profile,
                attach: attach,
            });


            //업데이트 성공 시 모달 닫기
            closeModal();
        }
        catch (error) {
            console.error("프로필 업데이트 에러", error);
            //수정한 이미지 파일이 없는 경우에도 모달 닫기
            closeModal();
        }
    };

    //프로필 이미지 삭제
    const deleteImage = async () => {
        try {
            // 백엔드에 이미지 삭제를 처리하는 API 호출
            await axios({
                url: `http://localhost:8080/profile/image/${empNo}`,
                method: "delete"
            });

            // 이미지 삭제 성공 시, 기본 이미지로 설정 또는 다른 작업 수행
            setImgSrc(surf);

            // 모달 닫기
            closeModal();
        }
        catch (error) {
            console.error("프로필 이미지 삭제 에러", error);
        }
    };



    //모달 관련 처리

    const openModal = () => {
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    //이미지를 만들기 위해서 필요한 것은 사번
    //사번만 알면 <img src="http://localhost:8080/image/profile/사번">으로 이미지를 출력할 수 있다
    const [imgSrc, setImgSrc] = useState(null);//처음에는 없다고 치고 기본이미지로 설정
    useEffect(() => {
        axios({
            url: `http://localhost:8080/image/profile/${loggedInEmpNo}`,
            method: "get"
        })
            .then(response => {
                setImgSrc(`http://localhost:8080/image/profile/${loggedInEmpNo}`);
            })
            .catch(err => {
                setImgSrc(surf);
            });
    }, []);

    //이미지가 있으면 imgSrc를 사용하고, 없다면 surf를 사용
    const displayImage = imgSrc || surf;








    ////비밀번호 수정 개인정보 수정

    const [empInfomation, setEmpInfomation] = useState({
        empName: '',
        empTel: '',
        empEmail: '',
        empPw: '',
        empPwCheck:'',
        myEmpPw:'',
    });

    const [result, setResult] = useState({
        pw:null,
        pwCheck:null,
    });

    const check =()=>{

        const checkPw = /^[A-Z][a-z0-9!@#$]{8,16}$/;
        const pwMatch = empInfomation.empPw.length === 0 ? null : checkPw.test(empInfomation.empPw);

        const match = empInfomation.empPwCheck.length=== 0 ? null :
         empInfomation.pwCheck === empInfomation.empPw && empInfomation.empPwCheck.length>0;

        setResult({
            pw:pwMatch,
            pwCheck:match,
        })
        

    };



    const changeData=(e)=>{
        setEmpInfomation({...empInfomation,
            [e.target.name]:e.target.value}
            )

            console.log(empInfomation.empPwCheck)

    }


    const handleClickChange = () => {
        handleShow();
    };

    const changePw = () => {
        axios({
            url: `http://localhost:8080/emp/changePw/${empNo}`,
            method: 'put',
            data:{ empPw:empInfomation.empPw}
        }).then(res => {
            console.log(res.data)

        });
    };




    const [show, setShow] = useState(false);

    const handleClose = () =>{ setShow(false)
        setEmpInfomation({});
        
        setResult({
            pw:null,
            pwCheck:null,
        });
    };
    const handleShow = () => setShow(true);

    return (
        <>
            <div className="container m-5 ps-5 pe-5">

                {/* 마이페이지 상세 */}
                <div className="row mt-4 mp-bg text-green">

                    <div className="col-5 d-flex justify-content-center align-items-center">
                        <img src={displayImage} alt="profileImage" id="previewImage2"
                            className="rounded-circle object-fit-cover"
                            style={{ width: "220px", height: "220px" }} />
                        <FaEdit size="30px" className="image-edit-btn mt-150"
                            onClick={() => editProfile(loggedInEmpNo)} />
                    </div>

                    <div className="col-7 p-4">

                        <div className="row mt-3">
                            <div className="col-4 text-bold">부서번호</div>
                            <div className="col-8">{empInfo.deptNo}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">사원번호</div>
                            <div className="col-8">{empInfo.empId}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">이름</div>
                            <div className="col-8">{empInfo.empName}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">연락처</div>
                            <div className="col-8">{empInfo.empTel}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">이메일</div>
                            <div className="col-8">{empInfo.empEmail}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">직급</div>
                            <div className="col-8">{empInfo.empPositionNo}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">가입일</div>
                            <div className="col-8">{empInfo.empJoin}</div>
                        </div>
                        <div className="row mt-2 mb-3">
                            <div className="col-4 text-bold">회사아이디</div>
                            <div className="col-8">{empInfo.comId}</div>
                        </div>

                    </div>
                    <div className="col-1 offset-11">
                        <button className="btn btn-sm btn-secondary" value={empInfo.empNo} onClick={handleClickChange}>개인정보수정</button>
                    </div>
                </div>


                {/* Modal */}
                <Modal
                    show={showModal}
                    onHide={closeModal}
                    backdrop="static"
                    size="md"
                    centered={true}
                    aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <h5 className="modal-title">프로필</h5>
                            {/* <button type="button" className="btn-close" data-dismiss="modal" onClick={closeModal}>
                              <span aria-hidden="true">&times;</span>
                            </button> */}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="grid-example mt-3">
                        <Container>
                            <Row>
                                <Col xs={6} md={6}>
                                    <row>
                                        <label className="input-file-button justify-content-end" for="changeImage">
                                            <img src={displayImage} alt="profileImage" id="previewImage" className="rounded-circle object-fit-cover"
                                                style={{ width: "180px", height: "180px" }} />
                                        </label>
                                    </row>
                                    <row>
                                        <label>
                                            <input type="file" name="attach" id="changeImage" style={{ display: "none" }} onChange={updateImagePreview} />
                                            <IoCamera className="image-edit-btn ms-130" style={{ width: "30px", height: "30px" }} />
                                        </label>
                                        <label>
                                            <RiDeleteBin6Fill className="image-delete-btn" style={{ width: "30px", height: "30px" }}
                                                onClick={deleteImage} />
                                        </label>
                                    </row>
                                </Col>
                                <Col xs={6} md={6}>
                                    <p>부서 : {profile.deptName}</p>
                                    <p>직위 : {profile.empPositionName}</p>
                                    <p>이름 : {profile.empName}</p>
                                    <p>입사일 : {profile.empJoin}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={4} md={3} className="text-center">
                                    < p>연락처</p>
                                </Col>
                                <Col xs={8} md={9}>
                                    <input type="tel" name="empTel" className="form-control"
                                        value={profile.empTel} onChange={changeProfile} />
                                </Col>
                            </Row>


                            <Row>
                                <Col xs={4} md={3} className="text-center">
                                    <p>이메일</p>
                                </Col>
                                <Col xs={8} md={9}>
                                    <input type="email" name="empEmail" className="form-control"
                                        value={profile.empEmail} onChange={changeProfile} />
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={4} md={3} className="text-center">
                                    <p>소개</p>
                                </Col>
                                <Col xs={8} md={9}>
                                    <input type="text" name="profileTitle" className="form-control"
                                        value={profile.profileTitle} onChange={changeProfile} />
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={4} md={3} className="text-center">
                                    <p>내용</p>
                                </Col>
                                <Col xs={8} md={9}>
                                    <textarea name="profileContent" className="form-control" rows="4"
                                        value={profile.profileContent} onChange={changeProfile} />
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>닫기</Button>
                        <Button variant="primary" onClick={updateProfile}>수정</Button>
                    </Modal.Footer>
                </Modal>


                <div className="row mt-5 text-green">
                    {/* 근태 관리 */}
                    <div className="text-center text-green">
                        <div className="row mp-bg mb-4 p-4">
                            <div className="col-12">
                                <Attend />
                            </div>
                        </div>
                    </div>
                </div>












                <Button variant="primary" onClick={handleShow}>
                    Launch demo modal
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>비밀번호 수정</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <label className="form-label">새비밀번호</label>
                        <input type="password" onBlur={check} className={`form-control  ${result.pw === true? 'is-valid':''}
                      ${result.pw === false? 'is-invalid':''}`} name="empPw" value={empInfomation.empPw} onChange={changeData}/>
                        <label className="form-label">비밀번호확인</label>
                        <input type="password" onBlur={check} className={`form-control   ${result.pwCheck === true? 'is-valid':''}
                      ${result.pwCheck === false? 'is-invalid':''}`}  name="empPwCheck" value={empInfomation.empPwCheck}  onChange={changeData}/>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={changePw}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>




















            </div>
        </>
    );
};

export default Mypage;

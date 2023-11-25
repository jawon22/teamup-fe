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
import { NavDropdown } from "react-bootstrap";
import { Await } from "react-router";


const Mypage = (props) => {
    const AppUser = props.user;
    const [empInfo, setEmpInfo] = useState({
        comId: '',
        deptNo: '',
        deptName: '',
        empId: '',
        empName: '',
        empEmail: '',
        empPositionNo: '',
        empTel: '',
        empJoin: ''
    });
    const [user, setUser] = useRecoilState(userState);

    const empNo = user.substring(6);


    const myInfo = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/emp/mypage/${empNo}`);
            console.log("정보={}", response.data);
            setEmpInfo(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        myInfo();
    }, [props.user]);



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
            url: `${process.env.REACT_APP_REST_API_URL}/profile/${empNo}`,
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
    }, [props.user]);



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
        loadProfile(loggedInEmpNo);
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
                url: `${process.env.REACT_APP_REST_API_URL}/profile/${loggedInEmpNo}`,
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
        if (window.confirm("프로필 이미지를 삭제하시겠습니까?")) {
            try {
                // 백엔드에 이미지 삭제를 처리하는 API 호출
                await axios({
                    url: `${process.env.REACT_APP_REST_API_URL}/profile/image/${empNo}`,
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
            url: `${process.env.REACT_APP_REST_API_URL}/image/profile/${loggedInEmpNo}`,
            method: "get"
        })
            .then(response => {
                setImgSrc(`${process.env.REACT_APP_REST_API_URL}/image/profile/${loggedInEmpNo}`);
            })
            .catch(err => {
                setImgSrc(surf);
            });
    }, [props.user]);

    //이미지가 있으면 imgSrc를 사용하고, 없다면 surf를 사용
    const displayImage = imgSrc || surf;








    ////비밀번호 수정 개인정보 수정

    const [empInfomation, setEmpInfomation] = useState({
        empName: '',
        empTel: '',
        empEmail: '',
        empPw: '',
        empPwCheck: '',
        myEmpPw: '',
    });

    const [result, setResult] = useState({
        originPw: null,
        pw: null,
        pwCheck: null,
    });


    const findPw = () => {
        axios({
            url: `http://localhost:8080/emp/findPw/${empNo}`,
            method: 'post',
            data: empInfomation.empPw

        }).then(res => {
            setResult({
                ...result,
                originPw: res.data
            })
        });
    }

    const check = () => {
        const checkPw = /^[A-Z][a-z0-9!@#$]{8,16}$/;
      
        const pwMatch = checkPw.test(empInfomation.empPw);
        const pwCheckMatch =
          empInfomation.empPwCheck?.length > 0 &&
          empInfomation.empPw === empInfomation.empPwCheck;
      
        setResult({
          pw: pwMatch,
          pwCheck: pwCheckMatch,
        });
      };

    const changeData = (e) => {
        setEmpInfomation({
            ...empInfomation,
            [e.target.name]: e.target.value
        }
        )

        console.log(empInfomation.empPwCheck)

    }


    const handleClickChange = () => {
        handleShow();
    };

    const changePw = () => {
        axios({
            url: `${process.env.REACT_APP_REST_API_URL}/emp/changePw/${empNo}`,
            method: 'put',
            data: { empPw: empInfomation.empPw }
        }).then(res => {
            console.log(res.data)

        });
    };




    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
        setEmpInfomation({});

        setResult({
            pw: null,
            pwCheck: null,
        });
    };
    const handleShow = () => {
        setEmpInfomation({
            empPw:''
        })
        setShow(true)};

    //입사일 날짜까지만
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);
        return formattedDate.replace(/\.$/, ''); // 맨 뒤의 . 제거


        
    };



    ///개인정보 수정
    const openForChange=()=>{};


    const infoChange = async () => {
        if (window.confirm("정보를 수정 하시겠습니까?")) {
        try {
            const response = await axios({
                url:`http://localhost:8080/emp/empInfoUpdate/${empNo}`,
                method:'put',
                data:{
                    empName:empInfo.empName,
                    empTel:empInfo.empTel,
                    empEmail:empInfo.empEmail,
                    }
            })
            console.log("정보={}", response.data);
            alert("수정되었습니다.")
            setShow2(false)
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
};




    const [empChange, setEmpChange] =useState({
        empName:empInfo.empName,
        empTel:empInfo.empTel,
        empEmail:empInfo.empEmail
    })

    const change = (e) => {
        setEmpInfo({
            ...empInfo,
            [e.target.name]: e.target.value
        }
        )

        console.log(empInfo.empName)
        console.log(empInfo.empTel)
        console.log(empInfo.empEmail)

    }






    const [show2, setShow2] = useState(false);

    const handleClose2 = () => {
        setShow2(false)
        setEmpInfomation({});

        setResult({
            pw: null,
            pwCheck: null,
        });
    };
    const handleShow2 = () => {
        myInfo();
        setShow2(true);}



    return (
        <>
            <div className="container m-5 ps-5 pe-5">
                    직급변경 만들어야함
                {/* 마이페이지 상세 */}
                <div className="row mt-4 mp-bg text-green my-page">

                    <div className="col-5 image-fix d-flex justify-content-center align-self-center"
                        onClick={() => editProfile(loggedInEmpNo)}>
                        <img src={displayImage} alt="profileImage" id="previewImage2"
                            className="rounded-circle object-fit-cover img-responsive"
                            style={{ width: "220px", height: "220px" }} />
                        <div>
                            <FaEdit className="mypage-btn-icon text-white"
                                style={{ width: "35px", height: "35px", padding: "7px" }} />
                        </div>
                    </div>

                    <div className="col-7 p-4">

                        <div className="row mt-3">
                            <div className="col-4 text-bold">부서명</div>
                            <div className="col-8">{profile.deptName}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">직급</div>
                            <div className="col-8">{profile.empPositionName}</div>
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
                            <div className="col-4 text-bold">가입일</div>
                            <div className="col-8">{empInfo.empJoin}</div>
                        </div>
                        <div className="row mt-2 mb-3">
                            <div className="col-4 text-bold">회사아이디</div>
                            <div className="col-8">{empInfo.comId}</div>
                        </div>

                    </div>
                    <div className="col-1 offset-11">
                        {/* <button className="btn btn-sm btn-secondary" value={empInfo.empNo} onClick={handleClickChange}>개인정보수정</button> */}

                        <NavDropdown title="개인정보 수정">
                            <NavDropdown.Item onClick={handleShow2}>개인정보 수정</NavDropdown.Item>
                            <NavDropdown.Item value={empInfo.empNo} onClick={handleClickChange}>비밀번호 수정</NavDropdown.Item>



                        </NavDropdown>
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
                            <h5 className="modal-title">내 프로필</h5>
                            {/* <button type="button" className="btn-close" data-dismiss="modal" onClick={closeModal}>
                              <span aria-hidden="true">&times;</span>
                            </button> */}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="grid-example mt-3">
                        <Container>
                            <Row className="justify-content-md-center">
                                <Col xs={11} md={11}>
                                    <Row>
                                        <Col xs={6} md={6}>
                                            <Row className="d-flex justify-content-center align-self-center">
                                                <label className="input-file-button" for="changeImage">
                                                    <img src={displayImage} alt="profileImage" id="previewImage" className="rounded-circle object-fit-cover"
                                                        style={{ width: "180px", height: "180px" }} />
                                                </label>
                                            </Row>
                                            <Row>
                                                <label>
                                                    <input type="file" name="attach" id="changeImage" style={{ display: "none" }} onChange={updateImagePreview} />
                                                    <IoCamera className="image-edit-btn text-white ms-1 mt-1" style={{ width: "30px", height: "30px", padding: "3px" }} />
                                                </label>
                                                <label>
                                                    <RiDeleteBin6Fill className="image-delete-btn text-white ms-1 mt-1" style={{ width: "30px", height: "30px", padding: "3px" }}
                                                        onClick={deleteImage} />
                                                </label>

                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row className="border border-success mt-3 rounded-top">
                                                <Col xs={12} md={5} className='border-bg-color text-center text-bold text-green py-2'>
                                                    부서
                                                </Col>
                                                <Col xs={12} md={7} className="py-2">
                                                    {profile.deptName}
                                                </Col>
                                            </Row>
                                            <Row className="border border-success border-top-0">
                                                <Col xs={12} md={5} className='border-bg-color text-center text-bold text-green py-2'>
                                                    직급
                                                </Col>
                                                <Col xs={12} md={7} className="py-2">
                                                    {profile.empPositionName}
                                                </Col>
                                            </Row>
                                            <Row className="border border-success border-top-0">
                                                <Col xs={12} md={5} className='border-bg-color text-center text-bold text-green py-2'>
                                                    이름
                                                </Col>
                                                <Col xs={12} md={7} className="py-2">
                                                    {profile.empName}
                                                </Col>
                                            </Row>
                                            <Row className='border border-success border-top-0 rounded-bottom'>
                                                <Col xs={12} md={5} className='border-bg-color text-center text-bold text-green py-2'>
                                                    입사일
                                                </Col>
                                                <Col xs={12} md={7} className="py-2">
                                                    {formatDate(profile.empJoin)}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={4} md={3} className="border border-success border-bg-color text-center text-bold text-green py-2 rounded-top">
                                            연락처
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <input type="tel" name="empTel" className="form-control"
                                                value={profile.empTel} onChange={changeProfile} />
                                        </Col>
                                        <Col xs={4} md={3} className="border border-success border-bg-color 
                                                text-center text-bold text-green py-2 border-top-0">
                                            이메일
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <input type="email" name="empEmail" className="form-control"
                                                value={profile.empEmail} onChange={changeProfile} />
                                        </Col>

                                        <Col xs={4} md={3} className="border border-success border-bg-color 
                                                text-center text-bold text-green py-2 border-top-0">
                                            소개
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <input type="text" name="profileTitle" className="form-control"
                                                value={profile.profileTitle} onChange={changeProfile} />
                                        </Col>

                                        <Col xs={4} md={3} className="border border-success border-bg-color 
                                                text-center text-bold text-green border-top-0 rounded-bottom align-self-center"
                                            style={{ height: "86px" }}>
                                            <p className="mt-4">내용</p>
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <textarea name="profileContent" className="form-control" rows="3"
                                                value={profile.profileContent} onChange={changeProfile} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>닫기</Button>
                        <Button variant="primary" onClick={updateProfile}>수정</Button>
                    </Modal.Footer>
                </Modal>


                <div className="row mt-5 text-green my-page">
                    {/* 근태 관리 */}
                    <div className="text-center text-green">
                        <div className="row mp-bg mb-4 p-4">
                            <div className="col-12">
                                <Attend user={user} />
                            </div>
                        </div>
                    </div>
                
                </div>







                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>비밀번호 수정</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <label className="form-label">비밀번호</label>
                        <input
                            type="password"
                            onBlur={check}
                            className={`form-control ${result.pw === true ? 'is-valid' : result.pw === false ? 'is-invalid' : ''
                                }`}
                            name="empPw"
                            value={empInfomation.empPw}
                            onChange={changeData}
                        />

                        <label className="form-label">비밀번호 확인</label>
                        <input
                            type="password"
                            onBlur={check}
                            className={`form-control ${result.pwCheck === true
                                    ? 'is-valid'
                                    : result.pwCheck === false
                                        ? 'is-invalid'
                                        : ''
                                }`}
                            name="empPwCheck"
                            value={empInfomation.empPwCheck}
                            onChange={changeData}
                        />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            닫기
                        </Button>
                        <Button variant="primary" onClick={changePw}>
                            수정
                        </Button>
                    </Modal.Footer>
                </Modal>



                <Modal show={show2} onHide={handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>개인정보 수정</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <label className="form-label mt-2">이름</label>
                    <input type="text" name="empName" value={empInfo.empName} onChange={change} className="form-control" />
                    <label className="form-label mt-2">전화번호</label>
                    <input type="tel" name="empTel" value={empInfo.empTel} onChange={change} className="form-control" />
                    <label className="form-label mt-2">E-mail</label>
                    <input type="email" name="empEmail" value={empInfo.empEmail} onChange={change} className="form-control" />

                       

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose2}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={infoChange}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

















            </div>
        </>
    );
};

export default Mypage;

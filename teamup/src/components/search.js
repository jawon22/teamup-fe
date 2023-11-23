import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import surf from "./images/profileImage.png";
import { useRecoilState } from "recoil";
import { companyState, userState } from "../recoil";
import { Pagination } from "react-bootstrap";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { RiDeleteBin6Fill } from "react-icons/ri";

const Search = () => {
    const location = useLocation();
    const [searchList, setSearchList] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [user, setUser] = useRecoilState(userState)
    const [comId, setComId] = useRecoilState(companyState);
    const [count, setCount] = useState();
    const [size, setSize] = useState(10);


    const [active, setActive] = useState();


    const userId = user.substring(6);

    // const loadAddress = () => {

    //     axios({
    //         url:"http://localhost:8080/addr/myAddrList/13",
    //         method:"get"

    //     }).then(response=>{
    //         setAddressList(response.data);
    //     }

    //     )

    // };
    //onclick으로 보내기
    const pageClick = (selectedPage) => {
        setActive(selectedPage);


        axios({
            url: "http://localhost:8080/emp/search/",
            method: "post",
            data: {
                ...data,
                page: active
            }



        }).then(response => {
            console.log("Data  ", response.data)
            console.log("page", active)
            console.log("count", response.data.length)
            console.log("보낸 데이터", data)
            setSearchList(response.data)
            setSearchList([])
            loadForSearch()
        }).catch();

        console.log("data", data)
    };

    useEffect(() => {
        console.log('click', active);
        console.log('count', count);
    }, [active]);


    let items = [];

    let pages = count % size === 0 ? count / size : Math.floor(count / size) + 1;



    for (let number = 1; number <= pages; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active} onClick={() => loadForSearch(number)}>
                {number}
            </Pagination.Item>
        );
    }

    const [data, setData] = useState({
        comId: comId,
        comName: null,
        deptNo: 0,
        empNo: 0,
        deptName: null,
        empName: null,
        empId: userId,
        empPositionName: null,
        empPositionNo: 0,
        empEmail: null,
        joinStart: null,
        joinEnd: null,
        empTel: null,
        salMax: 0,
        salMin: 0,
        page: 0,
        size: size


    });
    const dataChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
        console.log("??=   ", user)

    };

    const loadForSearch = (pageNumber) => {
        axios({
            url: "http://localhost:8080/emp/search/",
            method: "post",
            data: {
                ...data,
                page: pageNumber
            }
        })
            .then(response => {
                console.log("보낸 데이터", data);
                setSearchList(response.data);
                console.log(response.data);
            })
            .catch();
    };

    useEffect(() => {
        loadForSearch();
        getCount();

        //  loadAddress();

    }, []);


    const [profileList, setProfileList] = useState([]);


    //프로필 조회
    const loadProfile = () => {

        axios({
            url: "http://localhost:8080/profile/",
            method: "get",

        })
            .then(response => {//성공
                setProfileList(response.data);


            })
            .catch(err => {
                console.error(err);
            });//실패
    };
    // console.log(setProfileList);

    useEffect(() => {
        loadProfile();
    }, []);

    //모달과 연결된 state
    const [profile, setProfile] = useState({});



    // 프로필 버튼 클릭 시 처리
    const handleProfileButtonClick = (emp) => {
        //console.log(emp);

        const result = profileList.filter(prof => prof.empNo === emp.empNo);

        //검색결과가 없으면 stop
        if (result.length === 0) return;

        setProfile({ ...result[0] });

        // 클릭한 회원의 이미지 로드
        const empNo = result[0].empNo;
        loadProfileImage(empNo);
        
        setProfile({ ...result[0] });

        // 모달 창 열기
        openModal();
    };



    //모달 관련 처리
    const [showModal, setShowModal] = useState(false);

    const openModal = () =>{
        setShowModal(true);
      };
      const closeModal = () =>{
        setShowModal(false);
      };



    // const getCount = ()=>{
    //     axios({
    //         url:
    //     }).then();
    // };
    const getCount = () => {
        axios({
            url: `http://localhost:8080/emp/count/${comId}`,
            method: 'get'
        }).then(res => {

            console.log(res.data)
            setCount(res.data)
        }
        );
    };



// const empNo = parseInt(user.substring(6));
// const empNo = user.substring(6);
    //사번으로 주소록에 프로필이미지 출력
    const [imgSrc, setImgSrc] = useState(null);//처음에는 없다고 치고 기본이미지로 설정
    const loadProfileImage= (empNo)=>{
      axios({
        url:`http://localhost:8080/image/profile/${empNo}`,
        method:"get"
      })
      .then(response=>{
        setImgSrc(`http://localhost:8080/image/profile/${empNo}`);
      })
      .catch(err=>{
        setImgSrc(surf);
      });
    };

    //이미지가 있으면 imgSrc를 사용하고, 없다면 surf를 사용
    const displayImage = imgSrc || surf;



    return (
        <>
            <div className="container">
                <div className="mt-3 mb-4">
                    <h2>주소록</h2>
                </div>

                <div className="row mb-5">
                    <div className="col-2">
                        <select onChange={dataChange} name="select" class="form-select" id="exampleSelect">
                            <option value="d.dept_name">부서</option>
                            <option value="e.emp_name">이름</option>
                            <option value="ep.emp_position_name">직급</option>
                        </select>
                    </div>

                    <div className="col-5">
                        <input className="form-control" name="keyword" onChange={dataChange} placeholder="검색어 입력" />
                    </div>

                    <div className="col-2">
                        <input type="date" className="form-control" name="joinStart" value={data.joinStart} onChange={dataChange} placeholder="검색어 입력" />
                    </div>

                    <div className="col-2">
                        <input type="date" className="form-control" name="joinEnd" onChange={dataChange} placeholder="검색어 입력" />
                    </div>

                    <div className="col-1">

                        <button onClick={loadForSearch} className="btn btn-primary">검색</button>

                    </div>
                </div>


                <table className="table table-hover mt-4 text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>사번</th>
                            <th>부서</th>
                            <th>직급</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>전화번호</th>
                            <th>입사일</th>
                            <th>퇴사일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchList.map(list => (
                            <tr key={list.empNo} onClick={e => handleProfileButtonClick(list)} 
                                    style={{cursor: "pointer"}}>
                                <td className={list.empExit !== null ? 'text-danger' : ''}>{list.empId}</td>
                                <td className={list.empExit !== null ? 'text-danger' : ''}>{list.deptName}</td>
                                <td className={list.empExit !== null ? 'text-danger' : ''}>{list.empPositionName}</td>
                                <td className={list.empExit !== null ? 'text-danger' : ''}>{list.empName}</td>
                                <td className={list.empExit !== null ? 'text-danger' : ''}>{list.empEmail}</td>
                                <td className={list.empExit !== null ? 'text-danger' : ''}>{list.empTel}</td>
                                <td className={list.empExit !== null ? 'text-danger' : ''}>{list.empJoin}</td>
                                <td className={list.empExit !== null ? 'text-danger' : ''}>{list.empExit}</td>
                                {/* <td>
                                    <button className="btn btn-sm btn-primary" onClick={e=>handleProfileButtonClick(list)}>프로필</button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="row item-center">
                    <div className="col-6 offset-5 mt-4">
                        <Pagination >{items}</Pagination> 
                    </div>
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
                        <h5 className="modal-title text-green text-bold">{profile.empName}님의 프로필</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid-example mt-1">
                    <Container>
                        <Row>
                            <Col xs={6} md={6}>
                                <row>
                                    <label className="d-flex justify-content-center align-items-center" for="changeImage">
                                        <img src={displayImage} alt="profileImage" className="rounded-circle object-fit-cover" 
                                            style={{width:"180px", height:"180px"}}/>
                                    </label>
                                </row>
                            </Col>
                            <Col xs={2} md={2} className="text-center mt-2">
                                <p>부서</p>
                                <p>직위</p>
                                <p>이름</p>
                                <p>입사일</p>
                            </Col>
                            <Col xs={4} md={4} className="mt-2">
                                <p>{profile.deptName}</p>
                                <p>{profile.empPositionName}</p>
                                <p>{profile.empName}</p>
                                <p>{profile.empJoin}</p>
                            </Col>
                        </Row>
    
                        <Row>
                            <Col xs={4} md={3} className="text-center mt-2">
                              <p>연락처</p>
                            </Col>
                            <Col xs={8} md={9} className="mt-2">
                              <p>{profile.empTel}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} md={3} className="text-center">
                              <p>이메일</p>
                            </Col>
                            <Col xs={8} md={9}>
                              <p>{profile.empEmail}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} md={3} className="text-center">
                              <p>소개</p>
                            </Col>
                            <Col xs={8} md={9}>
                              <p>{profile.profileTitle}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} md={3} className="text-center">
                              <p>내용</p>
                            </Col>
                            <Col xs={8} md={9}>
                              <p>{profile.profileContent}</p>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>닫기</Button>
            </Modal.Footer>
            </Modal>
        </>
    );

};
export default Search;
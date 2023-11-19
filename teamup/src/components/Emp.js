import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { companyState, userState } from "../recoil";
import { useRecoilState } from "recoil";
import Badge from 'react-bootstrap/Badge';
import './tree.css';
import './modal.css';
import Button from 'react-bootstrap/Button';
import { Modal } from "bootstrap";
const Emp = () => {
    const [user, setUser] = useRecoilState(userState);
    const [company, setCompany] = useRecoilState(companyState)
    const empNo = user.substring(6);
    const deptNo = user.substring(4, 6);


    const [deptList, setDeptList] = useState([])
    const [empList, setEmpList] = useState([]);




    useEffect(() => {
        loadDeptList();
    }, []);



    const [toggle, setToggle] = useState(false);




    //부서리스트
    const loadDeptList = () => {
        axios({
            url: `http://localhost:8080/dept/listByCompany/${company}`,
            method: 'get'
        }).then(res => {
            setDeptList(res.data)
            //console.log('저장부서',deptList)
        });
    };

    const [openDept, setOpenDept] = useState(null);

    const spreadDept = (deptNo) => {
        setOpenDept((prevDept) => (prevDept === deptNo ? null : deptNo));

        if (openDept !== deptNo) {
            axios({
                url: 'http://localhost:8080/emp/empListByDeptCom',
                method: 'post',
                data: {
                    comId: company,
                    deptNo: deptNo,
                },
            })
                .then((res) => {
                    console.log('저장사원', empList);
                    setEmpList(res.data);
                    setToggle((prevToggle) => !prevToggle);
                    console.log(toggle);
                })
                .catch((error) => {
                    console.error('Error fetching employee list:', error);
                });
        }

        console.log(deptNo)


    };

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [clickedEmpNo, setClickedEmpNo] = useState('');
    const [clickedEmpName, setClickedEmpName] = useState('');
    const [clickedEmpPosition, setClickedEmpPosition] = useState('');

    const show = (emp) => {
        console.log("click")
        console.log("emp", emp.empId)
        openModal();
        setClickedEmpNo(emp.empId.substring(6));
        console.log("empNo", clickedEmpNo)
        setClickedEmpName(emp.empName)
        setClickedEmpPosition(emp.empPositionName)


    }



    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">


                        <div className="org-chart">
                            <ul >
                                {deptList.map((dept, index) => (
                                    <ul key={index} >
                                        <li className="deptName" onClick={() => spreadDept(dept.deptNo)}>
                                            <span>{dept.deptName}</span>
                                            {openDept === dept.deptNo && (
                                                <ul >
                                                    {empList.map((emp, index) => (
                                                        <li key={index} onClick={() => show(emp)}>
                                                            <Badge bg="success">{emp.empPositionName}</Badge> {emp.empName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    </ul>
                                ))}
                            </ul>
                        </div>





                        <>

                            {showModal && (
                                <div className="modal-background" >
                                    <div className="modal-content">
                                        <button className="modal-close-button" onClick={closeModal}>
                                            &times;
                                        </button>
                                        <div className="row">
                                            <div className="col-4">
                                                <span><Badge bg="success">{clickedEmpPosition}</Badge> {clickedEmpName}님의 채팅</span><button className="ms-3">+</button>
                                                <h2>클릭하면 채팅으로</h2>
                                        <p>모달 내용이 여기에 들어갑니다.</p>
                                        <p>+버튼 누르면 input hide해제 보이게하고 이름 입력 or 사원번호로 추가</p>
                                            </div>
                                            <div className="col-8">
                                                <h3>채팅방 내부</h3>
                                            </div>
                                        </div>
                     
                                        <button className="position-absolute bottom-0 end-0 me-3 mb-3" onClick={closeModal}>닫기</button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            )}
                        </>
                    </div>
                </div>
            </div>


        </>

    );

};
export default Emp;
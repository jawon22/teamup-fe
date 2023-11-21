import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { companyState, userState } from "../recoil";
import { useRecoilState } from "recoil";
import Badge from 'react-bootstrap/Badge';
import './tree.css';
import './modal.css';
import Button from 'react-bootstrap/Button';
import { Modal } from "bootstrap";
import Chat from "./chat";
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
    const [openDept, setOpenDept] = useState(null);
    
    // 부서리스트
    const loadDeptList = () => {
        axios({
            url: `http://localhost:8080/dept/listByCompany/${company}`,
            method: 'get'
        }).then(res => {
            setDeptList(res.data);
            //console.log('저장부서',deptList)
        });
    };
    
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
                                <div className="chat-modal-background" >
                                    <div className="chat-modal-content">
                                        <button className="chat-modal-close-button" onClick={closeModal}>
                                            &times;
                                        </button>
                                        <Chat/>
                     
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
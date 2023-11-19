import axios from "axios";
import { useEffect, useState } from "react";
import { companyState, userState } from "../recoil";
import { useRecoilState } from "recoil";
import Badge from 'react-bootstrap/Badge';
import './tree.css';
import Button from 'react-bootstrap/Button';
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
                                                    <li  key={index}>
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

                    </div>
                </div>
            </div>

        </>

    );

};
export default Emp;
import { useRecoilState } from "recoil";
import { companyState, userState } from "../recoil";
import axios from "axios";
import { useEffect, useState } from "react";

const DeptInsert = () => {
    const [comId] = useRecoilState(companyState);
    const [deptList, setDeptList] = useState([]);


    useEffect(() => {
        console.log(comId)
        loadDetpList();
    }, [])

    const [dept, setDept] = useState({
        deptName: "",
        comId: comId
    })

    const changeInfo = (e) => {
        setDept({
            ...dept,
            [e.target.name]: e.target.value
        })


    };

    const deptInsert = () => {
        //추가할 부분 같은 이름의 부서가 있을 경우 등록이 안되게 해야함
        axios({
            url: `http://localhost:8080/dept/`,
            method: 'post',
            data: dept

        }).then(response => {
            console.log(response.data)
        }
        );


    };

    const loadDetpList = () => {
        axios({
            url: `http://localhost:8080/dept/listByCompany/${comId}`,
            method: "get"


        }).then(response => {
            console.log(response.data)
            setDeptList(response.data)
        });
    };

    //회사의 부서 인서트

    return (

        <>
            <div className="container">
                <div className="row mt-4">
                    <div className="col-6 offset-6">
                        <h1>부서인서트</h1>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-6 offset-6">
                        부서명 <input className="form-control" name="deptName" onChange={changeInfo} />
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-6 offset-6">
                        <button className="btn btn-primary" onClick={deptInsert}>등록</button>
                    </div>
                </div>

{/* 추가할 부분 드롭다운 만들어서 부서별 인원 찾기? 안해도 될거 같긴한데 */}
                <div className="row mt-4">
                    <div className="col-6 offset-6">
                        <tabel className="table table-border">
                            <thead>
                                <tr>
                                    <th>부서명</th>
                                    <th>부서인원</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deptList.map(dept => (
                                    <tr key={dept.deptNo}>
                                        <td>{dept.deptName}</td>
                                        <td>{dept.empCount}</td>
                                    </tr>
                                ))}
                            </tbody>


                        </tabel>
                    </div>
                </div>

            </div>


        </>
    );
};
export default DeptInsert;
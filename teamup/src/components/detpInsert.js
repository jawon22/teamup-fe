import { useRecoilState } from "recoil";
import { companyState, userState } from "../recoil";
import axios from "axios";
import { useEffect, useState } from "react";

const DeptInsert =()=>{
    const [comId] = useRecoilState(companyState);
    const [deptList, setDeptList] = useState([]);
    useEffect(()=>{
        console.log(comId)
        loadDetpList();
    },[])

    const [dept, setDept] = ({
        deptName:'',
        comId:''
    })

    const changeInfo = ()=>{


    };

    const deptInsert = ()=>{


    };

    const loadDetpList=()=>{
        axios({
            url:`http://localhost:8080/dept/listByCompany/${comId}`,
            method:"get"


        }).then(response=>{
            console.log(response.data)
            setDeptList(
                response.data
            )
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
                   부서명 <input/>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-6 offset-6">
                   부서명 <inpu type="hidden"/>
                </div>
            </div>

        </div>
        
        
        </>
    );
};
export default DeptInsert;
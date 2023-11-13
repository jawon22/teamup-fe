import axios from "axios";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { companyState } from "../recoil";
import { useNavigate } from "react-router";

const CompanyJoin = ()=>{
    const [company, setCompany] = useRecoilState(companyState);
    const navigate = useNavigate();


    const [companyInfo, setCompanyInfo] = useState({
        comId:'',
        comPw:'',
    }
    );

    const changeInfo =(e)=>{
        setCompanyInfo({
            ...companyInfo,
            [e.target.name]:e.target.value
        })

    };


    const login = ()=>{
        axios({
            url:"http://localhost:8080/com/login",
            method:"post",
            data:companyInfo

        }).then(response=>{
            console.log(response.data)
            if(response.data===true){
                setCompany(companyInfo.comId)
                setTimeout(()=>{
                    navigate('/home');
                },1000);
            }
        });
    };


    return (

        <>
        <div className="container">
            <div className="row mt-4">
                <div className="col-8 offset-2">
                    <h1>회사 로그인</h1>
                </div>
            </div>


            <div className="row mt-4">
                <div className="col-8 offset-2">
                    아이디 <input type="text" className="form-control" name="comId" onChange={changeInfo} value={companyInfo.comId}/>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-8 offset-2">
                    비밀번호 <input type="text" className="form-control" name="comPw" onChange={changeInfo} value={companyInfo.comPw}/>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-8 offset-2">
                   <button className="btn btn-primary w-100" onClick={login}>로그인</button>
                </div>
            </div>

        </div>
        </>
    );
};
export default CompanyJoin;
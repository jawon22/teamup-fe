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
            url:`${process.env.REACT_APP_REST_API_URL}/com/login`,
            method:"post",
            data:companyInfo

        }).then(response=>{
            if(response.data ===false)return;
            if(response.data === true){
                setCompany(companyInfo.comId)

                sessionStorage.setItem("comId",companyInfo.comId);


                setTimeout(()=>{
                    navigate('/deptInsert');
                },1000);
            }
        })
    };


    return (

        <form autoComplete="off">
        <div className="container">
            <div className="row mt-5 pt-5">
                <div className="col-4 offset-4">
                    <div className="mb-3" style={{ textAlign: "center" }}>
                        <img src="img/TeamUpLogo.png" style={{ width: "25%", height: "20%" }} alt="TeamUp Logo" />
                    </div>
                </div>
            </div>


            <div className="row mt-5">
                <div className="col-4 offset-4">
                    <span>아이디</span> 
                    <input type="text" className="form-control" name="comId" onChange={changeInfo} value={companyInfo.comId}/>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-4 offset-4">
                    <span>비밀번호</span> 
                    <input type="text" className="form-control" name="comPw" onChange={changeInfo} value={companyInfo.comPw}/>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-4 offset-4">
                   <button type="button" className="btn btn-primary w-100" onClick={login}>회사 로그인</button>
                </div>
            </div>

        </div>
        </form>
    );
};
export default CompanyJoin;
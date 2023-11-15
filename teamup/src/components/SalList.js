import { useRecoilState } from 'recoil';
import React, { useEffect, useState } from "react";
import { userState } from '../recoil';
import axios from "axios";
import { useLocation } from 'react-router-dom'

const SalList=(prop)=>{
    const [user, setUser] = useRecoilState(userState);
    const location = useLocation();
    const empNo = user.substring(6)

    const [salList, setSalList] = useState({
        salListNo:"",
        empNo:"",
        salListTotal:"",
        salListHealth:"",
        salListLtcare:"",
        salListNational:"",
        salListEmp:"",
        salListWork:"",
        salListLocal:"",
    });



    const salDetail =()=>{
        //서버에서 급여내역 list 불러와서 state에 설정하는 코드 
        axios({
            url:`http://localhost:8080/salList/salListNo/249`,
            method:"get"
        })
        .then(response=>{
            console.log(response.data);
            setSalList(response.data);
        })
        .catch(err=>{ window.alert("통신 오류 발생"); });   
    };

    useEffect(()=>{
        salDetail();
    },[]);

    console.log("salList:", salList);




    return(

            <div className="row">
                <div className="col-md-10 offset-md-1">

                    <div className='row'> 
                        <div className='col-4'>
                            <div className='text-primary'>2023.11</div>
                        </div>
                    <div className='col-8'>
                        <h1 className='text-primary'>급여 명세서</h1>         
                    </div>
                    </div>

                    <hr className='border border-primary border-2'/>

                <div className='row ms-2'>
                    <div className='col-2'>
                        실수령액                        
                    </div>
                    <div className='col-7'>    
                    <hr className='text-primary'/>
                    </div>
                    <div className='col-3'>
                        <div>{salList.salListNo}</div>
                        <div>{salList.empNo}</div>
                        <div>{salList.salListTotal}</div>
                        <div>{salList.salListHealth}</div>
                        <div>{salList.salListLocal}</div>
                        <div>{salList.salListLtcare}</div>
                        <div>{salList.salListNational}</div>
                        <div>{salList.salListWork}</div>
                    </div>
                </div>



                    <div className="row">
                        <div className="col">
                                <table className="table table-bordered text-end">
                                    <thead>
                                        <tr>
                                            <th>총 지급액</th>
                                            <th>건강보험</th>
                                            <th>고용보험</th>
                                            <th>국민연금</th>
                                            <th>장기요양보험</th>
                                            <th>근로소득세</th>
                                            <th>지방소득세</th>
                                            <th>실수령액</th>
                                        </tr>
                                    </thead>
                                    <tbody>
   
                                        <tr >

                                        </tr>

                                       
                                    </tbody>
                                </table>
                        </div>
                    </div>

                </div>
            </div>

    );
};

export default SalList;
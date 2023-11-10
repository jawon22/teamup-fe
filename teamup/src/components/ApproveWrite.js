import { useState } from "react";
import { userState } from "../recoil";


const ApproveWrite = ()=>{
    const [receiver, setReceiver] = useState([]);
    const [referrer, setReferrer] = useState([]);
    
    return(
        <div classNameName="container-fluid">
            <div className="row">
                <div className="col-md-8 offset-md-2">

                    <h2 className="text-start">기안 상신</h2>

                    <div className="row">

                        <div className="border border-light col-8">
                            
                        </div>

                        <div className="border border-light col-4">
                            <span>결재자 지정</span>
                            <div className="border border-light">
                                <div className="row">
                                    <div className="col-8">
                                        <select className="form-select col">
                                            
                                        </select>

                                    </div>

                                    <div className="col-4">
                                        <button className="btn btn-primary">검색</button>
                                    </div>
                                </div>
                            </div>

                            <span className="my-2">참조자 지정</span>
                            <div className="border border-light">
                                <div className="row">
                                    <div className="col-8">
                                        <select className="form-select col"/>

                                    </div>

                                    <div className="col-4">
                                        <button className="btn btn-primary">검색</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
            </div>
        </div>
    );
};

export default ApproveWrite;
import { useRecoilState } from "recoil";
import { userState } from '../recoil';
import { useEffect, useState } from "react";
import axios from "axios";
import {MdCancel} from "react-icons/md";
import {BiEditAlt} from "react-icons/bi";
import {BiSolidPlusSquare} from "react-icons/bi";

const Todo=(prop)=>{
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)

    const [todoList, setTodoList] = useState([]);



    useEffect(()=>{
        axios({
            url:`http://localhost:8080/todo/list/${empNo}`,
            method:"get"
        }).then(response=>{
              setTodoList(response.data);
        }).catch(err=>{
            window.alert("통신오류발생")
        });
    },[]);



    return(
        
     <div className="container-fluid">
      <div className="row">
        <div className="col-md-10 offset-md-1">
            <div className="h3">오늘의 할일</div>

                <div className="row ">
                    <div className="col">
                        {todoList.map(todo=>(
                            <div className="col-12 fs-4 mb-2 ">
                                <span className="badge bg-primary me-2 h7">
                                   {todo.todoType}
                                </span>
                                {todo.todoContent}
                            </div>
                        ))}
                    </div>
                </div>
       
        </div>
      </div>
      </div>
    );
};
export default Todo;
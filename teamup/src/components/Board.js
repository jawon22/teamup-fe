import { useRecoilState } from "recoil";
import { companyState, userState } from "../recoil";
import { useEffect, useState } from "react";
import axios from "axios";
import { TfiPencil } from "react-icons/tfi";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { Pagination } from "react-bootstrap";

const Board =(props)=>{
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)
    const deptNo = user.substring(4, 6);
    const [comId] = useRecoilState(companyState);

    //모달---------------------------------
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //모달---------------------------------
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // 페이지당 항목 수
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // 화면 실행시, 페이지별 게시물 목록 및 전체 게시물 수를 가져오는 함수 호출
        boardListByCom();
        fetchTotalCount();
    }, [currentPage, pageSize]);

        // 백엔드에서 전체 게시물 수를 가져오는 함수
        const fetchTotalCount = () => {
            axios({
                url: `${process.env.REACT_APP_REST_API_URL}/board/totalCount/${comId}`,
                method: "get"
            })
            .then(response => {
                console.log("전체 게시물 수:", response.data);
                setTotalPages(Math.ceil(response.data / pageSize));
            })
            .catch(error => {
                console.error("전체 게시물 수를 가져오는 중 오류가 발생", error);
            });
        };

        // 화면 실행시 회사별 공지사항 리스트 출력
        const boardListByCom = () => {
            axios({
                url: `${process.env.REACT_APP_REST_API_URL}/board/listPaged/${comId}?page=${currentPage}&size=${pageSize}`,
                method: "get"
            })
            .then(response => {
                console.log("응답 데이터:", response.data);
                setBoardList(response.data);
            })
            .catch(error => {
                console.error("공지사항 목록을 가져오는 중 오류가 발생", error);
            });
        };


    //등록과 관련된 state
    const [board, setBoard] = useState({
        empNo:empNo, 
        comId:comId,  
        deptNo:deptNo,
        empName:"",
        deptName:"",
        boardTitle:"", boardContent:""
    });
    const changeBoard = (e) => {
        setBoard({
            ...board,
            [e.target.name] : e.target.value
        });
    };

    //등록창 초기화
    const clearBoard = () =>{
        setBoard({
            boardNo:"", empNo:"", comId:"",  deptNo:"",empName:"",deptName:"", boardTitle:"", boardContent:"", boardWriteDate:"", boardUpdateDate:"",
            boardReadCount:""
        });
    }

    //모달 속 등록버튼
    const addBoard = () => {

    
        // 새로운 게시글 정보 생성
        const newBoard = {
            empNo: empNo,
            comId: comId,
            deptNo: deptNo,
            empName:board.empName,
            deptName:board.deptName,
            boardTitle: board.boardTitle,
            boardContent: board.boardContent,
            boardWriteDate: "",
            boardUpdateDate: "", // 초기에는 null로 설정
            boardReadCount: "" // 초기에는 null로 설정
        };
    
        // Axios를 사용하여 서버에 데이터 전송
        axios.post(`${process.env.REACT_APP_REST_API_URL}/board/add`, newBoard)
            .then(response => {
                console.log("게시글 추가 성공:", response.data);                
                // 게시글 목록 갱신
                boardListByCom();       
                // 모달 닫기
                handleModalClose();
            })
            .catch(error => {
                console.error("게시글 추가 중 오류 발생", error);
            });
    };

    // 모달이 닫힐 때 실행될 함수
    const handleModalClose = () => {
    // 등록창 초기화
    clearBoard();
    // 모달 닫기
    handleClose();
};

const renderPagination = () => {
    if (totalPages <= 1) {
        return null; // 페이지가 1개 이하면 페이지네이션을 표시하지 않음
    }
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    return (
        <Pagination>
        {currentPage > 1 && (
            <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
            />
        )}

        {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => setCurrentPage(number + 1)}
            >
                {number + 1}
            </Pagination.Item>
        ))}

        {currentPage < totalPages && (
            <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
            />
        )}
    </Pagination>
    );
};
    


    return(

        <div className="row">
        <div className="col-md-10 offset-md-1">

            <div className="row mb-2">
                <div className="col-6">
                        <h2>공지사항</h2>
                </div>
                <div className="col-6 text-end">
                        <button className="btn btn-primary text-white"onClick={handleShow}>글쓰기<TfiPencil /></button>
                </div>
            </div>
                
            <div className="row">
                <div className="col">
                    <table className="table table-bordered ">
                        
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>작성자</th>
                                <th>부서</th>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>수정일</th>
                                <th>조회수</th>
                            </tr>
                        </thead> 
                        <tbody>
                            {boardList.map(board=>(
                            <tr key={board.boardNo}>
                                <td>{board.boardNo}</td>
                                <td>{board.empName}</td>
                                <td>{board.deptName}</td>
                                <td><Link to={`/board/find/${board.boardNo}`}>{board.boardTitle}</Link></td>
                                <td>{board.boardWriteDate}</td>
                                <td>{board.boardUpdateDate}</td>
                                <td>{board.boardReadCount}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                </div></div>
                <div className="row">
                    <div className="col d-flex justify-content-center">
                    {renderPagination()}

                    </div>
                </div>
            

            <Modal show={show} onHide={handleModalClose}>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>제목</Form.Label>
                <Form.Control
                    name="boardTitle"
                    type="text"
                    autoFocus
                value={board.boardTitle} onChange={changeBoard}
                />
                </Form.Group>
                <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
                >
                <Form.Label>내용</Form.Label>
                <Form.Control
                name="boardContent"
                value={board.boardContent} onChange={changeBoard}
                as="textarea" rows={10 } />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
                Close
            </Button>
            <Button variant="primary" onClick={addBoard}>
                등록
            </Button>
            </Modal.Footer>
        </Modal>



        </div></div>
    );
};
export default Board;
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from "react-router-dom";

function Post() {
    let {id} = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);
    let history = useHistory();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
          });

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
          });
    }, [id]);

    const addComment = () => {
        axios.post("http://localhost:3001/comments", {
            commentBody: newComment, PostId: id} , { 
            headers: { accessToken:localStorage.getItem("accessToken") }
        }).then((response => {
            if (response.data.error) {
                console.log(response.data.error);
            }  
            else {  
            const commentToAdd = {commentBody: newComment, username: response.data.username};
            setComments([...comments, commentToAdd]);
            setNewComment("");
            }
        }));
    }

    const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`, {
            headers: { accessToken:localStorage.getItem("accessToken") },          
        }).then(() => {
            setComments(comments.filter((val) => {
                return val.id !== id;
            }));
        });
    };

    const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`, {
           headers: { accessToken:localStorage.getItem("accessToken") },
        }).then(() => {
           alert("deleted");
           history.push("/");
        });      
    };

    const editPost = (option) =>{
        if (option === "title"){
            let newTitle = prompt("Enter new title:");
            axios.put("http://localhost:3001/posts/title", {newTitle: newTitle, id: id},{
                headers: { accessToken:localStorage.getItem("accessToken") },});
            setPostObject({...postObject, title: newTitle});
        }
        else {
            let newContent = prompt("Enter new text:");
            axios.put("http://localhost:3001/posts/content", {newText: newContent, id: id},{
                headers: { accessToken:localStorage.getItem("accessToken") },});
            setPostObject({...postObject, content: newContent});
        }
    };

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                  <div className="title" style={{cursor:'pointer'}} onClick={() => {
                      if (authState.username === postObject.UserUsername)
                      editPost("title");}}>
                   {postObject.title}
                  </div>
                  <div className="body" onClick={() => {
                      if (authState.username === postObject.UserUsername)
                      editPost("content");}}>
                    {postObject.content}
                  </div>
                  <div className="footer">
                      <div className="username">{"@"+postObject.UserUsername} </div>
                      {authState.username===postObject.username && 
                      <div className="buttons" onClick={() => deletePost(postObject.id)}><button> Delete </button></div>}             
                  </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input type="text" value={newComment} placeholder="Comments" autocomplete="off" onChange={(Event) => {setNewComment(Event.target.value)}}/>
                    <button onClick={addComment}> Add Comment </button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                        <div key ={key} className="comment">
                             "{comment.commentBody}" 
                             <label> From user: {comment.username} </label>
                             {authState.username === comment.username && <button onClick={() => deleteComment(comment.id)}> X </button>}
                        </div>                       
                        );
                    })}
                </div>
            </div>         
        </div>
    )
}

export default Post

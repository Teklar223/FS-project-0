import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
    const [listOfPosts, setListOfPosts]= useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    let { username } = useParams();
    let history = useHistory();
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")){
            history.push("/login");
          }

        axios.get(`https://full-stack-api-yonatan-ratner.herokuapp.com/user/basicinfo/${username}`).then((response)=>{
            console.log("RESPONSE: "+response.data);
            if (!response.data){history.push("/pagenotfound");}
        });
        
        axios.get(`https://full-stack-api-yonatan-ratner.herokuapp.com/posts/byuserid/${username}`).then((response)=>{
            setListOfPosts(response.data);
        });
        axios.get("https://full-stack-api-yonatan-ratner.herokuapp.com/posts", { headers: { accessToken: localStorage.getItem("accessToken")}}
        ).then((response) => {
          setLikedPosts(response.data.likedPosts.map((like) => {return like.PostId;}));
    });
    }, [history,username]);  

    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ LIKE SYSTEM ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
  const likePost = (postId) => {
    axios.post("https://full-stack-api-yonatan-ratner.herokuapp.com/likes", {PostId: postId}, { headers: { accessToken: localStorage.getItem("accessToken")}}
    ).then((response) => {
      setListOfPosts(listOfPosts.map((post) => {
        if (post.id === postId){
          if (response.data.liked) {return { ...post, Likes: [...post.Likes, 0] };}
          else {
            const likesArray = post.Likes;
            likesArray.pop();
            return { ...post, Likes: likesArray };
          }
        }
        else {return post;}
      }));
      if (likedPosts.includes(postId)) {setLikedPosts(likedPosts.filter((id)=>{return id !== postId}));}
      else {setLikedPosts([...likedPosts, postId]);}

    });
  };
  /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ LIKE SYSTEM ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/

    return (
        <div>
            <h2> Username: {username}</h2>
            {authState.username===username && 
            <button onClick={()=>{history.push("/reset_password")}}> Change My Password</button>}
            <h0></h0>         
            <h3>{username}'s posts:</h3>
            {listOfPosts.map((value, key) => {
        return (          
         <div key={key} className="post"> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>        
            <div className="title">{value.title} </div>
            <div className="body" onClick={() => {history.push(`/post/${value.id}`)}}>{value.content} </div>
            <div className="footer">
              <div className="username">{/*value.UserUsername*/}</div>
              <div className="buttons">              
                <ThumbUpAltIcon onClick={() => {likePost(value.id);}}               
                  className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn" }
                />
               <label>{value.Likes.length}</label>
              </div>
            </div>
         </div>
        );
      })}
      </div>
    )
}

export default Profile


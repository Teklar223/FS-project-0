import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

function Profile() {
    const [listOfPosts, setListOfPosts]= useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    let { username } = useParams();
    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")){
            history.push("/login");
          }

        axios.get(`http://localhost:3001/user/basicinfo/${username}`).then((response)=>{
            console.log("RESPONSE: "+response.data);
            if (!response.data){history.push("/pagenotfound");}
        });
        
        axios.get(`http://localhost:3001/posts/byuserid/${username}`).then((response)=>{
            setListOfPosts(response.data);
        });
        axios.get("http://localhost:3001/posts", { headers: { accessToken: localStorage.getItem("accessToken")}}
        ).then((response) => {
          setLikedPosts(response.data.likedPosts.map((like) => {return like.PostId;}));
    });
    }, [history,username]);  

    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ LIKE SYSTEM ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
  const likePost = (postId) => {
    axios.post("http://localhost:3001/likes", {PostId: postId}, { headers: { accessToken: localStorage.getItem("accessToken")}}
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
            <h0></h0>
            <h3>{username}'s posts:</h3>
            {listOfPosts.map((value, key) => {
        return (          
         <div key={key} className="post">         
            <div className="title">{value.title} </div>
            <div className="body" onClick={() => {history.push(`/post/${value.id}`)}}>{value.content} </div>
            <div className="footer">
              <div className="username">{value.UserUsername}</div>
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


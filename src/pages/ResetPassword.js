import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from "react-router-dom";

function ResetPassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    let history = useHistory();

    const resetPassword = () => {
        axios.put("http://localhost:3001/user/resetpassword",
        {oldPassword: oldPassword, newPassword: newPassword},
        { headers: { accessToken: localStorage.getItem("accessToken")}})
        .then((response)=>{
            if (response.data.error){
                alert(response.data.error);
            }
            else{
                alert("success!");
                history.push("/");
            }           
        });
    };

    return (
        <div>
           <h1 style={{"textDecoration":"underline"}}>Reset your password!</h1>
            <div>
               <h2>input old password for confirmation:</h2>
               <input type="password" placeholder="old password" onChange={(event)=>{setOldPassword(event.target.value)}}/>
            </div>
            <div>
               <h2>input your new password:</h2>
               <input type="password" placeholder="new password" onChange={(event)=>{setNewPassword(event.target.value)}}/>
            </div>                    
           <button onClick={resetPassword}> Save Changes </button>
        </div>
    )
}

export default ResetPassword

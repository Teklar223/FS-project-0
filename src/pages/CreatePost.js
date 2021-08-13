import React, {useContext, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
    // eslint-disable-next-line no-unused-vars
    const { authState } = useContext(AuthContext);
    const initalValues ={ title: "", postText: "",};
    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")){
            history.push("/login");
          }
    }, [history]);
      
    const onSubmit = (data) => {
        axios.post("http://localhost:3001/posts", data , { headers: { accessToken: localStorage.getItem("accessToken")}}).then((response) => {
            history.push("/")
          })
      };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("YOU MUST INPUT A TITLE"),
        content: Yup.string().required(),
      });

      

    return (
        <div className="createPostPage"> 
          <Formik initialValues={initalValues} onSubmit={onSubmit} validationSchema={validationSchema}>
              <Form className="formContainer">
                 <label>Title: </label>
                  <ErrorMessage name="title" component="span"/>
                  <Field id="inputCreatePost" name="title" placeholder="Write a Title!"/>
                 <label>Content: </label>
                  <ErrorMessage name="content" component="span"/>
                  <Field id="inputCreatePost" name="content" placeholder="Write your Content."/>              
                 <button type='submit'> create post!</button>
              </Form>
          </Formik>
        </div>
    )
}

export default CreatePost
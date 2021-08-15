import React from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from "react-router-dom";

function Registration() {
    let history = useHistory();
    const initalValues ={
        username:"",
        password:"",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(16).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
        axios.post("https://full-stack-api-yonatan-ratner.herokuapp.com/user", data).then(() => {
            console.log(data);
            alert("user registered!");
            history.push("/");
        });
    };

    //change to unique classNames with complementing CSS (createPostPage => registrationPage, inputCreatePost => inputRegistration)
    //consider also making a uniqe form for later changes such that formContainer => registerForm
    return (
        <div className="createPostPage">
          <Formik initialValues={initalValues} onSubmit={onSubmit} validationSchema={validationSchema}>
              <Form className="formContainer">           
                <label>Username: </label>
                  <ErrorMessage name="username" component="span"/>
                  <Field id="inputCreatePost" name="username" placeholder="Ex. John Doe"/>
                <label>Password: </label>
                  <ErrorMessage name="password" component="span"/>
                  <Field id="inputCreatePost" name="password" placeholder="Ex. 123654" type="password"/>
                <button type='submit'> Register</button>
              </Form>
          </Formik>
        </div>
    )
}

export default Registration

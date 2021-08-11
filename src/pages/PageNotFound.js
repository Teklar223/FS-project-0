import React from 'react';
import {Link} from "react-router-dom";

function PageNotFound() {
    return (
        <div>
            <h1>Page Not Found :( </h1>
            <div>
            <h3> Try this link:
               <Link style={{ color: "blue" }} to="/"> Home Page </Link>
            </h3>
            </div>
        </div>
    )
}

export default PageNotFound;

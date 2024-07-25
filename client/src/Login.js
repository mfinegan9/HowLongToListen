

//postgres

import React from 'react';
import { Container } from "react-bootstrap";

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=69b8e423003a4b428541484e7370d768&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

const Login = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <a className="btn btn-success btn-lg" href={AUTH_URL}>
                Login With Spotify
            </a>
        </Container>
    );
};

export default Login;







// import React from 'react'
// import { Container } from "react-bootstrap"

// const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=69b8e423003a4b428541484e7370d768&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

// export default function Login() {
//     return (
//         <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
//             <a className="btn btn-success btn-lg" href={AUTH_URL}>
//                 Login With Spotify
//             </a>
//         </Container>
//     )
// }




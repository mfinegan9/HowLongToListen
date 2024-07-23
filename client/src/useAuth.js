

import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
      .post("http://localhost:3007/login", { code })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        console.error("Error during login:", err);
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3007/refresh", { refreshToken })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((err) => {
          console.error("Error during token refresh:", err);
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
};

export default useAuth;





// //postgres


// import { useState, useEffect } from "react";
// import axios from "axios";

// const useAuth = (code) => {
//   const [accessToken, setAccessToken] = useState();
//   const [refreshToken, setRefreshToken] = useState();
//   const [expiresIn, setExpiresIn] = useState();

//   useEffect(() => {
//     axios
//       .post("http://localhost:3007/login", {
//         code,
//       })
//       .then((res) => {
//         setAccessToken(res.data.accessToken);
//         setRefreshToken(res.data.refreshToken);
//         setExpiresIn(res.data.expiresIn);
//         window.history.pushState({}, null, "/");
//       })
//       .catch(() => {
//         window.location = "/";
//       });
//   }, [code]);

//   useEffect(() => {
//     if (!refreshToken || !expiresIn) return;
//     const interval = setInterval(() => {
//       axios
//         .post("http://localhost:3007/refresh", {
//           refreshToken,
//         })
//         .then((res) => {
//           setAccessToken(res.data.accessToken);
//           setExpiresIn(res.data.expiresIn);
//         })
//         .catch(() => {
//           window.location = "/";
//         });
//     }, (expiresIn - 60) * 1000);

//     return () => clearInterval(interval);
//   }, [refreshToken, expiresIn]);

//   return accessToken;
// };

// export default useAuth;










// import { useState, useEffect } from "react"
// import axios from "axios"

// export default function useAuth(code) {
//   const [accessToken, setAccessToken] = useState()
//   const [refreshToken, setRefreshToken] = useState()
//   const [expiresIn, setExpiresIn] = useState()

//   useEffect(() => {
//     axios
//       .post("http://localhost:3007/login", {
//         code,
//       })
//       .then(res => {
//         setAccessToken(res.data.accessToken)
//         setRefreshToken(res.data.refreshToken)
//         setExpiresIn(res.data.expiresIn)
//         window.history.pushState({}, null, "/")
//       })
//       .catch(() => {
//         window.location = "/"
//       })
//   }, [code])




  
// // //   useEffect(() => {
// // //     if (!refreshToken || !expiresIn) return
// // //     axios
// // //       .post("http://localhost:3009/refresh", {
// // //         refreshToken,
// // //       })
// // //       .then(res => {
// // //         setAccessToken(res.data.accessToken)
// // //         setExpiresIn(res.data.expiresIn)
// // //       })
// // //       .catch(() => {
// // //         window.location = "/"
// // //       })

// // //   }, [refreshToken, expiresIn])


// useEffect(() => {
//     if (!refreshToken || !expiresIn) return
//     const interval = setInterval(() => {
//       axios
//         .post("http://localhost:3007/refresh", {
//           refreshToken,
//         })
//         .then(res => {
//           setAccessToken(res.data.accessToken)
//           setExpiresIn(res.data.expiresIn)
//         })
//         .catch(() => {
//           window.location = "/"
//         })
//     }, (expiresIn - 60) * 1000)

//     return () => clearInterval(interval)
//   }, [refreshToken, expiresIn])



// return accessToken

// }
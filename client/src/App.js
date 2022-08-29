import { useEffect, useState } from "react";
import { access_token, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./utils";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import styled from "styled-components/macro";
import { logout } from "./spotify";

// Scroll to top of page when changing routes
// https://reactrouter.com/web/guides/scroll-restoration/scroll-to-top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const StyledLoginButton = styled.a`
  background-color: green;
  color: white;
  padding: 10px 20px;
  margin: 20px auto;
  border-radius: 30px;
  display: inline-block;
`;

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(access_token);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      console.log(data);
      setProfile(data);
    };
    // fetchData();
    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      {/* <GlobalStyle> */}
      <header className="App-header">
        {!token ? (
          <StyledLoginButton href="http://localhost:8888/login">
            Log in to Spotify
          </StyledLoginButton>
        ) : (
          <div>
            <h1 style={{ color: "white" }}>Logged In</h1>
            <button onClick={logout}>Log Out</button>
            {profile && (
              <div>
                <h1>{profile.display_name}</h1>
                <p>{profile.followers.total} Followers</p>
                <img src={profile.images[0].url} alt="Avater" />
              </div>
            )}
          </div>
          // <BrowserRouter>
          //   <ScrollToTop />
          //   <Routes>
          //     <Route path="/top-artists" element={<h1>top artists</h1>}></Route>
          //     <Route path="/top-tracks" element={<h1>top tracks</h1>}></Route>
          //     <Route
          //       path="/playlists/:id"
          //       element={<h1>playlists:id</h1>}
          //     ></Route>
          //     <Route path="/playlists" element={<h1>playlists</h1>}></Route>
          //     <Route path="/login" element={<h1>Log in page</h1>}></Route>
          //     <Route path="/" element={<h1>home</h1>}></Route>
          //   </Routes>
          // </BrowserRouter>
        )}
      </header>
      {/* </GlobalStyle> */}
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { access_token, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./utils";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import styled from "styled-components/macro";
import { logout } from "./spotify";
import {
  Login,
  Profile,
  TopArtists,
  TopTracks,
  Playlists,
  Playlist,
} from "./pages";

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

// Scroll to top of page when changing routes
// https://reactrouter.com/web/guides/scroll-restoration/scroll-to-top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(access_token);
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <>
            {/* Keep this outside of Router so it appears on each page */}
            <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route
                  path="/top-artists"
                  element={
                    <div>
                      <TopArtists />
                    </div>
                  }
                ></Route>
                <Route
                  path="/top-tracks"
                  element={
                    <div>
                      <TopTracks />
                    </div>
                  }
                ></Route>
                <Route
                  path="/playlists/:id"
                  element={
                    <div>
                      <Playlist />
                    </div>
                  }
                ></Route>
                <Route
                  path="/playlists"
                  element={
                    <div>
                      <Playlists />
                    </div>
                  }
                ></Route>
                <Route path="/login" element={<h1>Log in page</h1>}></Route>
                <Route
                  path="/"
                  element={
                    <div>
                      <Profile />
                    </div>
                  }
                ></Route>
              </Routes>
            </BrowserRouter>
          </>
        )}
      </header>
    </div>
  );
}

export default App;

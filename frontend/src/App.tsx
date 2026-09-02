import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { AppLayout } from './layouts/AppLayout';

import { LoginPage } from './pages/Auth/LoginPage';
import { SplashPage } from './pages/Auth/SplashPage';

import { HomePage } from './pages/Home/HomePage';

import { UserCreatePage } from './pages/Users/UserCreatePage';
import { UserEditPage } from './pages/Users/UserEditPage';
import { UsersPage } from './pages/Users/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===================================================
            ENTRADA DA APLICAÇÃO
            =================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/splash"
              replace
            />
          }
        />

        {/* ===================================================
            SPLASH
            =================================================== */}

        <Route
          path="/splash"
          element={
            <SplashPage />
          }
        />

        {/* ===================================================
            LOGIN
            =================================================== */}

        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />

        {/* ===================================================
            ÁREA INTERNA
            =================================================== */}

        <Route
          element={
            <AppLayout />
          }
        >
          <Route
            path="/home"
            element={
              <HomePage />
            }
          />

          <Route
            path="/users"
            element={
              <UsersPage />
            }
          />

          <Route
            path="/users/new"
            element={
              <UserCreatePage />
            }
          />

          <Route
            path="/users/:id/edit"
            element={
              <UserEditPage />
            }
          />
        </Route>

        {/* ===================================================
            ROTA NÃO ENCONTRADA
            =================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/splash"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/Home/HomePage';
import { UserCreatePage } from './pages/Users/UserCreatePage';
import { UserEditPage } from './pages/Users/UserEditPage';
import { UsersPage } from './pages/Users/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/users"
            element={<UsersPage />}
          />

          <Route
            path="/users/new"
            element={<UserCreatePage />}
          />

          <Route
            path="/users/:id/edit"
            element={<UserEditPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
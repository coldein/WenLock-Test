import { NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div>
      <aside>
        <h1>WenLock</h1>

        <nav>
          <NavLink to="/">
            Home
          </NavLink>

          <NavLink to="/users">
            Usuários
          </NavLink>
        </nav>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
import {
  Home,
  UsersRound,
} from 'lucide-react';
import {
  NavLink,
  Outlet,
} from 'react-router-dom';

import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            W
          </div>

          <span className={styles.brandName}>
            WenLock
          </span>
        </div>

        <nav className={styles.navigation}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''
              }`
            }
          >
            <Home size={20} />

            <span>Home</span>
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''
              }`
            }
          >
            <UsersRound size={20} />

            <span>Usuários</span>
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <span>
            WenLock Test
          </span>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
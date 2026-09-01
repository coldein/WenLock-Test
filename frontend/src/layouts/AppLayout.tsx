import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  KeyRound,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import {
  NavLink,
  Outlet,
} from 'react-router-dom';

import styles from './AppLayout.module.css';

export function AppLayout() {
  const [collapsed, setCollapsed] =
    useState(false);

  const [accessOpen, setAccessOpen] =
    useState(true);

  return (
    <div className={styles.layout}>
      <aside
        className={`${styles.sidebar} ${
          collapsed ? styles.collapsed : ''
        }`}
      >
        <div className={styles.brand}>
          <img
            className={
              collapsed
                ? styles.logoCollapsed
                : styles.logoExpanded
            }
            src={
              collapsed
                ? '/assets/wenlock-collapsed.svg'
                : '/assets/wenlock-expanded.svg'
            }
            alt="WenLock"
          />
        </div>

        <button
          type="button"
          className={styles.collapseButton}
          onClick={() =>
            setCollapsed((current) => !current)
          }
          aria-label={
            collapsed
              ? 'Expandir menu'
              : 'Recolher menu'
          }
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

        <nav className={styles.navigation}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ''
              }`
            }
          >
            <Home size={18} />

            {!collapsed && (
              <span>Home</span>
            )}
          </NavLink>

          <div className={styles.menuGroup}>
            {!collapsed && (
              <button
                type="button"
                className={styles.menuGroupTitle}
                onClick={() =>
                  setAccessOpen(
                    (current) => !current,
                  )
                }
                aria-expanded={accessOpen}
              >
                <div
                  className={
                    styles.menuGroupContent
                  }
                >
                  <KeyRound size={17} />

                  <span>
                    Controle de Acesso
                  </span>
                </div>

                <ChevronDown
                  size={15}
                  className={`${
                    styles.menuChevron
                  } ${
                    accessOpen
                      ? styles.menuChevronOpen
                      : ''
                  }`}
                />
              </button>
            )}

            {!collapsed && accessOpen && (
              <div
                className={
                  styles.subMenuContainer
                }
              >
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `${
                      styles.subMenuItem
                    } ${
                      isActive
                        ? styles.subMenuActive
                        : ''
                    }`
                  }
                >
                  <UserRound size={17} />

                  <span>Usuários</span>
                </NavLink>
              </div>
            )}

            {collapsed && (
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `${styles.navItem} ${
                    isActive
                      ? styles.active
                      : ''
                  }`
                }
                aria-label="Usuários"
                title="Usuários"
              >
                <UserRound size={18} />
              </NavLink>
            )}
          </div>
        </nav>

        {!collapsed && (
          <footer
            className={styles.sidebarFooter}
          >
            <strong>© WenLock</strong>

            <span>
              Power by Conecthus
            </span>

            <span>V 0.0.0</span>
          </footer>
        )}
      </aside>

      <div
        className={`${styles.workspace} ${
          collapsed
            ? styles.workspaceCollapsed
            : ''
        }`}
      >
        <header className={styles.topbar}>
          <div />

          <div className={styles.profile}>
            <div className={styles.avatar}>
              MS
            </div>

            <span
              className={
                styles.onlineIndicator
              }
            />
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
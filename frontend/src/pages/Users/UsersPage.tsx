import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  useEffect,
  useState,
} from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { usersService } from '../../services/users.service';

import type {
  PaginationMeta,
  User,
} from '../../types/user';

import styles from './UsersPage.module.css';

const DEFAULT_PAGE_SIZE = 15;

const EMPTY_META: PaginationMeta = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  totalItems: 0,
  totalPages: 0,
};

export function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] =
    useState<User[]>([]);

  const [meta, setMeta] =
    useState<PaginationMeta>(
      EMPTY_META,
    );

  const [page, setPage] =
    useState(1);

  const [search, setSearch] =
    useState('');

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState('');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Pesquisa automática com debounce.
   * Evita uma chamada à API a cada tecla digitada.
   */
  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        setPage(1);
        setDebouncedSearch(
          search.trim(),
        );
      },
      350,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  /*
   * Busca usuários sempre que a página
   * ou o termo pesquisado mudar.
   */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await usersService.findAll({
            page,
            limit: DEFAULT_PAGE_SIZE,
            name:
              debouncedSearch ||
              undefined,
          });

        setUsers(response.data);
        setMeta(response.meta);
      } catch {
        setError(
          'Não foi possível carregar os usuários.',
        );

        setUsers([]);
        setMeta(EMPTY_META);
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, [page, debouncedSearch]);

  const handlePreviousPage = () => {
    if (page <= 1) {
      return;
    }

    setPage(
      (current) => current - 1,
    );
  };

  const handleNextPage = () => {
    if (
      meta.totalPages === 0 ||
      page >= meta.totalPages
    ) {
      return;
    }

    setPage(
      (current) => current + 1,
    );
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.pageTitle}>
        Usuários
      </h1>

      <div className={styles.toolbar}>
        <div
          className={
            styles.searchWrapper
          }
        >
          <Search
            size={17}
            className={
              styles.searchIcon
            }
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Pesquisa"
            className={
              styles.searchInput
            }
            aria-label="Pesquisar usuário por nome"
          />
        </div>

        <Link
          to="/users/new"
          className={
            styles.createButton
          }
        >
          <Plus size={17} />

          Cadastrar Usuário
        </Link>
      </div>

      {error && (
        <div
          className={
            styles.errorMessage
          }
        >
          {error}
        </div>
      )}

      <div
        className={
          styles.tableContainer
        }
      >
        <table
          className={styles.table}
        >
          <thead>
            <tr>
              <th>Nome</th>

              <th
                className={
                  styles.actionsHeader
                }
              >
                Ações
              </th>
            </tr>
          </thead>

          {!loading &&
            users.length > 0 && (
              <tbody>
                {users.map(
                  (user) => (
                    <tr key={user.id}>
                      <td>
                        {user.name}
                      </td>

                      <td
                        className={
                          styles.actions
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles.actionButton
                          }
                          title="Visualizar"
                          aria-label={`Visualizar ${user.name}`}
                        >
                          <Eye
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          className={
                            styles.actionButton
                          }
                          title="Editar"
                          aria-label={`Editar ${user.name}`}
                          onClick={() =>
                            navigate(
                              `/users/${user.id}/edit`,
                            )
                          }
                        >
                          <Pencil
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          className={
                            styles.actionButton
                          }
                          title="Excluir"
                          aria-label={`Excluir ${user.name}`}
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            )}
        </table>

        {loading && (
          <div
            className={
              styles.loadingState
            }
          >
            Carregando usuários...
          </div>
        )}

        {!loading &&
          !error &&
          users.length === 0 && (
            <div
              className={
                styles.emptyState
              }
            >
              <img
                className={
                  styles.emptyIllustration
                }
                src="/assets/no-results.svg"
                alt=""
                aria-hidden="true"
              />

              <h2
                className={
                  styles.emptyTitle
                }
              >
                Nenhum Resultado
                Encontrado
              </h2>

              <p
                className={
                  styles.emptyDescription
                }
              >
                Não foi possível achar
                nenhum resultado para sua
                busca.
                <br />
                Tente refazer a pesquisa
                para encontrar o que busca.
              </p>
            </div>
          )}
      </div>

      {!loading &&
        meta.totalPages > 1 && (
          <div
            className={
              styles.pagination
            }
          >
            <button
              type="button"
              className={
                styles.paginationButton
              }
              onClick={
                handlePreviousPage
              }
              disabled={page <= 1}
              aria-label="Página anterior"
            >
              <ChevronLeft
                size={16}
              />
            </button>

            <span
              className={
                styles.currentPage
              }
            >
              {meta.page}
            </span>

            <button
              type="button"
              className={
                styles.paginationButton
              }
              onClick={
                handleNextPage
              }
              disabled={
                page >=
                meta.totalPages
              }
              aria-label="Próxima página"
            >
              <ChevronRight
                size={16}
              />
            </button>
          </div>
        )}
    </section>
  );
}
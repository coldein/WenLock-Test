import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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

import { UserDeleteModal } from './UserDeleteModal';
import { UserViewDrawer } from './UserViewDrawer';

import styles from './UsersPage.module.css';

const DEFAULT_PAGE_SIZE = 15;

const EMPTY_META: PaginationMeta = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  totalItems: 0,
  totalPages: 0,
};

interface ApiErrorResponse {
  message?: string | string[];
}

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
   * Incrementamos este valor quando
   * precisamos recarregar a mesma página.
   */
  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  /*
   * Usuário selecionado para visualização.
   */
  const [
    viewingUserId,
    setViewingUserId,
  ] = useState<number | null>(
    null,
  );

  /*
   * Usuário selecionado para exclusão.
   */
  const [
    userToDelete,
    setUserToDelete,
  ] = useState<User | null>(
    null,
  );

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = useState<string | null>(
    null,
  );

  /*
   * Pesquisa automática com debounce.
   */
  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          setPage(1);

          setDebouncedSearch(
            search.trim(),
          );
        },
        350,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [search]);

  /*
   * Carrega a listagem.
   */
  useEffect(() => {
    const loadUsers =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const response =
            await usersService.findAll(
              {
                page,
                limit:
                  DEFAULT_PAGE_SIZE,
                name:
                  debouncedSearch ||
                  undefined,
              },
            );

          setUsers(
            response.data,
          );

          setMeta(
            response.meta,
          );
        } catch {
          setError(
            'Não foi possível carregar os usuários.',
          );

          setUsers([]);

          setMeta(
            EMPTY_META,
          );
        } finally {
          setLoading(false);
        }
      };

    void loadUsers();
  }, [
    page,
    debouncedSearch,
    refreshKey,
  ]);

  /*
   * Primeira página.
   */
  const handleFirstPage = () => {
    if (page <= 1) {
      return;
    }

    setPage(1);
  };

  /*
   * Página anterior.
   */
  const handlePreviousPage =
    () => {
      if (page <= 1) {
        return;
      }

      setPage(
        (current) =>
          current - 1,
      );
    };

  /*
   * Próxima página.
   */
  const handleNextPage =
    () => {
      if (
        meta.totalPages === 0 ||
        page >= meta.totalPages
      ) {
        return;
      }

      setPage(
        (current) =>
          current + 1,
      );
    };

  /*
   * Última página.
   */
  const handleLastPage = () => {
    if (
      meta.totalPages === 0 ||
      page >= meta.totalPages
    ) {
      return;
    }

    setPage(
      meta.totalPages,
    );
  };

  /*
   * Abre o drawer de visualização.
   */
  const handleOpenView = (
    userId: number,
  ) => {
    setViewingUserId(
      userId,
    );
  };

  /*
   * Fecha o drawer.
   */
  const handleCloseView =
    () => {
      setViewingUserId(
        null,
      );
    };

  /*
   * Abre confirmação de exclusão.
   */
  const handleOpenDelete = (
    user: User,
  ) => {
    setDeleteError(null);

    setUserToDelete(user);
  };

  /*
   * Fecha confirmação de exclusão.
   */
  const handleCloseDelete =
    () => {
      if (deleting) {
        return;
      }

      setUserToDelete(null);
      setDeleteError(null);
    };

  /*
   * Confirma exclusão.
   */
  const handleConfirmDelete =
    async () => {
      if (!userToDelete) {
        return;
      }

      try {
        setDeleting(true);
        setDeleteError(null);

        await usersService.remove(
          userToDelete.id,
        );

        /*
         * Se excluímos o último registro
         * da página e não estamos na primeira,
         * voltamos uma página.
         */
        const shouldGoBack =
          users.length === 1 &&
          page > 1;

        setUserToDelete(
          null,
        );

        if (shouldGoBack) {
          setPage(
            (current) =>
              current - 1,
          );

          return;
        }

        /*
         * Recarrega a página atual.
         */
        setRefreshKey(
          (current) =>
            current + 1,
        );
      } catch (
      requestError: unknown
      ) {
        if (
          axios.isAxiosError<ApiErrorResponse>(
            requestError,
          )
        ) {
          const apiMessage =
            requestError
              .response
              ?.data
              ?.message;

          if (
            typeof apiMessage ===
            'string'
          ) {
            setDeleteError(
              apiMessage,
            );

            return;
          }

          if (
            Array.isArray(
              apiMessage,
            )
          ) {
            setDeleteError(
              apiMessage.join(
                '. ',
              ),
            );

            return;
          }
        }

        setDeleteError(
          'Não foi possível excluir o usuário.',
        );
      } finally {
        setDeleting(false);
      }
    };

  return (
    <section
      className={styles.page}
    >
      <h1
        className={
          styles.pageTitle
        }
      >
        Usuários
      </h1>

      <div
        className={
          styles.toolbar
        }
      >
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
          className={
            styles.table
          }
        >
          <thead>
            <tr>
              <th>
                Nome
              </th>

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
                    <tr
                      key={user.id}
                    >
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
                          onClick={() =>
                            handleOpenView(
                              user.id,
                            )
                          }
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
                          onClick={() =>
                            handleOpenDelete(
                              user,
                            )
                          }
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
                Nenhum Resultado Encontrado
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
        !error &&
        meta.totalItems > 0 && (
          <div
            className={
              styles.paginationBar
            }
          >
            <div
              className={
                styles.paginationSummary
              }
            >
              <span>
                Total de itens{' '}
              </span>

              <strong>
                {meta.totalItems}
              </strong>
            </div>

            <div
              className={
                styles.paginationControls
              }
            >
              <div
                className={
                  styles.pageSize
                }
              >
                <span>
                  Itens por página
                </span>

                <strong>
                  {meta.limit}
                </strong>
              </div>

              <div
                className={
                  styles.paginationNavigation
                }
              >
                <button
                  type="button"
                  className={
                    styles.paginationIconButton
                  }
                  onClick={
                    handleFirstPage
                  }
                  disabled={
                    page <= 1
                  }
                  aria-label="Primeira página"
                  title="Primeira página"
                >
                  <ChevronsLeft
                    size={15}
                  />
                </button>

                <button
                  type="button"
                  className={
                    styles.paginationIconButton
                  }
                  onClick={
                    handlePreviousPage
                  }
                  disabled={
                    page <= 1
                  }
                  aria-label="Página anterior"
                  title="Página anterior"
                >
                  <ChevronLeft
                    size={15}
                  />
                </button>

                <span
                  className={
                    styles.currentPage
                  }
                  aria-label={`Página atual ${meta.page}`}
                >
                  {meta.page}
                </span>

                <button
                  type="button"
                  className={
                    styles.paginationIconButton
                  }
                  onClick={
                    handleNextPage
                  }
                  disabled={
                    meta.totalPages ===
                    0 ||
                    page >=
                    meta.totalPages
                  }
                  aria-label="Próxima página"
                  title="Próxima página"
                >
                  <ChevronRight
                    size={15}
                  />
                </button>

                <button
                  type="button"
                  className={
                    styles.paginationIconButton
                  }
                  onClick={
                    handleLastPage
                  }
                  disabled={
                    meta.totalPages ===
                    0 ||
                    page >=
                    meta.totalPages
                  }
                  aria-label="Última página"
                  title="Última página"
                >
                  <ChevronsRight
                    size={15}
                  />
                </button>
              </div>

              <div
                className={
                  styles.totalPages
                }
              >
                <span>
                  de
                </span>

                <strong>
                  {meta.totalPages}
                </strong>
              </div>
            </div>
          </div>
        )}

      <UserViewDrawer
        userId={viewingUserId}
        onClose={
          handleCloseView
        }
      />

      <UserDeleteModal
        user={userToDelete}
        deleting={deleting}
        error={deleteError}
        onCancel={
          handleCloseDelete
        }
        onConfirm={() => {
          void handleConfirmDelete();
        }}
      />
    </section>
  );
}
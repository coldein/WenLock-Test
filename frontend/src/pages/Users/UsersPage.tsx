import axios from 'axios';
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
   * Guardamos somente o ID porque o drawer
   * consulta os dados atualizados na API.
   */
  const [
    viewingUserId,
    setViewingUserId,
  ] = useState<number | null>(
    null,
  );

  /*
   * Usuário atualmente selecionado
   * para exclusão.
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

  const handleNextPage =
    () => {
      if (
        meta.totalPages === 0 ||
        page >=
          meta.totalPages
      ) {
        return;
      }

      setPage(
        (current) =>
          current + 1,
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
   * Fecha o drawer de visualização.
   */
  const handleCloseView =
    () => {
      setViewingUserId(
        null,
      );
    };

  const handleOpenDelete = (
    user: User,
  ) => {
    setDeleteError(null);

    setUserToDelete(user);
  };

  const handleCloseDelete =
    () => {
      if (deleting) {
        return;
      }

      setUserToDelete(null);
      setDeleteError(null);
    };

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
         * Se removemos o último item
         * de uma página diferente da
         * primeira, voltamos uma página.
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
         * Caso contrário, recarregamos
         * a página atual.
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
            onChange={(
              event,
            ) =>
              setSearch(
                event
                  .target
                  .value,
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
                      key={
                        user.id
                      }
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
              disabled={
                page <= 1
              }
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
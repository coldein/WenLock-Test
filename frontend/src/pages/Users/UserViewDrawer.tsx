import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { usersService } from '../../services/users.service';
import type { User } from '../../types/user';

import styles from './UserViewDrawer.module.css';

interface UserViewDrawerProps {
    userId: number | null;
    onClose: () => void;
}

function formatDate(
    date: string,
): string {
    return new Intl.DateTimeFormat(
        'pt-BR',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        },
    ).format(new Date(date));
}

function getLastEdition(
    user: User,
): string {
    const createdAt = new Date(
        user.createdAt,
    ).getTime();

    const updatedAt = new Date(
        user.updatedAt,
    ).getTime();

    const wasEdited =
        Math.abs(
            updatedAt - createdAt,
        ) > 1000;

    if (!wasEdited) {
        return 'Nenhuma';
    }

    return formatDate(
        user.updatedAt,
    );
}

export function UserViewDrawer({
    userId,
    onClose,
}: UserViewDrawerProps) {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (userId === null) {
            setUser(null);
            setError(null);
            return;
        }

        const loadUser =
            async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const response =
                        await usersService.findOne(
                            userId,
                        );

                    setUser(response);
                } catch {
                    setError(
                        'Não foi possível carregar os dados do usuário.',
                    );
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };

        void loadUser();
    }, [userId]);

    useEffect(() => {
        if (userId === null) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener(
            'keydown',
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            );
        };
    }, [userId, onClose]);

    if (userId === null) {
        return null;
    }

    return (
        <div
            className={styles.backdrop}
            role="presentation"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <aside
                className={styles.drawer}
                role="dialog"
                aria-modal="true"
                aria-labelledby="view-user-title"
            >
                <header className={styles.header}>
                    <h2
                        id="view-user-title"
                        className={styles.title}
                    >
                        Visualizar Usuário
                    </h2>

                    <button
                        type="button"
                        className={
                            styles.closeButton
                        }
                        onClick={onClose}
                        aria-label="Fechar visualização"
                    >
                        <X size={25} />
                    </button>
                </header>

                <div className={styles.body}>
                    {loading && (
                        <div
                            className={
                                styles.loading
                            }
                        >
                            Carregando usuário...
                        </div>
                    )}

                    {!loading && error && (
                        <div
                            className={styles.error}
                        >
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        user && (
                            <div
                                className={
                                    styles.content
                                }
                            >
                                <section
                                    className={
                                        styles.section
                                    }
                                >
                                    <div
                                        className={
                                            styles.sectionTitle
                                        }
                                    >
                                        <span>
                                            Dados do Usuário
                                        </span>
                                        <div />
                                    </div>

                                    <div
                                        className={
                                            styles.userGrid
                                        }
                                    >
                                        <div
                                            className={
                                                styles.field
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.label
                                                }
                                            >
                                                Nome
                                            </span>
                                            <strong>
                                                {user.name}
                                            </strong>
                                        </div>

                                        <div
                                            className={
                                                styles.field
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.label
                                                }
                                            >
                                                Matrícula
                                            </span>
                                            <strong>
                                                {
                                                    user.registration
                                                }
                                            </strong>
                                        </div>

                                        <div
                                            className={`${styles.field} ${styles.emailField}`}
                                        >
                                            <span
                                                className={
                                                    styles.label
                                                }
                                            >
                                                E-mail
                                            </span>
                                            <strong>
                                                {user.email}
                                            </strong>
                                        </div>
                                    </div>
                                </section>

                                <section
                                    className={
                                        styles.section
                                    }
                                >
                                    <div
                                        className={
                                            styles.sectionTitle
                                        }
                                    >
                                        <span>
                                            Detalhes
                                        </span>
                                        <div />
                                    </div>

                                    <div
                                        className={
                                            styles.detailsGrid
                                        }
                                    >
                                        <div
                                            className={
                                                styles.field
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.label
                                                }
                                            >
                                                Data de criação
                                            </span>
                                            <strong>
                                                {formatDate(
                                                    user.createdAt,
                                                )}
                                            </strong>
                                        </div>

                                        <div
                                            className={
                                                styles.field
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.label
                                                }
                                            >
                                                Última edição
                                            </span>
                                            <strong>
                                                {getLastEdition(
                                                    user,
                                                )}
                                            </strong>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                </div>

                <footer className={styles.footer}>
                    <button
                        type="button"
                        className={
                            styles.footerCloseButton
                        }
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </footer>
            </aside>
        </div>
    );
}
import {
    Trash2,
    X,
} from 'lucide-react';
import { useEffect } from 'react';

import type { User } from '../../types/user';

import styles from './UserDeleteModal.module.css';

interface UserDeleteModalProps {
    user: User | null;
    deleting: boolean;
    error: string | null;
    onCancel: () => void;
    onConfirm: () => void;
}

export function UserDeleteModal({
    user,
    deleting,
    error,
    onCancel,
    onConfirm,
}: UserDeleteModalProps) {
    useEffect(() => {
        if (!user) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (
                event.key === 'Escape' &&
                !deleting
            ) {
                onCancel();
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
    }, [
        user,
        deleting,
        onCancel,
    ]);

    if (!user) {
        return null;
    }

    return (
        <div
            className={
                styles.backdrop
            }
            role="presentation"
            onMouseDown={(event) => {
                if (
                    event.target ===
                        event.currentTarget &&
                    !deleting
                ) {
                    onCancel();
                }
            }}
        >
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-user-title"
            >
                <button
                    type="button"
                    className={
                        styles.closeButton
                    }
                    onClick={onCancel}
                    disabled={deleting}
                    aria-label="Fechar"
                >
                    <X size={18} />
                </button>

                <div
                    className={
                        styles.iconContainer
                    }
                >
                    <Trash2 size={24} />
                </div>

                <h2
                    id="delete-user-title"
                    className={
                        styles.title
                    }
                >
                    Excluir Usuário
                </h2>

                <p
                    className={
                        styles.description
                    }
                >
                    Tem certeza que deseja
                    excluir o usuário
                    <strong>
                        {' '}
                        {user.name}
                    </strong>
                    ?
                </p>

                <p
                    className={
                        styles.warning
                    }
                >
                    Esta ação não poderá ser
                    desfeita.
                </p>

                {error && (
                    <div
                        className={
                            styles.error
                        }
                    >
                        {error}
                    </div>
                )}

                <div
                    className={
                        styles.actions
                    }
                >
                    <button
                        type="button"
                        className={
                            styles.cancelButton
                        }
                        onClick={onCancel}
                        disabled={deleting}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className={
                            styles.deleteButton
                        }
                        onClick={onConfirm}
                        disabled={deleting}
                    >
                        <Trash2
                            size={16}
                        />

                        {deleting
                            ? 'Excluindo...'
                            : 'Excluir'}
                    </button>
                </div>
            </div>
        </div>
    );
}
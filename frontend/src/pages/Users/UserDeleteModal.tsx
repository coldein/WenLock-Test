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
            className={styles.backdrop}
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
                aria-describedby="delete-user-description"
            >
                <h2
                    id="delete-user-title"
                    className={styles.title}
                >
                    Deseja excluir?
                </h2>

                <p
                    id="delete-user-description"
                    className={styles.description}
                >
                    O usuário será excluído.
                </p>

                {error && (
                    <div
                        className={styles.error}
                    >
                        {error}
                    </div>
                )}

                <div
                    className={styles.actions}
                >
                    <button
                        type="button"
                        className={
                            styles.cancelButton
                        }
                        onClick={onCancel}
                        disabled={deleting}
                    >
                        Não
                    </button>

                    <button
                        type="button"
                        className={
                            styles.confirmButton
                        }
                        onClick={onConfirm}
                        disabled={deleting}
                    >
                        {deleting
                            ? 'Excluindo...'
                            : 'Sim'}
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useEffect } from 'react';

import styles from './UserCancelModal.module.css';

interface UserCancelModalProps {
    open: boolean;
    message?: string;
    onClose: () => void;
    onConfirm: () => void;
}

export function UserCancelModal({
    open,
    message = 'Os dados inseridos não serão salvos',
    onClose,
    onConfirm,
}: UserCancelModalProps) {
    useEffect(() => {
        if (!open) {
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
    }, [open, onClose]);

    if (!open) {
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
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cancel-title"
                aria-describedby="cancel-description"
            >
                <h2
                    id="cancel-title"
                    className={styles.title}
                >
                    Deseja cancelar?
                </h2>

                <p
                    id="cancel-description"
                    className={
                        styles.description
                    }
                >
                    {message}
                </p>

                <div
                    className={styles.actions}
                >
                    <button
                        type="button"
                        className={
                            styles.noButton
                        }
                        onClick={onClose}
                    >
                        Não
                    </button>

                    <button
                        type="button"
                        className={
                            styles.yesButton
                        }
                        onClick={onConfirm}
                    >
                        Sim
                    </button>
                </div>
            </div>
        </div>
    );
}
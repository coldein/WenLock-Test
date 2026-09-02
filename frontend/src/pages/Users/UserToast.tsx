import {
    Check,
    TriangleAlert,
    X,
} from 'lucide-react';
import { useEffect } from 'react';

import styles from './UserToast.module.css';

export type UserToastType =
    | 'success'
    | 'warning';

interface UserToastProps {
    type: UserToastType;
    message: string;
    onClose: () => void;
}

export function UserToast({
    type,
    message,
    onClose,
}: UserToastProps) {
    useEffect(() => {
        const timeout =
            window.setTimeout(
                onClose,
                4000,
            );

        return () => {
            window.clearTimeout(
                timeout,
            );
        };
    }, [onClose]);

    return (
        <div
            className={`${styles.toast} ${styles[type]}`}
            role="status"
            aria-live="polite"
        >
            <div
                className={
                    styles.content
                }
            >
                {type ===
                    'success' ? (
                    <Check
                        size={20}
                        strokeWidth={2}
                    />
                ) : (
                    <TriangleAlert
                        size={19}
                        strokeWidth={1.8}
                    />
                )}

                <span>
                    {message}
                </span>
            </div>

            <button
                type="button"
                className={
                    styles.closeButton
                }
                onClick={onClose}
                aria-label="Fechar aviso"
            >
                <X
                    size={23}
                    strokeWidth={2}
                />
            </button>
        </div>
    );
}
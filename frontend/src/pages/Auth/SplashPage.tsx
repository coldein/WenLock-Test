import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './SplashPage.module.css';

const SPLASH_DURATION = 1600;

export function SplashPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timeout =
            window.setTimeout(
                () => {
                    navigate(
                        '/login',
                        {
                            replace: true,
                        },
                    );
                },
                SPLASH_DURATION,
            );

        return () => {
            window.clearTimeout(
                timeout,
            );
        };
    }, [navigate]);

    return (
        <main
            className={
                styles.page
            }
        >
            <section
                className={
                    styles.splash
                }
                aria-label="Carregando WenLock"
            >
                <img
                    src="/assets/wenlock-expanded.svg"
                    alt="WenLock"
                    className={
                        styles.logo
                    }
                />
            </section>
        </main>
    );
}
import styles from './HomePage.module.css';

export function HomePage() {
    const formattedDate =
        new Intl.DateTimeFormat(
            'pt-BR',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            },
        ).format(new Date());

    return (
        <>
            <h1 className={styles.pageTitle}>
                Home
            </h1>

            <section className={styles.card}>
                <h2 className={styles.greeting}>
                    Olá Usuário!
                </h2>

                <p className={styles.date}>
                    {formattedDate}
                </p>

                <div className={styles.welcomeArea}>
                    <div
                        className={styles.welcomeContent}
                    >
                        <img
                            className={styles.illustration}
                            src="/assets/home-welcome.svg"
                            alt="Ilustração de boas-vindas WenLock"
                        />

                        <div
                            className={
                                styles.welcomeMessage
                            }
                        >
                            Bem-vindo ao WenLock!
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
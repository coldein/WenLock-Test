import {
    Eye,
    EyeOff,
} from 'lucide-react';

import {
    useState,
    type FormEvent,
} from 'react';

import {
    useNavigate,
} from 'react-router-dom';

import styles from './LoginPage.module.css';

export function LoginPage() {
    const navigate =
        useNavigate();

    const [
        identifier,
        setIdentifier,
    ] = useState('');

    const [
        password,
        setPassword,
    ] = useState('');

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        /*
         * Esta tela faz parte da apresentação
         * visual do projeto.
         *
         * A autenticação real não faz parte
         * do escopo desta implementação.
         */
        navigate('/home');
    };

    return (
        <main
            className={
                styles.page
            }
        >
            <section
                className={
                    styles.loginStage
                }
            >
                {/* =============================================
                    IDENTIDADE VISUAL
                    ============================================= */}

                <div
                    className={
                        styles.brandArea
                    }
                >
                    <img
                        src="/assets/wenlock-expanded.svg"
                        alt="WenLock"
                        className={
                            styles.brandLogo
                        }
                    />
                </div>

                {/* =============================================
                    FORMULÁRIO
                    ============================================= */}

                <div
                    className={
                        styles.formArea
                    }
                >
                    <div
                        className={
                            styles.loginCard
                        }
                    >
                        <header
                            className={
                                styles.header
                            }
                        >
                            <h1>
                                Bem-vindo!
                            </h1>

                            <p>
                                Entre com sua conta
                            </p>
                        </header>

                        <form
                            className={
                                styles.form
                            }
                            onSubmit={
                                handleSubmit
                            }
                        >
                            {/* E-MAIL / MATRÍCULA */}

                            <div
                                className={
                                    styles.field
                                }
                            >
                                <label
                                    htmlFor="identifier"
                                    className={
                                        styles.srOnly
                                    }
                                >
                                    E-mail ou Nº matrícula
                                </label>

                                <input
                                    id="identifier"
                                    type="text"
                                    value={
                                        identifier
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setIdentifier(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="E-mail ou Nº matrícula"
                                    autoComplete="username"
                                    required
                                />
                            </div>

                            {/* SENHA */}

                            <div
                                className={
                                    styles.passwordField
                                }
                            >
                                <label
                                    htmlFor="password"
                                    className={
                                        styles.srOnly
                                    }
                                >
                                    Senha
                                </label>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={
                                        password
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setPassword(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="Senha"
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className={
                                        styles.passwordToggle
                                    }
                                    onClick={() =>
                                        setShowPassword(
                                            (
                                                current,
                                            ) =>
                                                !current,
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Ocultar senha'
                                            : 'Visualizar senha'
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={18}
                                            strokeWidth={
                                                1.7
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            size={18}
                                            strokeWidth={
                                                1.7
                                            }
                                        />
                                    )}
                                </button>
                            </div>

                            {/* ENTRAR */}

                            <button
                                type="submit"
                                className={
                                    styles.submitButton
                                }
                            >
                                Entrar
                            </button>

                            {/* ESQUECI A SENHA */}

                            <button
                                type="button"
                                className={
                                    styles.forgotPassword
                                }
                                title="Recurso não incluído nesta demonstração"
                            >
                                Esqueci minha senha
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
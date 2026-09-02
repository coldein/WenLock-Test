import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
    ChevronLeft,
    Eye,
    EyeOff,
} from 'lucide-react';
import {
    useEffect,
    useState,
} from 'react';
import { useForm } from 'react-hook-form';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    updateUserSchema,
    type UpdateUserFormData,
} from '../../schemas/user.schema';

import { usersService } from '../../services/users.service';

import type {
    UpdateUserPayload,
    User,
} from '../../types/user';

import { UserCancelModal } from './UserCancelModal';

import styles from './UserEditPage.module.css';

interface ApiErrorResponse {
    message?: string | string[];
}

export function UserEditPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [
        loadError,
        setLoadError,
    ] = useState<string | null>(
        null,
    );

    const [
        submitError,
        setSubmitError,
    ] = useState<string | null>(
        null,
    );

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [
        cancelModalOpen,
        setCancelModalOpen,
    ] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: {
            errors,
            isValid,
            isDirty,
            isSubmitting,
        },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(
            updateUserSchema,
        ),

        mode: 'onChange',

        defaultValues: {
            name: '',
            email: '',
            registration: '',
            password: '',
            confirmPassword: '',
        },
    });

    /* =======================================================
       CARREGAR USUÁRIO
       ======================================================= */

    useEffect(() => {
        const loadUser =
            async () => {
                const userId =
                    Number(id);

                if (
                    !Number.isInteger(
                        userId,
                    ) ||
                    userId <= 0
                ) {
                    setLoadError(
                        'Usuário inválido.',
                    );

                    setLoading(false);

                    return;
                }

                try {
                    setLoading(true);
                    setLoadError(null);

                    const response =
                        await usersService.findOne(
                            userId,
                        );

                    setUser(response);

                    reset({
                        name: response.name,
                        email: response.email,
                        registration:
                            response.registration,
                        password: '',
                        confirmPassword: '',
                    });
                } catch {
                    setLoadError(
                        'Não foi possível carregar o usuário.',
                    );
                } finally {
                    setLoading(false);
                }
            };

        void loadUser();
    }, [
        id,
        reset,
    ]);

    /* =======================================================
       SALVAR
       ======================================================= */

    const onSubmit = async (
        data: UpdateUserFormData,
    ) => {
        if (!user) {
            return;
        }

        const payload: UpdateUserPayload =
            {};

        const normalizedName =
            data.name.trim();

        const normalizedEmail =
            data.email
                .trim()
                .toLowerCase();

        const normalizedRegistration =
            data.registration.trim();

        if (
            normalizedName !==
            user.name
        ) {
            payload.name =
                normalizedName;
        }

        if (
            normalizedEmail !==
            user.email
        ) {
            payload.email =
                normalizedEmail;
        }

        if (
            normalizedRegistration !==
            user.registration
        ) {
            payload.registration =
                normalizedRegistration;
        }
    
        if (data.password) {
            payload.password =
                data.password;
        }

        try {
            setSubmitError(null);

            await usersService.update(
                user.id,
                payload,
            );

            navigate(
                '/users',
                {
                    state: {
                        toast: {
                            type: 'success',
                            message:
                                'Dados salvos com sucesso!',
                        },
                    },
                },
            );
        } catch (error: unknown) {
            if (
                axios.isAxiosError<ApiErrorResponse>(
                    error,
                )
            ) {
                const apiMessage =
                    error.response?.data
                        ?.message;

                if (
                    typeof apiMessage ===
                    'string'
                ) {
                    setSubmitError(
                        apiMessage,
                    );

                    return;
                }

                if (
                    Array.isArray(
                        apiMessage,
                    )
                ) {
                    setSubmitError(
                        apiMessage.join(
                            '. ',
                        ),
                    );

                    return;
                }
            }

            setSubmitError(
                'Não foi possível atualizar o usuário.',
            );
        }
    };

    /* =======================================================
       CANCELAR
       ======================================================= */

    const handleCancel = () => {

        if (!isDirty) {
            navigate('/users');

            return;
        }

        setCancelModalOpen(true);
    };

    const handleCloseCancelModal =
        () => {
            setCancelModalOpen(false);
        };

    const handleConfirmCancel =
        () => {
            setCancelModalOpen(false);

            navigate(
                '/users',
                {
                    state: {
                        toast: {
                            type: 'warning',
                            message:
                                'Edição cancelada',
                        },
                    },
                },
            );
        };

    /* =======================================================
       LOADING
       ======================================================= */

    if (loading) {
        return (
            <section
                className={
                    styles.page
                }
            >
                <nav
                    className={
                        styles.breadcrumb
                    }
                    aria-label="Navegação estrutural"
                >
                    <Link to="/users">
                        Usuários
                    </Link>

                    <span
                        className={
                            styles.breadcrumbSeparator
                        }
                    >
                        &gt;
                    </span>

                    <span>
                        Edição de Usuário
                    </span>
                </nav>

                <div
                    className={
                        styles.titleRow
                    }
                >
                    <Link
                        to="/users"
                        className={
                            styles.titleBack
                        }
                        aria-label="Voltar para usuários"
                    >
                        <ChevronLeft
                            size={27}
                            strokeWidth={2}
                        />
                    </Link>

                    <h1
                        className={
                            styles.pageTitle
                        }
                    >
                        Editar Usuário
                    </h1>
                </div>

                <div
                    className={
                        styles.loadingState
                    }
                >
                    Carregando usuário...
                </div>
            </section>
        );
    }

    /* =======================================================
       ERRO AO CARREGAR
       ======================================================= */

    if (
        loadError ||
        !user
    ) {
        return (
            <section
                className={
                    styles.page
                }
            >
                <nav
                    className={
                        styles.breadcrumb
                    }
                    aria-label="Navegação estrutural"
                >
                    <Link to="/users">
                        Usuários
                    </Link>

                    <span
                        className={
                            styles.breadcrumbSeparator
                        }
                    >
                        &gt;
                    </span>

                    <span>
                        Edição de Usuário
                    </span>
                </nav>

                <div
                    className={
                        styles.titleRow
                    }
                >
                    <Link
                        to="/users"
                        className={
                            styles.titleBack
                        }
                        aria-label="Voltar para usuários"
                    >
                        <ChevronLeft
                            size={27}
                            strokeWidth={2}
                        />
                    </Link>

                    <h1
                        className={
                            styles.pageTitle
                        }
                    >
                        Editar Usuário
                    </h1>
                </div>

                <div
                    className={
                        styles.loadError
                    }
                >
                    {loadError ??
                        'Usuário não encontrado.'}
                </div>
            </section>
        );
    }

    return (
        <section
            className={
                styles.page
            }
        >
            {/* ===================================================
                BREADCRUMB
                =================================================== */}

            <nav
                className={
                    styles.breadcrumb
                }
                aria-label="Navegação estrutural"
            >
                <Link to="/users">
                    Usuários
                </Link>

                <span
                    className={
                        styles.breadcrumbSeparator
                    }
                >
                    &gt;
                </span>

                <span>
                    Edição de Usuário
                </span>
            </nav>

            {/* ===================================================
                TÍTULO
                =================================================== */}

            <div
                className={
                    styles.titleRow
                }
            >
                {}
                <button
                    type="button"
                    className={
                        styles.titleBack
                    }
                    title="Voltar"
                    aria-label="Voltar para usuários"
                    onClick={
                        handleCancel
                    }
                >
                    <ChevronLeft
                        size={27}
                        strokeWidth={2}
                    />
                </button>

                <h1
                    className={
                        styles.pageTitle
                    }
                >
                    Editar Usuário
                </h1>
            </div>

            {/* ===================================================
                FORMULÁRIO
                =================================================== */}

            <form
                className={
                    styles.formCard
                }
                onSubmit={handleSubmit(
                    onSubmit,
                )}
                noValidate
            >
                {submitError && (
                    <div
                        className={
                            styles.submitError
                        }
                    >
                        {submitError}
                    </div>
                )}

                {/* =================================================
                    DADOS DO USUÁRIO
                    ================================================= */}

                <div
                    className={
                        styles.sectionTitle
                    }
                >
                    <span>
                        Dados do Usuário
                    </span>

                    <div
                        className={
                            styles.sectionLine
                        }
                    />
                </div>

                <div
                    className={
                        styles.userGrid
                    }
                >
                    {/* NOME */}

                    <div
                        className={
                            styles.field
                        }
                    >
                        <div
                            className={`${styles.fieldControl} ${errors.name
                                    ? styles.fieldControlError
                                    : ''
                                }`}
                        >
                            <label
                                htmlFor="name"
                            >
                                Nome Completo
                            </label>

                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Insira o nome completo*"
                                maxLength={150}
                                {...register(
                                    'name',
                                )}
                            />
                        </div>

                        <div
                            className={
                                styles.fieldMeta
                            }
                        >
                            {errors.name ? (
                                <span
                                    className={
                                        styles.fieldError
                                    }
                                >
                                    {
                                        errors.name
                                            .message
                                    }
                                </span>
                            ) : (
                                <span />
                            )}

                            <span
                                className={
                                    styles.fieldHint
                                }
                            >
                                • Máx. 150 Caracteres
                            </span>
                        </div>
                    </div>

                    {/* MATRÍCULA */}

                    <div
                        className={
                            styles.field
                        }
                    >
                        <div
                            className={`${styles.fieldControl} ${errors.registration
                                    ? styles.fieldControlError
                                    : ''
                                }`}
                        >
                            <label
                                htmlFor="registration"
                            >
                                Matrícula
                            </label>

                            <input
                                id="registration"
                                type="text"
                                inputMode="numeric"
                                autoComplete="off"
                                placeholder="Insira o Nº da matrícula"
                                maxLength={20}
                                {...register(
                                    'registration',
                                )}
                            />
                        </div>

                        <div
                            className={
                                styles.fieldMeta
                            }
                        >
                            {errors.registration ? (
                                <span
                                    className={
                                        styles.fieldError
                                    }
                                >
                                    {
                                        errors
                                            .registration
                                            .message
                                    }
                                </span>
                            ) : (
                                <span />
                            )}

                            <span
                                className={
                                    styles.fieldHint
                                }
                            >
                                • Somente números
                                {' '}
                                • Máx. 20 Caracteres
                            </span>
                        </div>
                    </div>

                    {/* E-MAIL */}

                    <div
                        className={
                            styles.field
                        }
                    >
                        <div
                            className={`${styles.fieldControl} ${errors.email
                                    ? styles.fieldControlError
                                    : ''
                                }`}
                        >
                            <label
                                htmlFor="email"
                            >
                                E-mail
                            </label>

                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Insira o E-mail*"
                                maxLength={254}
                                {...register(
                                    'email',
                                )}
                            />
                        </div>

                        <div
                            className={
                                styles.fieldMeta
                            }
                        >
                            {errors.email ? (
                                <span
                                    className={
                                        styles.fieldError
                                    }
                                >
                                    {
                                        errors.email
                                            .message
                                    }
                                </span>
                            ) : (
                                <span />
                            )}

                            <span
                                className={
                                    styles.fieldHint
                                }
                            >
                                • Máx. 254 Caracteres
                            </span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    DADOS DE ACESSO
                    ================================================= */}

                <div
                    className={`${styles.sectionTitle} ${styles.accessTitle}`}
                >
                    <span>
                        Dados de acesso
                    </span>

                    <div
                        className={
                            styles.sectionLine
                        }
                    />
                </div>

                <div
                    className={
                        styles.accessGrid
                    }
                >
                    {/* NOVA SENHA */}

                    <div
                        className={
                            styles.field
                        }
                    >
                        <div
                            className={`${styles.fieldControl} ${styles.passwordControl} ${errors.password
                                    ? styles.fieldControlError
                                    : ''
                                }`}
                        >
                            <label
                                htmlFor="password"
                            >
                                Nova Senha
                            </label>

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                autoComplete="new-password"
                                placeholder="Nova Senha"
                                maxLength={6}
                                {...register(
                                    'password',
                                )}
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
                                        size={19}
                                        strokeWidth={
                                            1.8
                                        }
                                    />
                                ) : (
                                    <Eye
                                        size={19}
                                        strokeWidth={
                                            1.8
                                        }
                                    />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <span
                                className={
                                    styles.fieldErrorStandalone
                                }
                            >
                                {
                                    errors.password
                                        .message
                                }
                            </span>
                        )}

                        {!errors.password && (
                            <span
                                className={
                                    styles.passwordHint
                                }
                            >
                                Deixe em branco para
                                manter a senha atual.
                            </span>
                        )}
                    </div>

                    {/* REPETIR NOVA SENHA */}

                    <div
                        className={
                            styles.field
                        }
                    >
                        <div
                            className={`${styles.fieldControl} ${styles.passwordControl} ${errors.confirmPassword
                                    ? styles.fieldControlError
                                    : ''
                                }`}
                        >
                            <label
                                htmlFor="confirmPassword"
                            >
                                Repetir Nova Senha
                            </label>

                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? 'text'
                                        : 'password'
                                }
                                autoComplete="new-password"
                                placeholder="Repetir Nova Senha"
                                maxLength={6}
                                {...register(
                                    'confirmPassword',
                                )}
                            />

                            <button
                                type="button"
                                className={
                                    styles.passwordToggle
                                }
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (
                                            current,
                                        ) =>
                                            !current,
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? 'Ocultar confirmação da senha'
                                        : 'Visualizar confirmação da senha'
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff
                                        size={19}
                                        strokeWidth={
                                            1.8
                                        }
                                    />
                                ) : (
                                    <Eye
                                        size={19}
                                        strokeWidth={
                                            1.8
                                        }
                                    />
                                )}
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <span
                                className={
                                    styles.fieldErrorStandalone
                                }
                            >
                                {
                                    errors
                                        .confirmPassword
                                        .message
                                }
                            </span>
                        )}
                    </div>
                </div>

                {/* =================================================
                    AÇÕES
                    ================================================= */}

                <footer
                    className={
                        styles.formActions
                    }
                >
                    <button
                        type="button"
                        className={
                            styles.cancelButton
                        }
                        onClick={
                            handleCancel
                        }
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className={
                            styles.submitButton
                        }
                        disabled={
                            !isValid ||
                            !isDirty ||
                            isSubmitting
                        }
                    >
                        {isSubmitting
                            ? 'Salvando...'
                            : 'Salvar'}
                    </button>
                </footer>
            </form>

            {/* ===================================================
                MODAL DE CANCELAMENTO
                =================================================== */}

            <UserCancelModal
                open={
                    cancelModalOpen
                }
                message="As alterações realizadas não serão salvas"
                onClose={
                    handleCloseCancelModal
                }
                onConfirm={
                    handleConfirmCancel
                }
            />
        </section>
    );
}
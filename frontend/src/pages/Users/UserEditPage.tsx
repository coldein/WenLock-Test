import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
    ArrowLeft,
    Save,
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

    useEffect(() => {
        const loadUser = async () => {
            const userId = Number(id);

            if (
                !Number.isInteger(userId) ||
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
    }, [id, reset]);

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

            navigate('/users');
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
                        apiMessage.join('. '),
                    );

                    return;
                }
            }

            setSubmitError(
                'Não foi possível atualizar o usuário.',
            );
        }
    };

    if (loading) {
        return (
            <section className={styles.page}>
                <h1
                    className={
                        styles.pageTitle
                    }
                >
                    Editar Usuário
                </h1>

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

    if (loadError || !user) {
        return (
            <section className={styles.page}>
                <h1
                    className={
                        styles.pageTitle
                    }
                >
                    Editar Usuário
                </h1>

                <div
                    className={
                        styles.loadError
                    }
                >
                    {loadError ??
                        'Usuário não encontrado.'}
                </div>

                <Link
                    to="/users"
                    className={
                        styles.backButton
                    }
                >
                    <ArrowLeft size={17} />

                    Voltar
                </Link>
            </section>
        );
    }

    return (
        <section className={styles.page}>
            <div
                className={
                    styles.pageHeader
                }
            >
                <div>
                    <h1
                        className={
                            styles.pageTitle
                        }
                    >
                        Editar Usuário
                    </h1>

                    <p
                        className={
                            styles.pageDescription
                        }
                    >
                        Altere os dados do
                        usuário selecionado.
                    </p>
                </div>

                <Link
                    to="/users"
                    className={
                        styles.backButton
                    }
                >
                    <ArrowLeft size={17} />

                    Voltar
                </Link>
            </div>

            <form
                className={styles.form}
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

                <section
                    className={
                        styles.formSection
                    }
                >
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <h2>
                            Dados do Usuário
                        </h2>
                    </div>

                    <div
                        className={
                            styles.formGrid
                        }
                    >
                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="name">
                                Nome
                            </label>

                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                className={
                                    errors.name
                                        ? styles.inputError
                                        : ''
                                }
                                {...register(
                                    'name',
                                )}
                            />

                            {errors.name && (
                                <span
                                    className={
                                        styles.fieldError
                                    }
                                >
                                    {
                                        errors
                                            .name
                                            .message
                                    }
                                </span>
                            )}
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={
                                    errors.email
                                        ? styles.inputError
                                        : ''
                                }
                                {...register(
                                    'email',
                                )}
                            />

                            {errors.email && (
                                <span
                                    className={
                                        styles.fieldError
                                    }
                                >
                                    {
                                        errors
                                            .email
                                            .message
                                    }
                                </span>
                            )}
                        </div>

                        <div
                            className={
                                styles.field
                            }
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
                                className={
                                    errors.registration
                                        ? styles.inputError
                                        : ''
                                }
                                {...register(
                                    'registration',
                                )}
                            />

                            {errors.registration && (
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
                            )}
                        </div>
                    </div>
                </section>

                <section
                    className={
                        styles.formSection
                    }
                >
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <h2>
                            Dados de acesso
                        </h2>
                    </div>

                    <div
                        className={
                            styles.formGrid
                        }
                    >
                        <div
                            className={
                                styles.field
                            }
                        >
                            <label
                                htmlFor="password"
                            >
                                Nova senha
                            </label>

                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Deixe em branco para manter a senha atual"
                                maxLength={6}
                                className={
                                    errors.password
                                        ? styles.inputError
                                        : ''
                                }
                                {...register(
                                    'password',
                                )}
                            />

                            {errors.password && (
                                <span
                                    className={
                                        styles.fieldError
                                    }
                                >
                                    {
                                        errors
                                            .password
                                            .message
                                    }
                                </span>
                            )}
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label
                                htmlFor="confirmPassword"
                            >
                                Confirmar nova senha
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Confirme a nova senha"
                                maxLength={6}
                                className={
                                    errors.confirmPassword
                                        ? styles.inputError
                                        : ''
                                }
                                {...register(
                                    'confirmPassword',
                                )}
                            />

                            {errors.confirmPassword && (
                                <span
                                    className={
                                        styles.fieldError
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
                </section>

                <footer
                    className={
                        styles.formActions
                    }
                >
                    <Link
                        to="/users"
                        className={
                            styles.cancelButton
                        }
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        className={
                            styles.saveButton
                        }
                        disabled={
                            !isValid ||
                            !isDirty ||
                            isSubmitting
                        }
                    >
                        <Save size={17} />

                        {isSubmitting
                            ? 'Salvando...'
                            : 'Salvar'}
                    </button>
                </footer>
            </form>
        </section>
    );
}
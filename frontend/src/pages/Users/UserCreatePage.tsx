import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
    ArrowLeft,
    Save,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Link,
    useNavigate,
} from 'react-router-dom';

import {
    createUserSchema,
    type CreateUserFormData,
} from '../../schemas/user.schema';
import { usersService } from '../../services/users.service';

import styles from './UserCreatePage.module.css';

interface ApiErrorResponse {
    message?: string | string[];
}

export function UserCreatePage() {
    const navigate = useNavigate();

    const [
        submitError,
        setSubmitError,
    ] = useState<string | null>(
        null,
    );

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
            isSubmitting,
        },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(
            createUserSchema,
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

    const onSubmit = async (
        data: CreateUserFormData,
    ) => {
        try {
            setSubmitError(null);

            await usersService.create({
                name: data.name,
                email: data.email,
                registration:
                    data.registration,
                password: data.password,
            });

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
                        apiMessage.join(
                            '. ',
                        ),
                    );

                    return;
                }
            }

            setSubmitError(
                'Não foi possível cadastrar o usuário.',
            );
        }
    };

    return (
        <section
            className={styles.page}
        >
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
                        Cadastrar Usuário
                    </h1>

                    <p
                        className={
                            styles.pageDescription
                        }
                    >
                        Preencha os dados para
                        realizar o cadastro.
                    </p>
                </div>

                <Link
                    to="/users"
                    className={
                        styles.backButton
                    }
                >
                    <ArrowLeft
                        size={17}
                    />

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
                            <label
                                htmlFor="name"
                            >
                                Nome
                            </label>

                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Digite o nome"
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
                            <label
                                htmlFor="email"
                            >
                                E-mail
                            </label>

                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Digite o e-mail"
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
                                placeholder="Digite a matrícula"
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
                                Senha
                            </label>

                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Digite a senha"
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
                                Confirmar senha
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Confirme a senha"
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
                            isSubmitting
                        }
                    >
                        <Save
                            size={17}
                        />

                        {isSubmitting
                            ? 'Salvando...'
                            : 'Salvar'}
                    </button>
                </footer>
            </form>
        </section>
    );
}
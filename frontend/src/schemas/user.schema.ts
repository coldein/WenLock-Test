import { z } from 'zod';

/*
 * Validações compartilhadas entre
 * cadastro e edição de usuário.
 */

const nameSchema = z
    .string()
    .trim()
    .min(
        1,
        'O nome é obrigatório',
    )
    .max(
        150,
        'O nome deve possuir no máximo 150 caracteres',
    )
    .regex(
        /^[\p{L}\s]+$/u,
        'O nome deve conter apenas letras e espaços',
    );

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(
        1,
        'O e-mail é obrigatório',
    )
    .email(
        'O e-mail informado é inválido',
    )
    .max(
        254,
        'O e-mail deve possuir no máximo 254 caracteres',
    );

const registrationSchema = z
    .string()
    .trim()
    .min(
        1,
        'A matrícula é obrigatória',
    )
    .max(
        20,
        'A matrícula deve possuir no máximo 20 caracteres',
    )
    .regex(
        /^\d+$/,
        'A matrícula deve conter apenas números',
    );

const passwordSchema = z
    .string()
    .min(
        1,
        'A senha é obrigatória',
    )
    .length(
        6,
        'A senha deve possuir exatamente 6 caracteres',
    )
    .regex(
        /^[A-Za-z0-9]+$/,
        'A senha deve conter apenas letras e números',
    );

/* =========================================================
   CADASTRO
   ========================================================= */

export const createUserSchema = z
    .object({
        name: nameSchema,

        email: emailSchema,

        registration:
            registrationSchema,

        password: passwordSchema,

        confirmPassword: z
            .string()
            .min(
                1,
                'A confirmação da senha é obrigatória',
            ),
    })
    .refine(
        (data) =>
            data.password ===
            data.confirmPassword,
        {
            message:
                'As senhas não coincidem',
            path: ['confirmPassword'],
        },
    );

export type CreateUserFormData =
    z.infer<
        typeof createUserSchema
    >;

/* =========================================================
   EDIÇÃO
   ========================================================= */

/*
 * Na edição a senha é opcional.
 *
 * ""      -> mantém a senha atual
 * "abc123" -> altera a senha
 */
const optionalPasswordSchema =
    z.union([
        z.literal(''),

        z
            .string()
            .length(
                6,
                'A senha deve possuir exatamente 6 caracteres',
            )
            .regex(
                /^[A-Za-z0-9]+$/,
                'A senha deve conter apenas letras e números',
            ),
    ]);

export const updateUserSchema = z
    .object({
        name: nameSchema,

        email: emailSchema,

        registration:
            registrationSchema,

        password:
            optionalPasswordSchema,

        confirmPassword:
            z.string(),
    })
    .refine(
        (data) =>
            data.password ===
            data.confirmPassword,
        {
            message:
                'As senhas não coincidem',
            path: ['confirmPassword'],
        },
    );

export type UpdateUserFormData =
    z.infer<
        typeof updateUserSchema
    >;
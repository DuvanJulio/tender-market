export const LOGIN_FIELDS_REGEX = {
    username: /^[a-zA-Z0-9._-]{3,30}$/,
    password: /^.{8,}$/,
} as const;


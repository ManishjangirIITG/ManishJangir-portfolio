# Authentication — Phase 3

Phase 3 establishes the private administration boundary. It provides one authenticated admin account model and database-backed sessions. CRUD and content workflows remain deferred.

## Authentication model

- `admin_users` stores the administrator identity, password hash, activation state, and login timestamp.
- `admin_sessions` stores only a SHA-256 hash of the opaque session token.
- The raw session token exists only in the HTTP-only cookie and is never persisted.
- Sessions expire after seven days.
- A new login invalidates the previous session for that administrator.
- Inactive administrators cannot create or use sessions.

## Passwords

Passwords are hashed with PBKDF2-HMAC-SHA-256 using a random 128-bit salt and 310,000 iterations. Plaintext passwords are never written to the database.

Generate a hash locally:

```bash
npm run admin:hash -- '<strong-password>'
```

Copy the resulting `ADMIN_PASSWORD_HASH` into the local environment.

## Provisioning the first administrator

Set `DATABASE_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH` in the environment used by the provisioning command, then run:

```bash
npm run admin:seed
```

The command is idempotent for an existing email and updates the password hash while keeping the account active.

## Session boundary

`src/lib/auth/session.ts` is the server-side authorization boundary. Public code should not inspect or construct session cookies directly. Protected server routes should call `requireAdminSession()` before performing privileged work.

The cookie is:

- HTTP-only
- SameSite=Lax
- Secure in production
- Path scoped to `/`
- Seven-day maximum age

## Routes

| Route                    | Purpose                            |
| ------------------------ | ---------------------------------- |
| `/admin/login`           | Private login form                 |
| `/admin`                 | Authenticated administration shell |
| `POST /api/admin/login`  | Creates an authenticated session   |
| `POST /api/admin/logout` | Destroys the current session       |

## Deliberate boundaries

This phase does not add:

- Role hierarchies
- Public registration
- Password reset
- Email verification
- OAuth
- Admin CRUD
- Audit events
- Rate limiting
- MFA

Those concerns should be introduced only when their corresponding phase requires them.

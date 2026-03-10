# gesap-patient-portal

Portal de autoservicio para pacientes GESAP. Permite registro libre con DPI, consulta de perfil y gestión de contactos de emergencia (máximo 5).

## Requisitos

- Node.js 18+
- PostgreSQL 15+ (misma BD que gesap-api)

## Instalación

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
```

## Ejecución

```bash
npm run start:dev
```

El servidor corre en `http://localhost:3002/gesap-portal/v1`

## Endpoints

### Autenticación (públicos)

- `POST /gesap-portal/v1/auth/register` — Registro libre con DPI (cuenta queda PENDING)
- `POST /gesap-portal/v1/auth/login` — Login de paciente (solo cuentas APPROVED)

### Gestión de cuentas (requiere token de auditor)

- `GET /gesap-portal/v1/auth/pending` — Ver cuentas pendientes de aprobación
- `PATCH /gesap-portal/v1/auth/approve/:id` — Aprobar cuenta
- `PATCH /gesap-portal/v1/auth/reject/:id` — Rechazar cuenta

### Perfil (requiere token de usuario)

- `GET /gesap-portal/v1/profile` — Ver perfil completo (solo lectura)

### Contactos de emergencia (requiere token de usuario, máximo 5)

- `GET /gesap-portal/v1/emergency-contacts` — Listar mis contactos
- `POST /gesap-portal/v1/emergency-contacts` — Crear contacto
- `PUT /gesap-portal/v1/emergency-contacts/:id` — Editar contacto
- `DELETE /gesap-portal/v1/emergency-contacts/:id` — Eliminar contacto

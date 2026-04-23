# Estructura del Proyecto - Appointments Service MS

Microservicio de citas médicas construido con **NestJS v11**, **TypeORM** y **PostgreSQL**, dockerizado con **Docker Compose**.

## Árbol de archivos

```
appointments-service-ms/
├── src/
│   ├── main.ts                  # Punto de entrada de la aplicación
│   ├── app.module.ts            # Módulo raíz (configuración de TypeORM y PostgreSQL)
│   ├── app.controller.ts        # Controlador principal con endpoints base
│   ├── app.service.ts           # Servicio principal
│   └── app.controller.spec.ts   # Tests unitarios del controlador
├── test/
│   ├── app.e2e-spec.ts          # Tests end-to-end
│   └── jest-e2e.json            # Configuración de Jest para tests e2e
├── Dockerfile                   # Imagen Docker basada en Node 24 Alpine
├── compose.yaml                 # Orquestación de servicios (API + PostgreSQL)
├── package.json                 # Dependencias y scripts del proyecto
├── tsconfig.json                # Configuración base de TypeScript
├── tsconfig.build.json          # Configuración de TypeScript para build de producción
├── nest-cli.json                # Configuración del CLI de NestJS
├── eslint.config.mjs            # Reglas de linting (ESLint + Prettier)
├── .prettierrc                  # Configuración de formato de código
└── .gitignore                   # Archivos y carpetas ignorados por Git
```

## Descripción de cada capa

### `src/main.ts`

Punto de entrada de la aplicación. Crea la instancia de NestJS y levanta el servidor en el puerto definido por la variable de entorno `API_PORT`.

### `src/app.module.ts`

Módulo raíz que configura:

- **TypeORM** con conexión a PostgreSQL usando variables de entorno (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- `synchronize: true` está habilitado, lo que sincroniza automáticamente las entidades con la base de datos (solo recomendado para desarrollo).

### `src/app.controller.ts`

Controlador principal que expone tres endpoints:

| Método | Ruta       | Descripción                                      |
|--------|------------|--------------------------------------------------|
| GET    | `/`        | Retorna un mensaje de bienvenida                 |
| GET    | `/health`  | Health check del servicio (status + timestamp)   |
| GET    | `/db/ping` | Verifica la conexión a la base de datos PostgreSQL |

### `src/app.service.ts`

Servicio inyectable básico con un método `getHello()`. Actualmente no está siendo usado activamente por el controlador.

## Infraestructura (Docker)

### `Dockerfile`

- Basado en `node:24-alpine`.
- Copia las dependencias, ejecuta `npm install`, y luego copia el código fuente.
- Ejecuta la app en modo desarrollo (`npm run start:dev`).

### `compose.yaml`

Define dos servicios conectados en una red interna (`micro-net`):

| Servicio                | Imagen / Build    | Descripción                          |
|-------------------------|-------------------|--------------------------------------|
| `db`                    | `postgres:15-alpine` | Base de datos PostgreSQL            |
| `appointments-service`  | Build local (`./`)   | API NestJS, depende de `db`         |

Las credenciales y puertos se configuran mediante variables de entorno (archivo `.env`).

Usa un volumen persistente `pgdata` para los datos de PostgreSQL.

## Testing

- **Tests unitarios:** `src/app.controller.spec.ts` — usa `@nestjs/testing` con Jest.
- **Tests e2e:** `test/app.e2e-spec.ts` — usa Supertest para probar los endpoints HTTP.

### Scripts disponibles

| Script             | Comando                    | Descripción                         |
|--------------------|----------------------------|-------------------------------------|
| `start`            | `npm run start`            | Inicia la app                       |
| `start:dev`        | `npm run start:dev`        | Inicia con hot-reload               |
| `start:debug`      | `npm run start:debug`      | Inicia en modo debug con hot-reload |
| `start:prod`       | `npm run start:prod`       | Inicia desde el build compilado     |
| `build`            | `npm run build`            | Compila el proyecto                 |
| `test`             | `npm run test`             | Ejecuta tests unitarios             |
| `test:e2e`         | `npm run test:e2e`         | Ejecuta tests end-to-end            |
| `test:cov`         | `npm run test:cov`         | Tests con reporte de cobertura      |
| `lint`             | `npm run lint`             | Ejecuta ESLint con auto-fix         |
| `format`           | `npm run format`           | Formatea el código con Prettier     |

## Dependencias principales

| Paquete                      | Versión   | Propósito                              |
|------------------------------|-----------|----------------------------------------|
| `@nestjs/common`             | ^11.0.1   | Framework base de NestJS               |
| `@nestjs/core`               | ^11.0.1   | Core de NestJS                         |
| `@nestjs/platform-express`   | ^11.0.1   | Adaptador HTTP (Express)               |
| `@nestjs/typeorm`            | ^11.0.0   | Integración de TypeORM con NestJS      |
| `pg`                         | ^8.0.0    | Driver de PostgreSQL para Node.js      |
| `rxjs`                       | ^7.8.1    | Programación reactiva                  |

## Variables de entorno requeridas

Estas variables deben definirse en un archivo `.env` en la raíz del proyecto:

| Variable              | Descripción                              |
|-----------------------|------------------------------------------|
| `PORT`                | Puerto expuesto por Docker y la API      |
| `DB_HOST`             | Host de la base de datos                 |
| `POSTGRES_DB_USER`    | Usuario de PostgreSQL                    |
| `POSTGRES_DB_PASSWORD`| Contraseña de PostgreSQL                 |
| `POSTGRES_DB_NAME`    | Nombre de la base de datos               |
| `POSTGRES_DB_PORT`    | Puerto de PostgreSQL                     |

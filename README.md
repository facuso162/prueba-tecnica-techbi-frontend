# Prueba Técnica Techbi

Esta es la aplicación para registrar y administrar ensayos y pruebas de Dexter.

## Requisitos

Para poder ejecutar la aplicación, necesitas tener instalado en tu máquina:

- **Node.js** >= 22.14.0
- **npm** (viene con Node.js)
- No se requiere motor de base de datos externo ya que se usa **SQLite**.

---

## Instalación

### Backend

1. Ir al directorio del backend:

```bash
cd backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Ir a la carpeta /src y generar el cliente de Prisma

```bash
cd src
npx prisma generate
```

4. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El backend se levantará en **[http://localhost:3000](http://localhost:3000)**

> Puedes encontrar el codigo del backend haciendo [click aqui.](https://github.com/facuso162/prueba-tecnica-techbi)

---

### Frontend

1. Ir al directorio del frontend:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Levantar el servidor de Angular:

```bash
npm start
```

El frontend se levantará en **[http://localhost:4200](http://localhost:4200)**

---

## Estructura de la Base de Datos

Se utiliza **SQLite** con los siguientes modelos:

- `Ensayo`:

  - `codigo` (PK)
  - `nombre`
  - `descripcion`
  - `formula`
  - `fechaCreacion`
  - relación uno a muchos con `Prueba`

- `Prueba`:

  - `codigo` (PK)
  - `descripcion`
  - `valor`
  - `codigoEnsayo` (FK)
  - Relación con `Ensayo` (`onDelete: Cascade`)

---

## Rutas del Backend

### Ensayos

| Método | Ruta              | Descripción                    |
| ------ | ----------------- | ------------------------------ |
| GET    | /ensayos          | Listar todos los ensayos       |
| GET    | /ensayos/\:codigo | Obtener un ensayo por código   |
| POST   | /ensayos          | Crear un nuevo ensayo          |
| PUT    | /ensayos/\:codigo | Actualizar un ensayo existente |
| DELETE | /ensayos/\:codigo | Eliminar un ensayo             |

> Todos los endpoints devuelven JSON y utilizan validación con **Zod**.

---

## Notas

- La fecha de creación se guarda como **string** en formato `AAAA/MM/DD` según la zona horaria de Argentina.
- Prisma Client es utilizado para todas las operaciones de la base de datos.
- TailwindCSS está configurado en el frontend para estilos.

---

## Comandos útiles

### Backend

```bash
npm run dev           # Levantar backend en modo desarrollo
npx prisma studio     # Ver base de datos en interfaz web
```

### Frontend

```bash
npm start             # Levantar servidor Angular
npm run build         # Compilar Angular
npm run watch         # Build en modo watch
```

Desarrollado por [Facundo Sosa](https://www.linkedin.com/in/facuso/)

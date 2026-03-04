# Panel de Administración - Guía de Configuración

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
NEXTAUTH_SECRET=tu_secreto_aqui
ADMIN_EMAIL=admin@vacational-rents.com
ADMIN_PASSWORD=admin123
```

### Generando NEXTAUTH_SECRET

Ejecuta en la terminal:
```bash
openssl rand -base64 32
```

## Credenciales de Demostración

Por defecto, el panel usa:
- **Email**: admin@vacational-rents.com
- **Contraseña**: admin123

Puedes cambiarlas en las variables de entorno.

## Acceso al Panel

Una vez configurado, accede a:
- **Login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard
- **Gestión de Propiedades**: http://localhost:3000/admin/propiedades

## Características Implementadas

### 1. Autenticación (NextAuth.js)
- Login con email y contraseña
- Sesiones seguras
- Redirección automática a login si no está autenticado

### 2. Dashboard
- Estadísticas generales (propiedades, capacidad, precio promedio)
- Vista rápida de últimas propiedades

### 3. Gestión de Propiedades
- Listar todas las propiedades
- Crear nuevas propiedades
- Eliminar propiedades
- Activar/desactivar visibilidad

### 4. Edición de Propiedades
- Editar información básica (título, ubicación, precio, descripción)
- Editar especificaciones (huéspedes, habitaciones, baños)
- Gestionar galería de imágenes:
  - Añadir imágenes por URL
  - Eliminar imágenes
  - Reordenar imágenes

## Almacenamiento de Datos

Actualmente, todos los cambios se guardan en **memoria**. Esto significa:
- Los cambios se pierden al reiniciar el servidor
- Ideal para desarrollo y pruebas
- Cuando se implemente una base de datos, los cambios serán persistentes

## Estructura del Proyecto

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Página de login
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard principal
│   │   ├── propiedades/
│   │   │   ├── page.tsx          # Listado de propiedades
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Edición de propiedad
│   │   └── layout.tsx            # Layout del admin
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts      # Rutas de NextAuth
│   └── layout.tsx                # Layout raíz
├── components/
│   ├── admin/
│   │   └── AdminSidebar.tsx      # Sidebar de navegación
│   ├── ui/                       # Componentes shadcn/ui
│   └── providers.tsx             # SessionProvider
└── lib/
    ├── auth.ts                   # Configuración de NextAuth
    ├── property-store.ts         # Almacenamiento en memoria
    └── utils.ts                  # Utilidades
```

## Próximos Pasos

Para implementar una base de datos:
1. Reemplazar el almacenamiento en memoria con llamadas a API
2. Crear endpoints en `src/app/api/properties/`
3. Conectar con una base de datos (MongoDB, PostgreSQL, etc.)
4. Implementar validaciones en el servidor

## Notas de Desarrollo

- El panel usa **shadcn/ui** para todos los componentes
- Está completamente separado visualmente de la web principal
- Responsive design para móvil, tablet y desktop
- Sidebar de navegación para acceso rápido a secciones

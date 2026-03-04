# 🏠 Vacational Rents

Plataforma web de alquiler vacacional con arquitectura moderna, diseño minimalista y soporte multiidioma.

## 📋 Descripción del Proyecto

Aplicación web desarrollada con **Next.js 16** y **TypeScript** que permite la gestión y visualización de propiedades de alquiler vacacional. El proyecto incluye:

- 🌍 **Internacionalización completa** en 4 idiomas (Español, Inglés, Alemán, Francés)
- 📅 **Sistema de reservas** con calendario interactivo
- 🔐 **Panel de administración** protegido con NextAuth
- 📝 **Check-in online** conforme a la legislación española (RD 933/2021)
- 🎨 **Diseño moderno** con Tailwind CSS y componentes reutilizables
- 📱 **Responsive design** optimizado para todos los dispositivos

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16.1.6 (App Router)
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS 4
- **Internacionalización:** next-intl 4.8.3
- **Autenticación:** NextAuth 5.0.0-beta.30
- **UI Components:** Radix UI, Lucide React
- **Gestión de fechas:** date-fns 4.1.0
- **Carrusel:** Embla Carousel
- **Linting:** ESLint 9
- **Formateo:** Prettier 3.8.1

## 🚀 Scripts Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start
```

### Calidad de Código

```bash
# Verificar TypeScript + ESLint (recomendado antes de commits)
npm run validate

# Solo verificar tipos de TypeScript
npm run type-check

# Solo ejecutar ESLint
npm run lint

# Ejecutar ESLint y corregir automáticamente
npm run lint:fix

# Formatear código con Prettier
npm run format
```

## 📁 Estructura del Proyecto

```
vacational-rents/
├── src/
│   ├── app/
│   │   ├── [locale]/              # Rutas públicas con i18n
│   │   │   ├── check-in/[id]/     # Check-in online
│   │   │   ├── property/[id]/     # Detalle de propiedad
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # Página principal
│   │   ├── admin/                 # Panel de administración
│   │   │   ├── dashboard/
│   │   │   ├── propiedades/
│   │   │   └── login/
│   │   └── api/                   # API routes
│   ├── components/
│   │   ├── BookingCalendar.tsx    # Calendario de reservas
│   │   ├── PropertyCard.tsx       # Tarjeta de propiedad
│   │   ├── LanguageSwitcher.tsx   # Selector de idioma
│   │   ├── CountrySelect.tsx      # Selector de país
│   │   ├── admin/                 # Componentes del admin
│   │   └── ui/                    # Componentes UI base
│   ├── lib/
│   │   ├── constants.ts           # Constantes globales
│   │   ├── data.ts                # Datos de propiedades
│   │   ├── auth.ts                # Configuración NextAuth
│   │   └── utils.ts               # Utilidades
│   ├── types/
│   │   ├── property.types.ts      # Tipos de propiedades
│   │   ├── checkin.types.ts       # Tipos de check-in
│   │   ├── booking.types.ts       # Tipos de reservas
│   │   ├── admin.types.ts         # Tipos del admin
│   │   ├── auth.types.ts          # Tipos de autenticación
│   │   ├── embla.types.ts         # Tipos de Embla Carousel
│   │   └── next-auth.d.ts         # Extensión de tipos NextAuth
│   ├── i18n/
│   │   └── request.ts             # Configuración i18n
│   └── middleware.ts              # Middleware de Next.js
├── messages/                      # Archivos de traducción
│   ├── es.json                    # Español
│   ├── en.json                    # Inglés
│   ├── de.json                    # Alemán
│   └── fr.json                    # Francés
└── public/                        # Archivos estáticos
```

## 🌍 Internacionalización

El proyecto soporta 4 idiomas:

- 🇪🇸 **Español** (es) - Idioma por defecto
- 🇬🇧 **Inglés** (en)
- 🇩🇪 **Alemán** (de)
- 🇫🇷 **Francés** (fr)

### Rutas

- Rutas públicas: `/{locale}/...` (ej: `/es/property/1`)
- Panel admin: `/admin/...` (sin locale)

El middleware detecta automáticamente el idioma del navegador y redirige al locale correspondiente.

## 🔐 Autenticación

El panel de administración está protegido con NextAuth. Credenciales por defecto:

- **Email:** `admin@vacational-rents.com`
- **Password:** `admin123`

⚠️ **Importante:** Cambiar estas credenciales en producción mediante variables de entorno.

## 📝 Características Principales

### Para Usuarios

- ✅ Visualización de propiedades con carrusel de imágenes
- ✅ Sistema de reservas con calendario interactivo
- ✅ Cálculo automático de precio total
- ✅ Check-in online con registro de huéspedes
- ✅ Interfaz multiidioma con selector de idioma
- ✅ Diseño responsive y moderno

### Para Administradores

- ✅ Dashboard con estadísticas
- ✅ Gestión de propiedades (CRUD)
- ✅ Control de visibilidad de propiedades
- ✅ Autenticación segura

## 🎨 Estándares de Código

El proyecto sigue estrictos estándares de calidad:

- ✅ **TypeScript estricto** - Sin uso de `any`
- ✅ **Tipos organizados** - Interfaces en archivos dedicados
- ✅ **Constantes centralizadas** - Sin magic numbers
- ✅ **Internacionalización completa** - Sin textos hardcodeados
- ✅ **ESLint configurado** - Reglas de Next.js
- ✅ **Prettier** - Formateo consistente

## 🔧 Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key-aqui

# Admin Credentials
ADMIN_EMAIL=admin@vacational-rents.com
ADMIN_PASSWORD=admin123
```

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## 🧪 Testing

```bash
# Verificar que no hay errores antes de commit
npm run validate
```

Este comando ejecuta:
1. Verificación de tipos TypeScript
2. Análisis de ESLint

## 🚀 Deployment

El proyecto está optimizado para deployment en **Vercel**:

```bash
# Compilar para producción
npm run build

# Verificar la build localmente
npm start
```

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Contribución

Para contribuir al proyecto:

1. Crear una rama desde `main`
2. Realizar cambios
3. Ejecutar `npm run validate` para verificar calidad
4. Crear Pull Request

---

**Desarrollado con ❤️ usando Next.js y TypeScript**

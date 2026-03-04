# Configuración de Internacionalización (i18n)

## 📋 Resumen

Se ha implementado internacionalización completa usando **next-intl** en la aplicación de alquiler vacacional, soportando 4 idiomas:

- 🇪🇸 Español (es) - Idioma por defecto
- 🇬🇧 Inglés (en)
- 🇩🇪 Alemán (de)
- 🇫🇷 Francés (fr)

## ✅ Implementación Completada

### 1. **Instalación y Configuración**
- ✅ Instalado `next-intl`
- ✅ Configurado `next.config.ts` con plugin de next-intl
- ✅ Creado archivo de configuración `src/i18n/request.ts`
- ✅ Configurado middleware para detección automática de idioma

### 2. **Estructura de Rutas**
- ✅ Rutas localizadas: `/es/...`, `/en/...`, `/de/...`, `/fr/...`
- ✅ Ruta `/admin` excluida del sistema i18n (sin prefijo de idioma)
- ✅ Redirección automática desde `/` al idioma detectado

### 3. **Archivos de Traducción**
Creados archivos JSON en `/messages/`:
- ✅ `es.json` - Español
- ✅ `en.json` - Inglés
- ✅ `de.json` - Alemán
- ✅ `fr.json` - Francés

### 4. **Componentes**
- ✅ **LanguageSwitcher**: Selector de idioma con banderas emoji
  - Botón principal muestra bandera del idioma actual
  - Dropdown con otros idiomas disponibles
  - Animación suave de apertura/cierre
  - Cierre automático al hacer clic fuera
  
- ✅ **PropertyCard**: Actualizado para usar rutas localizadas
- ✅ Páginas principales adaptadas con traducciones

### 5. **Páginas Localizadas**
- ✅ `/[locale]/page.tsx` - Página principal
- ✅ `/[locale]/property/[id]/page.tsx` - Detalle de propiedad
- ✅ Layout localizado con NextIntlClientProvider

## 🔧 Configuración del Middleware

El middleware está configurado para:
- Detectar automáticamente el idioma del navegador
- Guardar preferencia en cookie
- Excluir rutas: `/api`, `/admin`, `/_next`, archivos estáticos

```typescript
// src/middleware.ts
export const config = {
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*).*)'
  ]
};
```

## 🎨 Selector de Idioma

El componente `LanguageSwitcher` se encuentra en la esquina superior derecha del header:

```tsx
<LanguageSwitcher />
```

Características:
- Muestra bandera emoji del idioma actual
- Dropdown con nombres de idiomas en su propio idioma
- Mantiene la misma página al cambiar idioma
- Diseño integrado con el estilo existente

## 📁 Estructura de Archivos

```
src/
├── app/
│   ├── [locale]/              # Rutas localizadas
│   │   ├── layout.tsx         # Layout con NextIntlClientProvider
│   │   ├── page.tsx           # Página principal
│   │   ├── property/[id]/     # Detalle de propiedad
│   │   └── check-in/[id]/     # Check-in (pendiente)
│   ├── admin/                 # Panel admin (NO localizado)
│   ├── layout.tsx             # Layout raíz
│   └── page.tsx               # Redirección a idioma
├── components/
│   ├── LanguageSwitcher.tsx   # Selector de idioma
│   └── PropertyCard.tsx       # Actualizado con rutas localizadas
├── i18n/
│   └── request.ts             # Configuración de next-intl
├── middleware.ts              # Middleware de i18n
└── messages/                  # Traducciones
    ├── es.json
    ├── en.json
    ├── de.json
    └── fr.json
```

## 🚀 Uso

### En Componentes del Servidor (async)
```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('home');
  return <h1>{t('title')}</h1>;
}
```

### En Componentes del Cliente
```tsx
'use client'
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('home');
  return <h1>{t('title')}</h1>;
}
```

### Obtener Locale Actual
```tsx
'use client'
import { useLocale } from 'next-intl';

export default function Component() {
  const locale = useLocale();
  return <Link href={`/${locale}/about`}>About</Link>;
}
```

## ⚠️ Tareas Pendientes

1. **Página de Check-in**: Crear versión localizada en `/[locale]/check-in/[id]`
2. **Componente BookingCalendar**: Adaptar para mostrar fechas en el idioma seleccionado
3. **Pruebas**: Verificar funcionamiento en todos los idiomas
4. **SEO**: Añadir etiquetas hreflang para SEO multiidioma

## 🔍 Verificación

Para probar la implementación:

1. Acceder a `http://localhost:3000` → Redirige a `/es`
2. Usar el selector de idioma en la esquina superior derecha
3. Verificar que las traducciones cambian correctamente
4. Confirmar que `/admin` funciona sin prefijo de idioma
5. Verificar que la preferencia se guarda en cookie

## 📝 Notas Importantes

- El panel `/admin` está completamente excluido del sistema i18n
- Las traducciones actuales son básicas y pueden necesitar revisión
- El middleware detecta automáticamente el idioma del navegador en la primera visita
- La cookie guarda la preferencia del usuario para futuras visitas

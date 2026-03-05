# Reglas del Proyecto — Web de Alquiler Vacacional

## Stack Tecnológico
- **Framework**: Next.js con App Router
- **Lenguaje**: TypeScript (estricto, sin `any`)
- **Estilos**: Tailwind CSS + shadcn/ui
- **Autenticación**: NextAuth.js (solo para /admin)
- **i18n**: next-intl (solo para la web pública)
- **Base de datos futura**: PostgreSQL + Prisma

---

## Estructura de Carpetas

```
/app
  /[locale]         → Web pública con i18n (es, en, de, fr)
  /admin            → Panel privado SIN locale, SIN i18n
/messages
  es.json           → Traducciones español (idioma base)
  en.json           → Traducciones inglés
  de.json           → Traducciones alemán
  fr.json           → Traducciones francés
/lib
  constants.ts      → Constantes globales del proyecto
/types              → Tipos e interfaces globales compartidos
```

---

## Reglas de TypeScript

- **Prohibido usar `any`** — siempre tipar correctamente inferido del contexto
- **Interfaces y Types** deben vivir en archivos `.types.ts` junto al componente o en `/types` si son globales
- Usar `interface` para objetos y `type` para uniones, primitivos e intersecciones
- Todos los componentes deben tener sus props tipadas correctamente
- El proyecto debe compilar sin errores ni warnings de TypeScript

---

## Reglas de Constantes y Valores

- **Prohibido hardcodear magic numbers** — extraer siempre a constantes nombradas
- **Prohibido hardcodear textos visibles al usuario** — deben venir de los JSON de next-intl
- Las constantes globales viven en `/lib/constants.ts`
- Nombrar constantes en `SCREAMING_SNAKE_CASE`
- Usar siempre `const`, nunca `let` para valores que no cambian

---

## Reglas de Traducciones (next-intl)

- Los 4 archivos JSON deben tener **exactamente las mismas claves** — ninguna puede faltar en ningún idioma
- Idiomas soportados: `es` (defecto), `en`, `de`, `fr`
- El selector de idioma muestra la bandera emoji del idioma activo: 🇪🇸 🇬🇧 🇩🇪 🇫🇷
- El idioma seleccionado se guarda en cookie para recordarlo en futuras visitas
- La ruta `/admin` queda **completamente fuera del sistema i18n**, sin prefijo de idioma

---

## Reglas de Calidad de Código

- **Prohibidos los `console.log`** en el código — eliminarlos antes de cualquier commit
- Eliminar imports no utilizados en todos los archivos
- Eliminar variables declaradas pero no usadas
- Los nombres de variables y funciones deben ser descriptivos y en inglés
- No dejar código comentado sin justificación

---

## Arquitectura de la Web

### Web Pública `/[locale]`
- Pantalla principal: colección de carruseles, cada uno representa una vivienda
- Pantalla de detalle: más información de la vivienda + formulario de contacto
- Selector de idioma en la esquina superior derecha del header
- Las propiedades pueden estar activas o inactivas (visibilidad)

### Panel Admin `/admin`
- Ruta protegida con NextAuth.js
- Un único usuario administrador definido en variables de entorno
- Layout propio con sidebar de navegación, completamente separado de la web pública
- **Gestión de propiedades** (`/admin/propiedades`):
  - Listar, añadir, eliminar propiedades
  - Activar/desactivar visibilidad
- **Gestión de detalle** (`/admin/propiedades/[id]`):
  - Editar todos los campos de texto
  - Añadir, eliminar y reordenar fotos
- El panel debe ser responsive

---

## Modelo de Datos (futuro con Prisma)

```
Propiedad
  - id
  - titulo
  - activa (boolean)
  - fotos[]
  - detalle

Foto
  - id
  - url
  - orden
  - propiedadId

Detalle
  - id
  - campos editables de la pantalla de detalle
  - propiedadId
```

---

## Variables de Entorno Requeridas

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=   # cuando se implemente subida de fotos
```

---

## Antes de Tocar Cualquier Cosa

1. **Analiza primero** toda la estructura actual del proyecto
2. **Propón un plan** detallado de los cambios antes de ejecutar
3. **Espera confirmación** antes de modificar nada
4. **No rompas** lo que ya funciona — especialmente el middleware que gestiona tanto i18n como NextAuth

---

## Checklist de Revisión de Código

Antes de dar por terminada cualquier tarea, verificar:

- [ ] Sin ningún `any` en TypeScript
- [ ] Sin textos hardcodeados visibles al usuario
- [ ] Sin magic numbers en el código
- [ ] Sin `console.log` olvidados
- [ ] Sin imports no utilizados
- [ ] Interfaces y types en sus archivos `.types.ts`
- [ ] Constantes en `SCREAMING_SNAKE_CASE` en `/lib/constants.ts`
- [ ] Todos los JSON de traducción tienen las mismas claves
- [ ] El proyecto compila sin errores con `next build`
- [ ] `/admin` no tiene prefijo de locale
- [ ] La web pública funciona en los 4 idiomas

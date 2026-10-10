# PRODUCT.md — DMIT Facturador

Contexto de producto para trabajo de diseño y desarrollo. Escrito el 9-oct-2026.
No reemplaza al código: si algo de acá contradice al código, gana el código y este archivo se corrige.

## Qué es

Aplicación web de gestión y facturación para comercios y distribuidoras de Argentina.
Un usuario administra una o más empresas y desde la misma app:

- emite comprobantes de venta contra ARCA (ex AFIP) y los lista,
- carga clientes y sus cuentas corrientes,
- emite recibos y registra pagos recibidos,
- genera remitos con Código de Operación de Traslado (COT) de ARBA,
- mantiene el **catálogo**: categorías, listas de precios y productos.

## Quién lo usa

El dueño o administrador del negocio (no un equipo grande, no un usuario técnico).
Contexto de uso: escritorio, tarea administrativa repetida, con interrupciones — el mostrador,
el teléfono, un cliente esperando. También entra desde el celular para consultar.

Modo de las superficies: **Operate**. El usuario tiene que completar una tarea y volver a lo suyo.
La escaneabilidad, la consistencia y el largo del camino importan más que la expresión.

## Reglas del dominio que el diseño tiene que respetar

1. **El precio de venta no se carga: se calcula.** Cada producto tiene un costo y pertenece a una o
   más listas de precios; cada lista tiene un porcentaje de ganancia. `precio de venta = costo + %`.
   El mismo producto vale distinto en cada lista: la UI debe mostrar el precio resultante, no pedirlo.
2. **El IVA depende de la inscripción del emisor.** Si la empresa es monotributista o está exenta en
   IVA, sus artículos no gravan: el IVA se fija en 0% y se explica, no se elige.
3. **Las categorías son un árbol de dos o más niveles**, pero un producto puede no tener categoría.
   El código de categoría se usa para armar los códigos de productos y subcategorías.
4. **Un producto sin lista de precios no tiene precio de venta**: es un estado incompleto, y la UI
   tiene que guiar a crear la lista antes de guardar.
5. **Todo gira alrededor de la empresa activa.** Las entidades (categorías, listas, productos,
   clientes, comprobantes) pertenecen a una empresa; el usuario puede tener varias.

## Superficies principales

| Superficie | Ruta | Notas |
| --- | --- | --- |
| Catálogo · productos | `/sistema/productos/grilla` y `/listado` | alta y edición de producto |
| Catálogo · categorías | `/sistema/ingresar/categoria` | árbol + alta |
| Catálogo · listas de precios | `/sistema/ingresar-lista-de-precios` | alta y edición |
| Ventas | `/sistema/invoice`, `/sistema/list/invoice` | emisión y listado de comprobantes |
| Clientes | `/sistema/customer` | alta y listado |
| Recibos | `/sistema/receipts` | emisión, listado y pagos recibidos |
| ARBA | `/sistema/arba/cot` | remitos COT |
| Dashboard | `/sistema/dashboard` | indicadores |

## Modo mostrador (punto de venta)

`/sistema/invoice` tiene dos modos, persistidos en `localStorage.mostradorMode`:

- **Normal**: la pantalla histórica, con la configuración completa del comprobante a la vista y el buscador de productos en un modal (F12).
- **Mostrador**: pensado para el uso en el salón. Buscador **inline con autofoco** que filtra **en memoria por nombre y por código** (el catálogo se trae una vez; con más de 2000 productos cae a la búsqueda por servidor con debounce), Enter agrega el ítem resaltado, cantidades con − / +, **una lista de precios por venta** (recordada, cambiable por línea) y un panel con el **total siempre visible** (barra fija al pie en mobile). "Facturar" valida y dice qué falta en vez de quedar gris; Consumidor Final viene por defecto.

Ojo con dos cosas del backend al tocar este flujo:

- `GET /api/product` **sin `list`** devuelve **todo el catálogo como array plano** (con `name`, filtra por nombre); con `list` responde paginado. El buscador por código no existe del lado del servidor: se resuelve filtrando en memoria (por eso traer el catálogo una vez es lo que habilita escanear un código).
- `POST /api/afip/FECAESolicitar` **emite un comprobante real contra ARCA**: en desarrollo se prueba solo contra el mock.

## Qué soporta la API y qué no (verificado en `dmit-api-php`, oct-2026)

Antes de prometer una función en la UI, confirmar en el backend:

- `category`: **solo crear** (`index`, `store`). `update` y `destroy` existen pero están **vacíos**:
  un botón de renombrar o borrar categoría no haría nada.
- `price-list`: crear, editar (**el `PUT` exige los 4 campos**: `id`, `name`, `profit_percentage`,
  `active`; el backend hace `strtoupper` del nombre).
- `product`: crear y editar. **No hay borrado.**

## Convenciones de UI del proyecto

- Ant Design Vue 3 importado por componente + `vue3-styled-components`; el tema vive en
  `src/config/theme/themeVariables.ts` (primario `#8231D3`).
  Ojo: en el build actual los **tokens de Ant no se aplican** (los botones primarios salen con el azul
  por defecto `#1890FF`), así que el violeta aparece solo donde el CSS propio lo fija.
- Un solo contenedor por pantalla (`.catalog-surface` en las pantallas de catálogo); las secciones se
  separan con espaciado y tipografía. Sin tarjetas anidadas.
- Copy en **español rioplatense**; identificadores y código en inglés.
- Dinero con `font-variant-numeric: tabular-nums` y alineado a la derecha cuando va en columna.
- Movimiento: transiciones CSS con `cubic-bezier(0.16, 1, 0.3, 1)` y `prefers-reduced-motion`
  respetado. **GSAP no está instalado**: si se quiere usar, es una dependencia nueva que hay que aprobar.
- `sdCards`, `sdPageHeader` y `sdHeading` **no están registrados** como componentes: renderizan vacío.
  Las pantallas de catálogo ya no los usan; otras pantallas todavía sí.

## Condiciones conocidas (no son features)

- La empresa activa se fija en el guard del router (`src/app/router/index.ts`) tanto al venir del login
  como al recargar una ruta `/sistema/*` (arreglado en oct-2026: antes la condición era
  `from.path === '/auth/login'`, así que una recarga completa dejaba `CompanyGetter` vacío y las
  pantallas que dependen de la empresa —catálogo incluido— no cargaban nada). Se fija una sola vez:
  si ya hay empresa, no se pisa la que el usuario eligió en el panel.
- El armazón de la plantilla (logo, iconos y links de navegación) tiene azul propio en
  `src/assets/main.css`, fuera de los tokens del tema: no se toca sin decisión explícita.
- `ProductController` no implementa `destroy`: no hay borrado de productos.

## Entorno local sin backend

El backend real (Laravel + MySQL) necesita Docker, que en esta máquina está bloqueado por el sandbox, y
el PHP nativo no puede hablar con MySQL (falta `pdo_mysql` en 8.4 y Laravel 10 no corre en 7.4). Para
verificar UI se usa un mock stateful en `127.0.0.1:7000` y el override de entorno en
`.env.development.local` (gitignoreado): cualquier mail y clave sirven para entrar.

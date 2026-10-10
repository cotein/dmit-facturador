---
target: "https://facturador.dmit.ar/sistema/invoice — Generar comprobante de venta"
total_score: 18
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "file:/home/coto/Github/Dmit/dmit-facturador/src/app/pages/invoices/NewInvoice.vue"
target_fingerprint: "sha256:00e57631faed77d5936ffd979b333abaca8d8e5866ba83efc1452ab3bde7469b"
target_path: /home/coto/Github/Dmit/dmit-facturador/src/app/pages/invoices/NewInvoice.vue
timestamp: 2026-10-08T14-35-44Z
slug: src-app-pages-invoices-newinvoice-vue
---
# Crítica Impeccable — Pantalla "Generar comprobante de venta" (facturador DMIT)

Método: dual-agent (A: 61a5bb21 · B: 76a2fa5a) · Modo: **Operate** · v4.3.1
Objetivo: `/sistema/invoice` → `src/app/pages/invoices/NewInvoice.vue` + `src/app/components/invoice/**`

## Alcance de la verificación

- El sitio en vivo está detrás de un muro de login: no se pudo ver la pantalla renderizada.
- Se reconstruyó la pantalla **realmente desplegada** desde el bundle público servido por producción
  (`/assets/index-b26bc397.js` + chunk `/assets/NewInvoice-9a4d9203.js`).
- **Diferencia encontrada:** el bundle en vivo **no contiene "Modo Mostrador"** — ese modo existe sólo
  como trabajo local sin commitear. La producción es la versión previa (3 columnas de atajos + tarjeta).
- El detector determinístico de Impeccable **no analiza archivos `.vue`**: devolvió `[]` con exit 0 incluso
  sobre un fixture deliberadamente malo. Se considera **cobertura no disponible**, no un aprobado.

## Puntaje de salud de diseño (Nielsen)

| # | Heurística | Puntaje | Problema clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 2 | 5 skeletons duplicados; sin estado persistente post-emisión; éxito = toast de 5 s |
| 2 | Sistema ↔ mundo real | 3 | Vocabulario fiscal correcto; se filtra "Detalle" y restos de plantilla |
| 3 | Control y libertad | 2 | Borrar línea sin confirmación ni deshacer; el comprobante se pierde al salir de la ruta |
| 4 | Consistencia y estándares | 1 | Tres idiomas de input numérico en una fila; foco teal `#007c89`; botón `orange` |
| 5 | Prevención de errores | 2 | Validación sólo en el drawer; fecha acotada a ±5/±10 días sin explicación; sin confirmación antes de emitir |
| 6 | Reconocer antes que recordar | 1 | En desktop la única forma de agregar un ítem es la tecla **F12** (no hay botón) |
| 7 | Flexibilidad y eficiencia | 2 | Hay atajos, pero F12 está reservado por el navegador; sin atajo para Facturar |
| 8 | Estética y minimalismo | 2 | `transform: scale(0.95)` en vez de reflow; bloques comentados; ~240 px de editor Quill vacío |
| 9 | Recuperación de errores | 1 | El rechazo de ARCA sólo hace `console.log`; llega al usuario como nada |
| 10 | Ayuda y documentación | 2 | Buena ayuda contextual en comentarios; nada explica por qué "Facturar" está gris |

**Total: 18/40 — banda: Poor (45 %).**

## Veredicto de especificidad

El *motor* es de autor: matemática por línea de IVA/percepciones con un solo dueño
(`useInvoiceComposable.ts:131-190`), fusión de líneas repetidas (`:241-251`) y bootstrap de punto de venta
contra ARCA (`DrawerPtoVta.vue`). Pero el *marco y la gramática de interacción* son restos de la plantilla
comprada: `sdPageHeader`, 71 archivos con hooks `ninjadash-*`, tarjeta "Detalle" textual de plantilla y
botones `Print`/`Send Invoice` comentados. Consecuencia directa: **la acción primaria del producto (agregar
un ítem) quedó sin control visible en desktop**.

## Carga cognitiva

7 de 8 ítems del checklist fallan → **carga alta (crítico)**. Sólo pasa "agrupación".
Puntos de decisión con más de 4 opciones simultáneas: lista de comprobantes, lista de precios,
las 7 celdas de cada fila, y la fila superior de la pantalla en modo normal.

## Viaje emocional

El pico debería ser el CAE; lo que el usuario vive es una espera sin etiqueta. El cierre es un toast de 5 s
arriba a la izquierda con el número y el CAE, seguido del vaciado inmediato de la tabla: **si se pierde el
toast, el número de comprobante no se puede recuperar desde esa pantalla**. Reaseguro en el momento
irreversible: cero.

## Lo que funciona

1. La matemática fiscal está centralizada y es reactiva, con un único dueño del cálculo.
2. `insertProductOnInvoiceTable` fusiona líneas del mismo producto y precio en vez de duplicarlas.
3. Ayuda en el punto de uso: plantillas de comentarios copiables y el hint "Tecla Enter" dentro del modal.

## Problemas prioritarios

**[P0] La acción primaria no tiene control visible en desktop.**
Único camino: la tecla F12 (`NewInvoice.vue:24-29`), con botón sólo bajo `v-if="isMobile"`
(`FormInvoice.vue:228-237`). F12 está reservada en Chrome/Edge → abre DevTools. El usuario nuevo no puede
empezar la tarea. **Fix:** botón primario "Agregar ítem" en el encabezado de la tarjeta de detalle; el atajo
pasa a `a-tooltip` del botón.

**[P0] Los fallos de emisión son invisibles.**
`createInvoiceMutation.mutateAsync(...).catch()` sólo loguea (`ProductTable.vue:235-237`); un throw en
`:189` deja `loading = true` para siempre. **Fix:** `try/catch`, `loading = false` y `notification.error`
con el texto de ARCA verbatim + botón reintentar sin perder las líneas.

**[P1] Nada reasegura en el momento irreversible ni queda después.**
`@click="generateInvoice"` dispara ARCA directo; no hay resumen previo (letra, CUIT del receptor, total,
"no se puede deshacer") y tras emitir la tabla se vacía. **Fix:** resumen de confirmación antes de emitir y
panel de resultado persistente con PtoVta-Número, CAE y vencimiento, + Imprimir / Nueva factura.

**[P1] El habilitado de "Facturar" es un booleano invisible que puede estar en true con datos inválidos.**
`:disabled="loading || length==0 || !invoiceConfigIsValidated"` sin tooltip; `invoiceConfigIsValidated` no se
resetea en `onCloseCancel` ni en `invoiceInitialStatus`, mientras esos caminos sí anulan `voucher`.
**Fix:** `blockReason` computado + tooltip + reset del flag.

**[P2] Los inputs de línea admiten `NaN` y negativos hacia totales de validez fiscal.**
`parseFloat` sin clamp en `Unit.vue`, `Discount.vue`, `Quantity.vue`; además `Subtotal.vue:4`
desreferencia `invoice.customer.afip_inscription.id` sin guarda. **Fix:** `a-input-number` con `:min`,
`:precision` y normalización en blur; guarda en Subtotal.

## Banderas rojas por persona

- **Alex (usuario avanzado):** F12 abre DevTools; sin atajo para Facturar; sin movimiento con flechas entre
  filas; el selector de fecha rechaza el mes pasado sin explicación alcanzable por teclado.
- **Sam (lector de pantalla / teclado):** `Unit.vue` y `Discount.vue` son `<input>` desnudos sin label ni
  `aria-label` (la etiqueta visible es un span hermano): cada fila anuncia seis campos sin nombre. Sin región
  `aria-live` para la espera de ARCA ni para el CAE. Botón de borrar sólo ícono, con nombre en inglés.
- **Jordan (primerizo):** ve un título, tres líneas de texto de atajos y un encabezado "Ítems a facturar"
  sobre un cuerpo vacío sin estado vacío. Nada dice "presioná F12" ni ofrece botón. "Facturar" está gris sin
  motivo.

## Observaciones menores

- `a-table` usado como repetidor: una sola columna con `:scroll="{ x: '1000px' }"` y todo en `#bodyCell`.
- `ModalSearchProduct` montado dos veces y su listener de `keydown` global nunca se remueve (igual que el de
  `NewInvoice.vue`), que además sigue disparando mientras se escribe en los inputs.
- `ModalSearchProduct.vue` usa `isMobile` (un `Ref`) como booleano: el ancho es siempre `90%`.
- `Totals.vue` calcula el recargo del modo de pago y no lo renderiza; `TotalComprobante` nunca lo suma,
  mientras `AditionalPayment.vue` informa "Adicional: X%". **Riesgo fiscal, requiere decisión del dueño.**
- `InvoiceConfig.vue`: el esquema zod de `Concepto` y `SaleCondition` nunca puede fallar.
- `DrawerPtoVta` es un modal sin cierre ni footer: trampa dura si la empresa no tiene punto de venta.
- `console.log('🚀 ...')` en interacción ordinaria; CSS muerto; `<style scoped>` de `InvoiceConfig` que no
  puede alcanzar `.scale-down` usado en otros componentes.
- Sin guarda de borrador al salir de la ruta: se pierden todas las líneas cargadas.

## Correcciones a los assessments

- **Falso positivo de B:** afirmó que los assets no van comprimidos. Medido con `Accept-Encoding`, el JS viaja
  en gzip (4,91 MB → 1,44 MB) y el CSS también (439 KB → 62 KB). Sigue siendo pesado, pero no es lo reportado.
- **A revisó el working tree local**, que incluye "Modo Mostrador" sin commitear. Ese modo no está desplegado:
  los hallazgos sobre él aplican al código local, no a la producción actual.

## Preguntas de desbloqueo

- ¿Por qué una pantalla cuyo trabajo es "tipear rápido en el mostrador" esconde su único control de carga de
  productos detrás de una tecla reservada por el navegador?
- Si el CAE es lo único que importa, ¿por qué es lo único que desaparece a los 5 segundos?
- ¿El drawer "Datos del Cliente" es una decisión de revelación progresiva o simplemente donde entraron los
  campos? Si el CUIT del receptor nunca aparece en la pantalla principal, ¿cómo se detecta el cliente
  equivocado antes de apretar el botón irreversible?

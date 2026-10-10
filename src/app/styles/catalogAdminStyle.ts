import Styled from 'vue3-styled-components';

/**
 * Estilos compartidos de las pantallas de catálogo del facturador:
 * alta/edición de producto, listado de productos, categorías y listas de precios.
 *
 * Los valores son los tokens del tema (src/config/theme/themeVariables.ts):
 * primario #8231D3 · hover #6726A8 · éxito #01B81A · aviso #FA8B0C · error #FF0F0F
 * bordes #E3E6EF y #F1F2F6 · grises #F8F9FB y #F4F5F7 · texto #404040
 * texto secundario #585858 · tipografía Jost 15px · radio base 4px.
 *
 * Un solo contenedor por pantalla (`.catalog-surface`), secciones separadas por
 * espaciado y tipografía. Elevación declarada una sola vez: borde, sin sombra.
 */
const CatalogPage = Styled.div`
    /* Tokens locales del sistema de diseño, no colores nuevos */
    --cat-primary: #8231D3;
    --cat-primary-hover: #6726A8;
    --cat-success: #01B81A;
    --cat-warning: #FA8B0C;
    --cat-error: #FF0F0F;
    --cat-text: #404040;
    --cat-text-soft: #585858;
    --cat-muted: #8C90A4;
    --cat-border: #E3E6EF;
    --cat-border-light: #F1F2F6;
    --cat-bg-soft: #F8F9FB;
    --cat-bg-softer: #F4F5F7;
    --cat-radius: 4px;
    --cat-ease: cubic-bezier(0.16, 1, 0.3, 1);

    font-size: 15px;
    line-height: 1.5;
    color: var(--cat-text);

    h1, h2, h3, h4 {
        margin: 0;
        font-weight: 600;
        color: var(--cat-text);
        text-wrap: balance;
    }

    .num,
    .money,
    .ant-input-number-input {
        font-variant-numeric: tabular-nums;
    }

    .money {
        text-align: right;
        white-space: nowrap;
    }

    .muted {
        color: var(--cat-text-soft);
    }

    /* Controles de Ant que traen su propio color por defecto y quedaban por
       debajo del piso de contraste sobre blanco:
       - los botones tipo link traen el azul por defecto (3.24:1 en 14px);
         con el primario del sistema quedan en 6.33:1 y coinciden con los links
         del resto de la aplicación;
       - los placeholders vienen en rgba(0,0,0,.25) = 1.84:1 y en el filtro de
         categorías el placeholder es la única etiqueta visible. */
    .ant-btn-link {
        min-height: 24px;
        color: var(--cat-primary);
    }

    .ant-btn-link:hover,
    .ant-btn-link:focus {
        color: var(--cat-primary-hover);
    }

    .ant-btn-link[disabled] {
        color: rgba(0, 0, 0, 0.25);
    }

    .ant-select-selection-placeholder,
    .ant-input::placeholder,
    .ant-picker-input > input::placeholder,
    .ant-input-affix-wrapper input::placeholder {
        color: #6f6f6f;
    }

    /* Objetivos táctiles: las migas de pan y la paginación venían en 16-19px
       de alto, por debajo de los 24px mínimos. */
    .page-head .ant-breadcrumb a,
    .ant-pagination li a,
    .ant-pagination .ant-pagination-item-link {
        display: inline-flex;
        align-items: center;
        min-height: 24px;
    }

    /* ---------------------------------------------------------------- página */
    .page-head {
        margin-bottom: 20px;
    }

    .page-head__title {
        font-size: 24px;
        line-height: 1.25;
    }

    .page-head__sub {
        margin: 6px 0 0;
        font-size: 14px;
        color: var(--cat-text-soft);
    }

    .page-head .ant-breadcrumb {
        margin-bottom: 10px;
        font-size: 13px;
    }

    .page-head .ant-breadcrumb a,
    .page-head .ant-breadcrumb li:last-child span {
        color: var(--cat-text-soft);
    }

    .page-head .ant-breadcrumb a:hover {
        color: var(--cat-primary);
    }

    .page-head__row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 20px;
        align-items: flex-end;
        justify-content: space-between;
    }

    /* ------------------------------------------------------------ contenedor */
    .catalog-surface {
        position: relative;
        margin-bottom: 24px;
        padding: 24px;
        background: #FFFFFF;
        border: 1px solid var(--cat-border);
        border-radius: var(--cat-radius);
    }

    /* -------------------------------------------------------------- secciones */
    .form-section {
        animation: cat-fade 200ms var(--cat-ease) both;
    }

    .form-section + .form-section {
        margin-top: 32px;
        padding-top: 32px;
        border-top: 1px solid var(--cat-border-light);
    }

    .form-section:nth-of-type(2) {
        animation-delay: 60ms;
    }

    .form-section:nth-of-type(3) {
        animation-delay: 120ms;
    }

    .section-title {
        font-size: 18px;
        line-height: 1.3;
    }

    .section-hint {
        max-width: 68ch;
        margin: 4px 0 20px;
        font-size: 14px;
        color: var(--cat-text-soft);
    }

    .section-count {
        font-weight: 400;
        font-size: 14px;
        color: var(--cat-text-soft);
    }

    .field-grid {
        display: grid;
        gap: 0 20px;
        grid-template-columns: minmax(0, 1fr);
    }

    .field-grid .ant-form-item {
        margin-bottom: 20px;
    }

    /*
     * El tema trae el label y el control como columnas de ancho completo
     * (flex: 0 0 100%) dentro de un contenedor con flex-wrap, así que en un
     * formulario vertical quedaban uno al lado del otro y desbordaban.
     * En estas pantallas el label va arriba y el control ocupa todo el ancho.
     */
    .catalog-surface .ant-form-item {
        flex-wrap: nowrap;
    }

    .catalog-surface .ant-form-item > .ant-form-item-label,
    .catalog-surface .ant-form-item > .ant-form-item-control {
        flex: 0 0 auto;
        width: 100%;
        max-width: 100%;
        min-width: 0;
    }

    .catalog-surface .ant-form-item > .ant-form-item-label {
        padding: 0 0 6px;
        text-align: left;
    }

    .field-help {
        display: block;
        margin-top: -14px;
        margin-bottom: 20px;
        font-size: 13px;
        color: var(--cat-text-soft);
    }

    .field-help--note {
        padding: 8px 12px;
        background: var(--cat-bg-soft);
        border-radius: var(--cat-radius);
        margin: 8px 0 0;
    }

    .ant-form-item-extra {
        color: var(--cat-text-soft);
        font-size: 13px;
    }

    @media (min-width: 768px) {
        .field-grid--2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .field-grid--3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    /* ------------------------------------------------------ barra de acciones */
    .action-bar {
        position: sticky;
        z-index: 5;
        bottom: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 12px 24px;
        align-items: center;
        justify-content: space-between;
        margin: 32px -24px -24px;
        padding: 14px 24px;
        background: #FFFFFF;
        border-top: 1px solid var(--cat-border);
        border-radius: 0 0 var(--cat-radius) var(--cat-radius);
        animation: cat-rise 240ms var(--cat-ease) both;
    }

    .action-bar__summary {
        min-width: 0;
        flex: 1 1 320px;
    }

    .action-bar__name {
        font-weight: 600;
    }

    .action-bar__meta {
        margin-top: 2px;
        font-size: 13px;
        color: var(--cat-text-soft);
    }

    .action-bar__sep {
        padding: 0 6px;
        color: var(--cat-muted);
    }

    .action-bar__prices {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 18px;
        margin: 6px 0 0;
        padding: 0;
        list-style: none;
        font-size: 13px;
    }

    .action-bar__prices li {
        display: flex;
        gap: 8px;
        color: var(--cat-text-soft);
    }

    .action-bar__prices b {
        color: var(--cat-text);
        font-variant-numeric: tabular-nums;
    }

    .action-bar__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
    }

    .action-bar__error {
        display: flex;
        gap: 6px;
        align-items: center;
        max-width: 46ch;
        font-size: 13px;
        color: var(--cat-error);
    }

    /* ---------------------------------------------------------------- toolbar */
    .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--cat-border-light);
    }

    .toolbar__search {
        flex: 1 1 260px;
        max-width: 380px;
    }

    .toolbar__select {
        flex: 0 1 240px;
    }

    .toolbar__spacer {
        flex: 1 1 auto;
    }

    .toolbar__note {
        font-size: 13px;
        color: var(--cat-text-soft);
    }

    /* Cambio grilla <-> listado */
    .results-view {
        animation: cat-fade 180ms var(--cat-ease) both;
    }

    .view-toggle {
        display: inline-flex;
        padding: 3px;
        background: var(--cat-bg-soft);
        border: 1px solid var(--cat-border-light);
        border-radius: var(--cat-radius);
    }

    .view-toggle a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: var(--cat-radius);
        color: var(--cat-text-soft);
        transition: background-color 200ms var(--cat-ease), color 200ms var(--cat-ease);
    }

    .view-toggle a svg {
        fill: currentColor;
    }

    .view-toggle a:hover {
        color: var(--cat-primary);
    }

    .view-toggle a.is-active {
        background: #FFFFFF;
        color: var(--cat-primary);
    }

    .results-count {
        margin: 0 0 16px;
        font-size: 14px;
        color: var(--cat-text-soft);
    }

    /* -------------------------------------------------------------- product */
    .product-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 18px;
        background: #FFFFFF;
        border: 1px solid var(--cat-border);
        border-radius: var(--cat-radius);
        transition: border-color 200ms var(--cat-ease);
    }

    .product-card:hover,
    .product-card:focus-within {
        border-color: var(--cat-primary);
    }

    .product-card__name {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.35;
    }

    .product-card__meta {
        margin: 4px 0 12px;
        font-size: 13px;
        color: var(--cat-text-soft);
        overflow-wrap: anywhere;
    }

    .product-card__prices {
        margin: 0;
        padding: 0;
        list-style: none;
        border-top: 1px solid var(--cat-border-light);
    }

    .product-card__prices li {
        display: flex;
        gap: 12px;
        align-items: baseline;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid var(--cat-border-light);
        font-size: 14px;
    }

    .product-card__prices span {
        color: var(--cat-text-soft);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .product-card__prices b {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }

    .product-card__more {
        margin: 6px 0 0;
        font-size: 13px;
        color: var(--cat-text-soft);
    }

    .product-card__empty {
        margin: 0;
        padding: 6px 0;
        border-top: 1px solid var(--cat-border-light);
        font-size: 14px;
        color: var(--cat-text-soft);
    }

    .product-card__actions {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: auto;
        padding-top: 16px;
    }

    .product-row {
        display: grid;
        gap: 4px 20px;
        align-items: center;
        grid-template-columns: minmax(0, 1fr);
        padding: 16px 18px;
        background: #FFFFFF;
        border: 1px solid var(--cat-border);
        border-radius: var(--cat-radius);
        transition: border-color 200ms var(--cat-ease);
    }

    .product-row:hover,
    .product-row:focus-within {
        border-color: var(--cat-primary);
    }

    .product-row__prices {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 18px;
        margin: 8px 0 0;
        padding: 0;
        list-style: none;
        font-size: 14px;
    }

    .product-row__prices li {
        display: flex;
        gap: 8px;
        color: var(--cat-text-soft);
    }

    .product-row__prices b {
        color: var(--cat-text);
        font-variant-numeric: tabular-nums;
    }

    @media (min-width: 992px) {
        .product-row {
            grid-template-columns: minmax(0, 1fr) auto auto;
        }

        .product-row__prices {
            margin-top: 0;
            justify-content: flex-end;
        }
    }

    /* ------------------------------------------------------------ estados */
    .state-box {
        padding: 40px 24px;
        text-align: center;
        background: var(--cat-bg-soft);
        border: 1px dashed var(--cat-border);
        border-radius: var(--cat-radius);
    }

    .state-box__title {
        font-size: 17px;
        font-weight: 600;
    }

    .state-box__text {
        max-width: 52ch;
        margin: 6px auto 0;
        color: var(--cat-text-soft);
    }

    .state-box__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        margin-top: 18px;
    }

    /* --------------------------------------------------------- listas precio */
    .price-list-rows {
        margin: 0;
        padding: 0;
        list-style: none;
        border-top: 1px solid var(--cat-border-light);
    }

    .price-list-row {
        display: grid;
        gap: 6px 20px;
        align-items: center;
        grid-template-columns: minmax(0, 1fr);
        padding: 14px 0;
        border-bottom: 1px solid var(--cat-border-light);
    }

    .price-list-row__name {
        font-weight: 600;
    }

    .price-list-row__pct {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--cat-primary);
    }

    .price-list-row__example,
    .price-list-row__count {
        font-size: 13px;
        color: var(--cat-text-soft);
    }

    .price-list-row__example b {
        color: var(--cat-text);
        font-variant-numeric: tabular-nums;
    }

    .price-list-row__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
    }

    @media (min-width: 992px) {
        .price-list-row {
            grid-template-columns: minmax(0, 1.4fr) 80px minmax(0, 1.2fr) minmax(0, 0.8fr) auto;
        }
    }

    .price-list-example {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 10px;
        align-items: baseline;
        margin: 0 0 20px;
        padding: 10px 14px;
        background: var(--cat-bg-soft);
        border-radius: var(--cat-radius);
        font-size: 14px;
        color: var(--cat-text-soft);
    }

    .price-list-example b {
        color: var(--cat-text);
        font-variant-numeric: tabular-nums;
    }

    /* -------------------------------------------------------- categorías */
    .category-layout {
        display: grid;
        gap: 28px;
        grid-template-columns: minmax(0, 1fr);
    }

    @media (min-width: 992px) {
        .category-layout {
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
            gap: 40px;
        }

        .category-layout__aside {
            padding-left: 40px;
            border-left: 1px solid var(--cat-border-light);
        }
    }

    .tree-node {
        display: flex;
        gap: 10px;
        align-items: center;
        width: 100%;
        min-width: 0;
    }

    .catalog-surface .ant-tree-node-content-wrapper {
        display: flex;
        align-items: center;
        min-width: 0;
    }

    .catalog-surface .ant-tree-title {
        min-width: 0;
        flex: 1 1 auto;
    }

    /* El nombre es un botón real: es la forma de elegir el padre también con teclado. */
    .tree-node__name {
        flex: 0 1 auto;
        min-width: 0;
        padding: 2px 4px;
        overflow: hidden;
        font: inherit;
        color: inherit;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: none;
        border: 0;
        border-radius: var(--cat-radius);
        cursor: pointer;
    }

    .tree-node__name:hover {
        color: var(--cat-primary);
        text-decoration: underline;
    }

    .tree-node__name:focus-visible {
        outline: 2px solid var(--cat-primary);
        outline-offset: 1px;
    }

    .tree-node__code {
        font-size: 12px;
        font-variant-numeric: tabular-nums;
        color: var(--cat-text-soft);
    }

    .tree-node__count {
        font-size: 12px;
        color: var(--cat-text-soft);
    }

    .tree-node__add {
        margin-left: auto;
        opacity: 0;
        transition: opacity 200ms var(--cat-ease);
    }

    .tree-node:focus-within .tree-node__add,
    .tree-node:hover .tree-node__add {
        opacity: 1;
    }

    @media (hover: none) {
        .tree-node__add {
            opacity: 1;
        }
    }

    @media (max-width: 767px) {
        .tree-node__add {
            display: none;
        }
    }

    .parent-chip {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        padding: 6px 12px;
        background: var(--cat-bg-soft);
        border: 1px solid var(--cat-border-light);
        border-radius: var(--cat-radius);
        font-size: 14px;
    }

    .parent-chip__clear {
        padding: 0;
        border: 0;
        background: none;
        color: var(--cat-primary);
        cursor: pointer;
    }

    .parent-chip__clear:hover {
        color: var(--cat-primary-hover);
        text-decoration: underline;
    }

    .inline-create {
        margin-top: 4px;
    }

    .inline-create__panel {
        display: grid;
        gap: 12px;
        grid-template-columns: minmax(0, 1fr);
        align-items: end;
        margin-top: 12px;
        padding: 16px;
        background: var(--cat-bg-soft);
        border: 1px solid var(--cat-border-light);
        border-radius: var(--cat-radius);
        animation: cat-fade 180ms var(--cat-ease) both;
    }

    .inline-create__panel .ant-form-item {
        margin-bottom: 0;
    }

    .inline-create__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    @media (min-width: 768px) {
        .inline-create__panel {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
        }
    }

    /* ------------------------------------------------------------ lista de precios editable */
    .price-list-editor {
        display: grid;
        gap: 12px;
        grid-template-columns: minmax(0, 1fr);
        align-items: end;
        padding: 4px 0;
    }

    .price-list-editor .ant-form-item {
        margin-bottom: 0;
    }

    @media (min-width: 992px) {
        .price-list-editor {
            grid-template-columns: minmax(0, 1.2fr) 140px minmax(0, 1fr) auto;
        }
    }

    /* ------------------------------------------------- checkboxes de listas */
    .price-list-picker {
        display: flex;
        flex-direction: column;
        width: 100%;
        border-top: 1px solid var(--cat-border-light);
    }

    .price-list-picker .ant-checkbox-group {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .price-list-picker .ant-checkbox-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 0;
        padding: 14px 4px;
        border-bottom: 1px solid var(--cat-border-light);
        transition: background-color 200ms var(--cat-ease);
    }

    .price-list-picker .ant-checkbox-wrapper:hover {
        background: var(--cat-bg-soft);
    }

    .price-list-picker .ant-checkbox {
        align-self: center;
    }

    .price-list-picker__body {
        display: flex;
        flex: 1 1 auto;
        gap: 8px 20px;
        align-items: baseline;
        justify-content: space-between;
        min-width: 0;
    }

    .price-list-picker__name {
        font-weight: 500;
        overflow-wrap: anywhere;
    }

    .price-list-picker__pct {
        flex: 0 0 auto;
        font-size: 13px;
        font-variant-numeric: tabular-nums;
        color: var(--cat-text-soft);
    }

    .price-list-picker__price {
        flex: 0 0 auto;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        text-align: right;
        white-space: nowrap;
    }

    /* -------------------------------------------------------------- focus */
    .ant-btn:focus-visible,
    .tree-node__name:focus-visible,
    .ant-input:focus-visible,
    .ant-input-affix-wrapper:focus-visible,
    .ant-select-focused .ant-select-selector,
    .ant-checkbox-input:focus-visible + .ant-checkbox-inner,
    .parent-chip__clear:focus-visible {
        outline: 2px solid var(--cat-primary);
        outline-offset: 2px;
    }

    /* ---------------------------------------------------------- movimiento */
    @keyframes cat-fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes cat-rise {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: none;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .form-section,
        .action-bar,
        .results-view,
        .inline-create__panel {
            animation: none;
        }

        .product-card,
        .product-row,
        .tree-node__add,
        .price-list-picker .ant-checkbox-wrapper {
            transition: none;
        }
    }
`;

export { CatalogPage };

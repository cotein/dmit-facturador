import Styled from 'vue3-styled-components';

/**
 * Estilos del modo mostrador (punto de venta).
 *
 * Usa los mismos tokens que `catalogAdminStyle.ts` para que el mostrador se sienta
 * parte de la misma aplicación: primario #8231D3, bordes #E3E6EF y #F1F2F6,
 * grises #F8F9FB y #F4F5F7, texto #404040, texto secundario #585858, Jost 15px,
 * radio base 4px.
 *
 * Criterio de densidad: es una pantalla de uso intensivo. Jerarquía por tamaño y
 * peso de tipografía, separación por bordes de 1px y espaciado; cero decoración.
 * La elevación se declara una sola vez por elemento (borde, sin sombra) y no hay
 * tarjetas anidadas.
 */
const PosPage = Styled.div`
    --pos-primary: #8231D3;
    --pos-primary-hover: #6726A8;
    --pos-success: #01B81A;
    --pos-warning: #FA8B0C;
    --pos-error: #FF0F0F;
    --pos-text: #404040;
    --pos-text-soft: #585858;
    --pos-border: #E3E6EF;
    --pos-border-light: #F1F2F6;
    --pos-bg-soft: #F8F9FB;
    --pos-bg-softer: #F4F5F7;
    --pos-radius: 4px;
    --pos-ease: cubic-bezier(0.16, 1, 0.3, 1);

    font-size: 15px;
    line-height: 1.5;
    color: var(--pos-text);

    /* ------------------------------------------------------------------ layout */

    .pos-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: minmax(0, 1fr);
        align-items: start;
    }

    /* Deja aire para la barra fija de mobile: sin esto tapa el final del panel. */
    .pos-page {
        padding-bottom: 76px;
    }

    @media (min-width: 992px) {
        .pos-page {
            padding-bottom: 0;
        }
    }

    .pos-main,
    .pos-aside {
        min-width: 0;
    }

    @media (min-width: 992px) {
        .pos-grid {
            grid-template-columns: minmax(0, 1fr) 340px;
        }

        .pos-aside {
            position: sticky;
            top: 16px;
        }
    }

    /* --------------------------------------------------------------- superficies */

    .pos-surface {
        background: #FFFFFF;
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
    }

    .pos-surface + .pos-surface {
        margin-top: 16px;
    }

    /* ------------------------------------------------------------------ numeros */

    .num,
    .money,
    input[inputmode='numeric'] {
        font-variant-numeric: tabular-nums;
    }

    .money {
        text-align: right;
        white-space: nowrap;
    }

    /* --------------------------------------------------------------- buscador */

    .pos-search {
        position: relative;
        padding: 16px;
    }

    .pos-search__row {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .pos-search__icon {
        flex: 0 0 auto;
        color: var(--pos-text-soft);
    }

    .pos-search__input {
        flex: 1 1 auto;
        min-width: 0;
    }

    .pos-search__input .ant-input {
        height: 44px;
        font-size: 16px;
        border-radius: var(--pos-radius);
    }

    .pos-search__label {
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        font-weight: 600;
        color: var(--pos-text-soft);
    }

    .pos-search__spinner {
        flex: 0 0 auto;
    }

    .pos-search__hint {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        align-items: center;
        margin: 10px 0 0;
        padding: 0;
        list-style: none;
        font-size: 13px;
        color: var(--pos-text-soft);
    }

    .pos-search__hint li {
        display: flex;
        gap: 6px;
        align-items: center;
    }

    kbd {
        display: inline-block;
        min-width: 22px;
        padding: 1px 6px;
        font-family: inherit;
        font-size: 12px;
        font-weight: 600;
        line-height: 18px;
        text-align: center;
        color: var(--pos-text);
        background: var(--pos-bg-softer);
        border: 1px solid var(--pos-border);
        border-bottom-width: 2px;
        border-radius: var(--pos-radius);
    }

    /* --------------------------------------------------------- resultados del buscador */

    .pos-results {
        position: absolute;
        z-index: 30;
        right: 16px;
        left: 16px;
        max-height: 60vh;
        margin: 6px 0 0;
        padding: 0;
        overflow-y: auto;
        list-style: none;
        background: #FFFFFF;
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
        animation: pos-drop 180ms var(--pos-ease) both;
    }

    .pos-result {
        display: grid;
        gap: 2px 12px;
        align-items: center;
        grid-template-columns: minmax(0, 1fr) auto;
        width: 100%;
        padding: 10px 14px;
        font: inherit;
        color: inherit;
        text-align: left;
        background: none;
        border: 0;
        border-bottom: 1px solid var(--pos-border-light);
        /* Reservado para el resultado seleccionado: no mueve el contenido al cambiar. */
        border-left: 1px solid transparent;
        cursor: pointer;
    }

    .pos-result:last-child {
        border-bottom: 0;
    }

    .pos-result:hover {
        background: var(--pos-bg-soft);
    }

    .pos-result.is-active {
        /* Antes el fondo era un gris (#F4F5F7) casi igual al del panel: navegando con
           el teclado no se veía en qué producto estabas parado. */
        background: rgba(130, 49, 211, 0.1);
        border-left-color: var(--pos-primary);
    }

    .pos-result.is-active .pos-result__name,
    .pos-result.is-active .pos-result__price {
        color: var(--pos-primary);
    }

    .pos-result__name {
        font-weight: 600;
        overflow-wrap: anywhere;
    }

    .pos-result__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 10px;
        font-size: 13px;
        color: var(--pos-text-soft);
    }

    .pos-result__code {
        font-variant-numeric: tabular-nums;
    }

    .pos-result__price {
        font-weight: 600;
    }

    .pos-result mark {
        padding: 0 1px;
        color: inherit;
        background: #EFE3FB;
        border-radius: 2px;
    }

    .pos-search__message {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 14px;
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
        background: var(--pos-bg-soft);
        animation: pos-drop 180ms var(--pos-ease) both;
    }

    .pos-search__message--error {
        color: var(--pos-text);
        border-color: var(--pos-error);
    }

    .pos-search__message-title {
        font-weight: 600;
    }

    .pos-search__message-text {
        margin: 2px 0 0;
        font-size: 14px;
        color: var(--pos-text-soft);
    }

    .pos-search__message-actions {
        margin-top: 10px;
    }

    /* ------------------------------------------------------------------ carrito */

    .pos-cart__head {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
        align-items: baseline;
        justify-content: space-between;
        padding: 14px 16px;
        border-bottom: 1px solid var(--pos-border-light);
    }

    .pos-cart__title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }

    .pos-cart__count {
        font-size: 13px;
        color: var(--pos-text-soft);
    }

    .pos-cart__body {
        max-height: 58vh;
        overflow-y: auto;
    }

    @media (min-width: 992px) {
        .pos-cart__body {
            max-height: calc(100vh - 420px);
            min-height: 160px;
        }
    }

    .pos-cart__empty {
        padding: 32px 16px;
        text-align: center;
    }

    .pos-cart__empty-title {
        font-size: 16px;
        font-weight: 600;
    }

    .pos-cart__empty-text {
        max-width: 46ch;
        margin: 6px auto 0;
        font-size: 14px;
        color: var(--pos-text-soft);
    }

    /* ------------------------------------------------------------ línea del carrito */

    .pos-lines {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .pos-line {
        display: grid;
        gap: 8px 12px;
        grid-template-columns: minmax(0, 1fr) auto;
        padding: 12px 16px;
        border-bottom: 1px solid var(--pos-border-light);
        animation: pos-line-in 180ms var(--pos-ease) both;
    }

    .pos-line:last-child {
        border-bottom: 0;
    }

    .pos-line__head {
        display: flex;
        gap: 10px;
        align-items: baseline;
        min-width: 0;
    }

    .pos-line__index {
        flex: 0 0 auto;
        min-width: 18px;
        font-size: 13px;
        color: var(--pos-text-soft);
        font-variant-numeric: tabular-nums;
    }

    .pos-line__name {
        min-width: 0;
        font-weight: 600;
        overflow-wrap: anywhere;
    }

    .pos-line__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 2px 10px;
        margin: 2px 0 0;
        font-size: 13px;
        color: var(--pos-text-soft);
    }

    .pos-line__amount {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        text-align: right;
    }

    .pos-line__total {
        font-size: 16px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }

    .pos-line__detail {
        font-size: 13px;
        color: var(--pos-text-soft);
        font-variant-numeric: tabular-nums;
    }

    .pos-line__controls {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        align-items: flex-end;
        grid-column: 1 / -1;
    }

    .pos-field {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .pos-field__label {
        font-size: 12px;
        color: var(--pos-text-soft);
    }

    .pos-field--pricelist {
        flex: 1 1 170px;
        max-width: 220px;
    }

    .pos-field--unit {
        flex: 0 0 110px;
    }

    .pos-field--discount {
        flex: 0 0 92px;
    }

    /* Control de cantidad: − [n] + */
    .pos-qty {
        display: inline-flex;
        align-items: stretch;
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
        overflow: hidden;
    }

    .pos-qty__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        min-height: 30px;
        padding: 0;
        font-size: 16px;
        line-height: 1;
        color: var(--pos-text);
        background: var(--pos-bg-soft);
        border: 0;
        cursor: pointer;
        transition: background-color 180ms var(--pos-ease), color 180ms var(--pos-ease);
    }

    .pos-qty__btn:hover:not(:disabled) {
        color: var(--pos-primary);
        background: var(--pos-bg-softer);
    }

    .pos-qty__btn:disabled {
        color: var(--pos-text-soft);
        cursor: not-allowed;
    }

    .pos-qty__input {
        width: 54px;
        min-height: 30px;
        padding: 0 6px;
        font: inherit;
        font-variant-numeric: tabular-nums;
        text-align: center;
        color: var(--pos-text);
        background: #FFFFFF;
        border: 0;
        border-right: 1px solid var(--pos-border);
        border-left: 1px solid var(--pos-border);
        border-radius: 0;
    }

    .pos-input {
        width: 100%;
        min-height: 30px;
        padding: 0 8px;
        font: inherit;
        font-variant-numeric: tabular-nums;
        text-align: right;
        color: var(--pos-text);
        background: #FFFFFF;
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
    }

    .pos-line__remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 30px;
        min-height: 30px;
        padding: 0 8px;
        font: inherit;
        color: var(--pos-text-soft);
        background: #FFFFFF;
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
        cursor: pointer;
        transition: color 180ms var(--pos-ease), border-color 180ms var(--pos-ease);
    }

    .pos-line__remove:hover {
        color: var(--pos-error);
        border-color: var(--pos-error);
    }

    /* ------------------------------------------------------------ panel de venta */

    .pos-panel {
        padding: 16px;
    }

    .pos-panel__section + .pos-panel__section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--pos-border-light);
    }

    .pos-panel__label {
        display: block;
        margin-bottom: 4px;
        font-size: 13px;
        font-weight: 600;
        color: var(--pos-text-soft);
    }

    .pos-panel__customer {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
    }

    .pos-panel__customer-name {
        min-width: 0;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .pos-panel__rows {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .pos-panel__rows li {
        display: flex;
        gap: 12px;
        align-items: baseline;
        justify-content: space-between;
        padding: 5px 0;
        font-size: 14px;
    }

    .pos-panel__rows span:first-child {
        color: var(--pos-text-soft);
    }

    .pos-panel__rows b {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        text-align: right;
    }

    .pos-panel__total {
        display: flex;
        gap: 12px;
        align-items: baseline;
        justify-content: space-between;
        margin: 10px 0 0;
        padding-top: 12px;
        border-top: 1px solid var(--pos-border);
    }

    .pos-panel__total-label {
        font-size: 15px;
        font-weight: 600;
    }

    .pos-panel__total-amount {
        font-size: 30px;
        font-weight: 600;
        line-height: 1.1;
        font-variant-numeric: tabular-nums;
    }

    .pos-panel__action {
        margin-top: 16px;
    }

    .pos-panel__action .ant-btn {
        width: 100%;
        min-height: 46px;
        font-size: 17px;
        font-weight: 600;
    }

    .pos-alert {
        margin-top: 12px;
        padding: 10px 12px;
        font-size: 14px;
        background: var(--pos-bg-soft);
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
    }

    .pos-alert--error {
        border-color: var(--pos-error);
    }

    .pos-alert__title {
        font-weight: 600;
    }

    .pos-alert ul {
        margin: 4px 0 0;
        padding-left: 18px;
    }

    .pos-alert li + li {
        margin-top: 2px;
    }

    /* ------------------------------------------------------------- más opciones */

    .pos-more__toggle {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-height: 32px;
        padding: 0;
        font: inherit;
        font-weight: 600;
        color: var(--pos-text);
        text-align: left;
        background: none;
        border: 0;
        cursor: pointer;
    }

    .pos-more__caret {
        color: var(--pos-text-soft);
        transition: transform 180ms var(--pos-ease);
    }

    .pos-more__toggle[aria-expanded='true'] .pos-more__caret {
        transform: rotate(180deg);
    }

    .pos-more__body {
        margin-top: 12px;
    }

    .pos-more__body .ant-form-item {
        margin-bottom: 12px;
    }

    .pos-more__body .ant-form-item:last-child {
        margin-bottom: 0;
    }

    /* -------------------------------------- comprobante y configuración (modo normal) */

    /* Lo que el modo normal suma sobre el mostrador: la vista previa del comprobante,
       la configuración completa a la vista y las acciones del comprobante. Son las
       mismas superficies del panel, apiladas en la columna principal. */
    .pos-doc {
        padding: 16px;
    }

    .pos-doc__title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }

    .pos-doc__hint {
        margin: 4px 0 12px;
        font-size: 13px;
        color: var(--pos-text-soft);
    }

    .pos-doc__section + .pos-doc__section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--pos-border-light);
    }

    .pos-doc__section-title {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: var(--pos-text-soft);
        text-transform: uppercase;
    }

    /* El facsímil viene con el padding del comprobante impreso: se ajusta a la
       densidad de la pantalla sin cambiarle la jerarquía. */
    .pos-doc__preview .invoice-letter-inner {
        padding: 20px 24px;
        border-radius: var(--pos-radius);
    }

    .pos-doc__meta {
        margin-top: 12px;
    }

    .pos-doc__meta h3 {
        margin: 0;
        font-size: 13px;
        font-weight: 500;
        color: var(--pos-text-soft);
    }

    .pos-doc__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    }

    .pos-doc__actions + .pos-doc__actions {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--pos-border-light);
    }

    .pos-doc__actions .ant-btn {
        min-height: 32px;
    }

    .pos-doc__note {
        margin: 12px 0 0;
        font-size: 13px;
        color: var(--pos-text-soft);
    }

    .pos-doc__form .ant-form-item {
        margin-bottom: 12px;
    }

    /* -------------------------------------------------------- barra inferior mobile */

    .pos-mobilebar {
        position: fixed;
        z-index: 40;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: #FFFFFF;
        border-top: 1px solid var(--pos-border);
    }

    .pos-mobilebar__summary {
        display: flex;
        gap: 6px;
        align-items: baseline;
        font-size: 14px;
        color: var(--pos-text-soft);
    }

    .pos-mobilebar__total {
        font-size: 20px;
        font-weight: 600;
        color: var(--pos-text);
        font-variant-numeric: tabular-nums;
    }

    .pos-mobilebar .ant-btn {
        min-height: 40px;
    }

    @media (min-width: 992px) {
        .pos-mobilebar {
            display: none;
        }
    }

    /* ----------------------------------------------------------------- cambiar modo */

    .pos-modebar {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 16px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding: 12px 16px;
        background: #FFFFFF;
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
    }

    .pos-modebar__state {
        display: flex;
        gap: 10px;
        align-items: center;
        min-width: 0;
    }

    .pos-modebar__badge {
        flex: 0 0 auto;
        padding: 2px 10px;
        font-size: 13px;
        font-weight: 600;
        color: #FFFFFF;
        background: var(--pos-primary);
        border-radius: var(--pos-radius);
    }

    .pos-modebar__badge--normal {
        color: var(--pos-text);
        background: var(--pos-bg-softer);
        border: 1px solid var(--pos-border);
    }

    .pos-modebar__text {
        min-width: 0;
        font-size: 14px;
        color: var(--pos-text-soft);
    }

    .pos-mode-switch {
        display: inline-flex;
        gap: 3px;
        padding: 3px;
        background: var(--pos-bg-soft);
        border: 1px solid var(--pos-border-light);
        border-radius: var(--pos-radius);
    }

    .pos-mode-switch__btn {
        min-height: 32px;
        padding: 5px 14px;
        font: inherit;
        font-size: 14px;
        color: var(--pos-text-soft);
        background: none;
        border: 0;
        border-radius: var(--pos-radius);
        cursor: pointer;
        transition: background-color 180ms var(--pos-ease), color 180ms var(--pos-ease);
    }

    .pos-mode-switch__btn:hover {
        color: var(--pos-primary);
    }

    .pos-mode-switch__btn[aria-pressed='true'] {
        color: var(--pos-primary);
        font-weight: 600;
        background: #FFFFFF;
    }

    /* -------------------------------------------------------- acciones de cliente */

    /* Buscar cliente / Nuevo cliente, arriba de todo y en los dos modos. Envuelven
       en mobile para no empujar el ancho de la pantalla. */
    .pos-customer-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin-bottom: 12px;
    }

    .pos-customer-actions .ant-btn {
        min-height: 32px;
    }

    /* ------------------------------------------------------- atajos y anuncios */

    .pos-hotkeys {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        align-items: center;
        margin: 0 0 12px;
        font-size: 13px;
        color: var(--pos-text-soft);
    }

    .pos-hotkeys__label {
        font-weight: 600;
        color: var(--pos-text);
    }

    .pos-hotkeys__item {
        display: inline-flex;
        gap: 4px;
        align-items: center;
    }

    .pos-hotkeys__toggle {
        min-height: 24px;
        padding: 2px 10px;
        font: inherit;
        font-weight: 600;
        color: var(--pos-primary);
        background: #FFFFFF;
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
        cursor: pointer;
        transition: border-color 180ms var(--pos-ease);
    }

    .pos-hotkeys__toggle:hover {
        border-color: var(--pos-primary);
    }

    /* La región de anuncios se lee en voz alta pero no se dibuja. */
    .pos-live {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        white-space: nowrap;
        border: 0;
        clip-path: inset(50%);
    }

    /* ------------------------------------------------------------ ayuda de teclas */

    .pos-help {
        position: fixed;
        z-index: 60;
        top: 16px;
        right: 16px;
        width: min(420px, calc(100vw - 32px));
        max-height: calc(100vh - 32px);
        overflow: auto;
        padding: 16px;
        background: #FFFFFF;
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
        box-shadow: 0 8px 24px rgba(64, 64, 64, 0.16);
        animation: pos-drop 160ms var(--pos-ease) both;
    }

    .pos-help__head {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
    }

    .pos-help__title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }

    .pos-help__close {
        min-width: 24px;
        min-height: 24px;
        padding: 2px 10px;
        font: inherit;
        color: var(--pos-text);
        background: var(--pos-bg-soft);
        border: 1px solid var(--pos-border);
        border-radius: var(--pos-radius);
        cursor: pointer;
    }

    .pos-help__table {
        width: 100%;
        margin-top: 10px;
        font-size: 14px;
        border-collapse: collapse;
    }

    .pos-help__caption {
        padding-bottom: 6px;
        font-size: 13px;
        text-align: left;
        color: var(--pos-text-soft);
    }

    .pos-help__table th,
    .pos-help__table td {
        padding: 6px 8px;
        text-align: left;
        vertical-align: top;
        border-bottom: 1px solid var(--pos-border-light);
    }

    .pos-help__table thead th {
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--pos-text-soft);
    }

    .pos-help__keys {
        white-space: nowrap;
    }

    .pos-help__keys kbd + kbd {
        margin-left: 4px;
    }

    .pos-help__foot {
        margin: 12px 0 0;
        font-size: 13px;
        color: var(--pos-text-soft);
    }

    /* ---------------------------------------------------------------------- focus */

    .ant-btn:focus-visible,
    .ant-input:focus-visible,
    .ant-input-affix-wrapper:focus-visible,
    .ant-picker-focused,
    .pos-result:focus-visible,
    .pos-input:focus-visible,
    .pos-qty__btn:focus-visible,
    .pos-qty__input:focus-visible,
    .pos-line__remove:focus-visible,
    .pos-mode-switch__btn:focus-visible,
    .pos-more__toggle:focus-visible,
    .pos-hotkeys__toggle:focus-visible,
    .pos-help__close:focus-visible {
        outline: 2px solid var(--pos-primary);
        outline-offset: 2px;
    }

    /* El reset de Ant apaga el outline de lo que se enfoca por script
       ([tabindex='-1']:focus con prioridad). El panel de ayuda recibe el foco al
       abrirse y tiene que verse: se impone el anillo, sólo acá adentro. */
    .pos-help:focus {
        outline: 2px solid var(--pos-primary) !important;
        outline-offset: 2px;
    }

    /* El buscador es el control que más se usa del mostrador y vive dentro del
       envoltorio de Ant (por el botón de limpiar): Ant le apaga el outline con
       prioridad (!important) y dibuja su propio halo. Se impone el anillo del
       sistema —y se reemplaza el halo, para no dibujar dos— sólo acá adentro. */
    .ant-input-affix-wrapper > input.ant-input:focus-visible {
        outline: 2px solid var(--pos-primary) !important;
        outline-offset: 2px;
    }

    .ant-input-affix-wrapper-focused {
        box-shadow: none;
    }

    /* Ant apaga el outline de los selects (lo deja en 0) y dibuja su propio halo.
       El mostrador necesita el mismo anillo que el resto de los controles, así que
       se gana por especificidad (el prefijo del styled-component suma una clase) y
       se reemplaza el halo por el anillo, para no dibujar dos. */
    .ant-select:not(.ant-select-disabled):not(.ant-select-customize-input).ant-select-focused .ant-select-selector {
        outline: 2px solid var(--pos-primary);
        outline-offset: 2px;
        box-shadow: none;
    }

    /* La línea del ticket que tiene el foco: fondo suave y anillo por dentro, sin
       correr el contenido al recorrer el ticket con las flechas. */
    .pos-line:focus-within {
        background: var(--pos-bg-soft);
    }

    .pos-line:focus {
        outline: 2px solid var(--pos-primary);
        outline-offset: -2px;
        background: var(--pos-bg-soft);
    }

    .pos-qty__input:focus-visible {
        outline-offset: -2px;
    }

    /* Contraste: los placeholders de Ant vienen en 1.84:1 y en el mostrador el
       buscador es la única etiqueta visible de su campo. */
    .ant-select-selection-placeholder,
    .ant-input::placeholder,
    .ant-picker-input > input::placeholder,
    .ant-input-affix-wrapper input::placeholder {
        color: #6f6f6f;
    }

    /* Objetivos táctiles: ningún control interactivo por debajo de 24px. */
    .pos-line .ant-select-selector,
    .pos-panel .ant-select-selector {
        min-height: 32px;
    }

    /* ---------------------------------------------------------------- movimiento */

    @keyframes pos-drop {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: none;
        }
    }

    @keyframes pos-line-in {
        from {
            opacity: 0;
            transform: translateY(4px);
        }
        to {
            opacity: 1;
            transform: none;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .pos-results,
        .pos-search__message,
        .pos-help,
        .pos-line {
            animation: none;
        }

        .pos-qty__btn,
        .pos-line__remove,
        .pos-hotkeys__toggle,
        .pos-mode-switch__btn,
        .pos-more__caret {
            transition: none;
        }
    }
`;

export { PosPage };

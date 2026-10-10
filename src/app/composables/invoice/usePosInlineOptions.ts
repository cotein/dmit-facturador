import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useSaleConditionStore } from '@/app/store/sale-condition/useSaleConditionStore';
import { usePaymentTypeStore } from '@/app/store/payment-type/usePaymentTypeStore';
import type { SaleCondition } from '@/app/types/SaleCondition';
import type { PaymentType } from '@/app/types/PaymentType';

/**
 * Condición de venta y modo de pago escritos a mano, para la venta en curso.
 *
 * El dueño necesita poder ingresar una condición de venta o un modo de pago en el
 * momento, sin depender de lo que ya esté cargado en el catálogo de la empresa. El
 * backend tiene los endpoints (`POST /api/sale-condition`, `POST /api/payment-type`)
 * pero sus `store()` están vacíos: no guardan nada, así que acá no se finge persistir
 * nada. Lo creado vive en memoria, en esta pantalla, y se usa en esta venta.
 *
 * Los ids son negativos a propósito: son distinguibles de los reales en cualquier
 * lado donde se mire el id —el estado de la venta, el comprobante que se arma, la
 * consola— y no pueden chocar con los que devuelve la API.
 */

/** Próximo id local: -1, -2, -3… Nunca positivo, nunca igual a un id real. */
let localIdSequence = 0;

const inlineSaleConditions = ref<SaleCondition[]>([]);
const inlinePaymentTypes = ref<PaymentType[]>([]);

const nextLocalId = (): number => {
    localIdSequence += 1;

    return localIdSequence * -1;
};

/** Vacía lo creado a mano: al terminar la pantalla no queda nada de la venta anterior. */
const resetInlineOptions = (): void => {
    inlineSaleConditions.value = [];
    inlinePaymentTypes.value = [];
    localIdSequence = 0;
};

export const usePosInlineOptions = () => {
    const { CompanyGetter } = useCompanyComposable();
    const { saleConditions } = storeToRefs(useSaleConditionStore());
    const { paymentTypes } = storeToRefs(usePaymentTypeStore());

    /** Lo que ya existe para la empresa más lo agregado en esta venta. */
    const allSaleConditions = computed<SaleCondition[]>(() => [
        ...(saleConditions.value ?? []),
        ...inlineSaleConditions.value,
    ]);

    const allPaymentTypes = computed<PaymentType[]>(() => [...(paymentTypes.value ?? []), ...inlinePaymentTypes.value]);

    /**
     * Crea una condición de venta para esta venta y la devuelve ya usable.
     *
     * @param name nombre escrito por el operador.
     * @param days días de la condición, que es lo que se usa para el vencimiento de pago.
     */
    const createSaleCondition = (name: string, days: number): SaleCondition => {
        const created: SaleCondition = {
            id: nextLocalId(),
            name: name.trim(),
            days: Number.isFinite(days) ? Math.max(0, Math.trunc(days)) : 0,
        };

        inlineSaleConditions.value = [...inlineSaleConditions.value, created];

        return created;
    };

    const createPaymentType = (name: string): PaymentType => {
        const created: PaymentType = {
            id: nextLocalId(),
            company_id: Number(CompanyGetter.value?.id ?? 0),
            name: name.trim(),
            percentage: 0,
            active: true,
        };

        inlinePaymentTypes.value = [...inlinePaymentTypes.value, created];

        return created;
    };

    return {
        /** Listas completas: lo de la empresa más lo escrito a mano para esta venta. */
        allPaymentTypes,
        allSaleConditions,
        createPaymentType,
        createSaleCondition,
        resetInlineOptions,
    };
};

export { resetInlineOptions };

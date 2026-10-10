import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';

const URL = '/api/mercado-pago';

/**
 * Cobros online con Mercado Pago.
 *
 * El estado que se muestra es el de Mercado Pago (`status`), no uno calculado
 * acá: la app no inventa si un cobro está pago o no, lo lee de MP.
 */
export type MercadoPagoChargeStatus =
    | 'pending'
    | 'in_process'
    | 'approved'
    | 'rejected'
    | 'cancelled'
    | 'refunded'
    | 'expired';

export type MercadoPagoChargeConcept = 'invoice' | 'current_account' | 'sale' | 'manual';

export type MercadoPagoCharge = {
    id: number;
    external_reference: string;
    concept: MercadoPagoChargeConcept;
    channel: string;
    amount: number;
    currency: string;
    title: string | null;
    description: string | null;
    status: MercadoPagoChargeStatus;
    status_detail: string | null;
    /** Link que se comparte por WhatsApp o mail. */
    share_url: string | null;
    init_point: string | null;
    preference_id: string | null;
    customer_id: number | null;
    sale_invoice_id: number | null;
    expires_at: string | null;
    paid_at: string | null;
    created_at: string | null;
    settlement: { receipt_id?: number | null; at?: string; note?: string } | null;
    /** Presente cuando una devolución cayó sobre un pago ya imputado. */
    needs_review: { reason?: string; note?: string; at?: string } | null;
    customer?: { id: number; name: string } | null;
    sale_invoice?: { id: number } | null;
    payments?: MercadoPagoPaymentRow[];
};

export type MercadoPagoPaymentRow = {
    id: number;
    mp_payment_id: string;
    status: string;
    status_detail: string | null;
    amount: number;
    payment_type: string | null;
    installments: number | null;
    payer_email: string | null;
    approved_at: string | null;
};

export type MercadoPagoAccount = {
    id: number;
    status: 'pending' | 'connected' | 'revoked' | 'error';
    nickname: string | null;
    email: string | null;
    mp_user_id: string | null;
    public_key: string | null;
    connected_at: string | null;
    token_expires_at: string | null;
    last_error: string | null;
    is_connected: boolean;
};

export type ChargesFilters = {
    status?: string | null;
    concept?: string | null;
    customer_id?: number | null;
    sale_invoice_id?: number | null;
    from?: string | null;
    to?: string | null;
    solo_con_link?: boolean | null;
    page?: number | null;
    per_page?: number | null;
};

export type CreateChargePayload = {
    amount: number;
    concept: MercadoPagoChargeConcept;
    title?: string | null;
    description?: string | null;
    customer_id?: number | null;
    sale_invoice_id?: number | null;
    expires_in_days?: number | null;
};

const buildParams = (filters: ChargesFilters): URLSearchParams => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
        }
    });

    return params;
};

/** Estado de la conexión de la empresa activa (para la pantalla de ajustes). */
export const getMercadoPagoAccount = async (): Promise<AxiosResponse<{ data: MercadoPagoAccount | null }>> => {
    return await ApiHttp.get(`${URL}/account`);
};

/** URL de Mercado Pago a la que hay que mandar al dueño para que autorice. */
export const getMercadoPagoConnectUrl = async (): Promise<AxiosResponse<{ url: string }>> => {
    return await ApiHttp.get(`${URL}/connect`);
};

export const disconnectMercadoPago = async (): Promise<AxiosResponse<{ message: string }>> => {
    return await ApiHttp.delete(`${URL}/account`);
};

export const getCharges = async (filters: ChargesFilters): Promise<AxiosResponse<any>> => {
    return await ApiHttp.get(`${URL}/charges`, { params: buildParams(filters) });
};

export const getCharge = async (id: number): Promise<AxiosResponse<{ data: MercadoPagoCharge }>> => {
    return await ApiHttp.get(`${URL}/charges/${id}`, { params: { include: 'customer,payments,saleInvoice' } });
};

export const createCharge = async (
    payload: CreateChargePayload,
): Promise<AxiosResponse<{ data: MercadoPagoCharge }>> => {
    return await ApiHttp.post(`${URL}/charges`, payload);
};

export const cancelCharge = async (id: number): Promise<AxiosResponse<{ data: MercadoPagoCharge }>> => {
    return await ApiHttp.post(`${URL}/charges/${id}/cancel`, {});
};

/**
 * Revalida un cobro contra Mercado Pago en el momento. Sirve cuando el cliente
 * dice que ya pagó y no queremos esperar al webhook.
 */
export const refreshCharge = async (id: number): Promise<AxiosResponse<{ data: MercadoPagoCharge }>> => {
    return await ApiHttp.post(`${URL}/charges/${id}/refresh`, {});
};

export type MercadoPagoQr = {
    charge_id: number;
    external_reference: string;
    amount: number;
    /** Id de la orden de QR en Mercado Pago (Orders API). */
    in_store_order_id: string | null;
    /**
     * URL del QR que escanea el cliente: es el de la caja, porque Mercado Pago
     * no devuelve una imagen por orden.
     */
    qr_image: string | null;
    /** Sólo si Mercado Pago devolviera el texto del QR (hoy no lo hace). */
    qr_data: string | null;
};

/**
 * Genera el QR dinámico del mostrador para un cobro. Del lado de Mercado Pago
 * va con idempotency key, así que reabrir la pantalla no crea otro QR.
 */
export const createChargeQr = async (id: number): Promise<AxiosResponse<{ data: MercadoPagoQr }>> => {
    return await ApiHttp.post(`${URL}/charges/${id}/qr`, {});
};

export type ReconcileResult = {
    expirados: number;
    cobros_revisados: number;
    cobros_actualizados: number;
    suscripciones_revisadas: number;
};

/**
 * Conciliación a pedido contra Mercado Pago, acotada a la empresa activa.
 *
 * Es la red de seguridad cuando la notificación no llegó: sin esto, un cobro
 * puede quedarse pendiente aunque el cliente ya haya pagado.
 */
export const reconcileCharges = async (): Promise<AxiosResponse<{ data: ReconcileResult; message: string }>> => {
    return await ApiHttp.post(`${URL}/reconcile`, {});
};

export type PointDevice = {
    id: string | null;
    name: string | null;
    operating_mode: string | null;
};

/** Terminales Point de la cuenta, para elegir a cuál mandar el cobro. */
export const getPointDevices = async (): Promise<AxiosResponse<{ data: PointDevice[] }>> => {
    return await ApiHttp.get(`${URL}/devices`);
};

/**
 * Manda el cobro a una terminal: el cliente pasa la tarjeta ahí y el estado
 * vuelve por el webhook, igual que un link.
 */
export const sendChargeToPoint = async (
    id: number,
    payload: { device_id: string; installments?: number; type?: string },
): Promise<AxiosResponse<{ data: MercadoPagoCharge }>> => {
    return await ApiHttp.post(`${URL}/charges/${id}/point`, payload);
};

/** Etiquetas y colores de estado, en un solo lugar para que la UI no los invente. */
export const CHARGE_STATUS_LABEL: Record<string, string> = {
    pending: 'Pendiente de pago',
    in_process: 'En proceso',
    approved: 'Pagado',
    rejected: 'Rechazado',
    cancelled: 'Anulado',
    refunded: 'Devuelto',
    expired: 'Vencido',
};

export const CHARGE_STATUS_COLOR: Record<string, string> = {
    pending: 'blue',
    in_process: 'orange',
    approved: 'green',
    rejected: 'red',
    cancelled: 'default',
    refunded: 'purple',
    expired: 'default',
};

export const CHARGE_CONCEPT_LABEL: Record<string, string> = {
    invoice: 'Comprobante',
    current_account: 'Cuenta corriente',
    sale: 'Venta',
    manual: 'Cobro manual',
};

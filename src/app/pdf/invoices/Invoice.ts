import { Pdf } from '../Pdf';
import type { Company, Customer, Item, Voucher } from '@/app/types/Invoice';
import dayjs from 'dayjs';
import { HTML2CANVAS_SCALE } from '@/app/types/Constantes';
import html2canvas from 'html2canvas';
import { useSleepComposable } from '@/app/composables/sleep/useSleepComposable';
import type { TextOptionsLight } from 'jspdf';
import QrAfip from '../QrAfip';
import { AfipLogo } from '../images/AfipLogo';

const { sleep } = useSleepComposable();

export abstract class Invoice extends Pdf {
    public comment;
    public comments_height_position: number = 0;
    public company;
    public customer;
    public height_position: number = this.first_line_where_write_details; //desde 103 a 220, en ese rango se imprimwn los detalles
    public imageInFirstPage: boolean = true;
    public imagesBase64: Array<{ base64: string; height: number; width: number }> = [];
    public invoiceProductMaxWidth = 118;
    public items;
    public leftHeaderCompanyDataWidth = 85;
    public options: TextOptionsLight = {};
    public pageWithProducts: number = 1;
    public tempDivCounter: number = 0;
    public tempDivHeight1MMgetReady: boolean = false;
    public tempDivHeightTotal: number = 0;
    public tempDivHtml: string = '';
    public tempDivMaxHeight: number = 270;
    public tempDivMinHeight: number = 50;
    public voucher;
    public width_position: number = 0;
    public yCoordinateInternalverticalLines: number = 0;
    public logoBase64: string = '';

    constructor(
        company: Company,
        customer: Customer,
        voucher: Voucher,
        items: Item[],
        comment: string,
        logoBase64: string,
    ) {
        super();
        if (company != undefined) {
            this.company = company;
        }
        if (customer != undefined) {
            this.customer = customer;
        }
        if (voucher != undefined) {
            this.voucher = voucher;
        }
        if (items != undefined) {
            this.items = items;
        }
        if (comment != undefined) {
            this.comment = comment;
        }
        if (logoBase64 != undefined) {
            this.logoBase64 = logoBase64;
        }
    }

    leftHeaderCompanyData() {
        let height_position = 37;

        const companyData = [
            `Razón social:  ${this.company?.name ?? ''} ${this.company?.last_name ?? ''}`,
            `Domicilio:  ${this.company?.address?.street ?? ''} ${this.company?.address?.city ?? ''} ${
                this.company?.address?.cp ?? ''
            } ${this.company?.address?.state ?? ''}`,
            `Cond. IVA:  ${this.company?.afipInscription ?? ''}`,
        ];

        this.pdf.setFontSize(8);

        companyData.forEach((t: string, index: number) => {
            const dim = this.pdf.getTextDimensions(t);

            if (dim.w > this.leftHeaderCompanyDataWidth) {
                const array_text = this.pdf.splitTextToSize(t, this.leftHeaderCompanyDataWidth);

                array_text.forEach((line: string, i: number) => {
                    height_position = height_position + 3.4;

                    this.pdf.text(line, this.first_column_text() - 5, height_position);
                });
            } else {
                height_position = height_position + 3.4;

                this.pdf.text(t, this.first_column_text() - 5, height_position);
            }
        });

        if (this.logoBase64) {
            this.pdf.addImage(this.logoBase64, 'PNG', 10, 6, 77, 29);
        }
    }
    rightHeaderCompanyData() {
        this.write_text(
            [
                `CUIT: ${this.company?.cuit}`,
                `Ingresos Brutos: ${this.company?.iibb}`,
                `Fecha inicio de Actividades: ${dayjs(this.company?.activity_init).format('DD-MM-YYYY')}`,
            ],
            true,
            8,
            105,
            41,
            5,
        );
    }

    invoice_type_name() {
        const voucher_width = this.pdf.getTextDimensions(this.voucher!.name);
        let size_text = 16;
        if (voucher_width.w > 50) {
            size_text = 9;
        }
        this.write_text(
            [this.voucher!.name],
            true, //bold
            size_text, //size text
            110, //width posi.
            18, //heigh posi
            5,
        );

        const invoiceNumber = `${this.voucher!.pto_vta} - ${this.voucher!.cbte_desde}`;
        this.write_text([invoiceNumber], true, 16, 110, 26, 5);
        this.write_text([`Fecha: ${this.voucher!.cbte_fch}`], true, 12, 110, 33, 5);
    }

    customer_data() {
        const customer = `${this.customer?.name} ${this.customer!.last_name ?? ''}`;
        const customerAddress = `${this.customer?.address?.street ?? ''} ${this.customer?.address?.city ?? ''} ${
            this.customer?.address?.cp ?? ''
        } ${this.customer?.address?.state ?? ''}`;
        const text = [
            `SEÑOR/ES: ${customer}`,
            `DOMICILIO: ${customerAddress}`,
            `COND. IVA: ${this.customer?.afipInscription}`,
        ];

        /* if (deliveryAddress) {
			text.push('DOMICILIO ENTREGA: ' + deliveryAddress);
		} */

        this.pdf.setFontSize(10);
        this.pdf.setFont('Helvetica', 'bold');

        let height_position = this.first_header_height() + 1.5;

        text.forEach((t: string, index: number) => {
            const dim = this.pdf.getTextDimensions(t);

            if (dim.w > 181) {
                const array_text = this.pdf.splitTextToSize(t, 181);

                array_text.forEach((line: string, i: number) => {
                    height_position = height_position + 4;
                    this.pdf.text(line, this.first_column_text() - 5, height_position);
                });
            } else {
                height_position = height_position + 4;
                this.pdf.text(t, this.first_column_text() - 5, height_position);
            }
        });

        const docType = `${this.customer?.afipDocument} : ${this.customer?.cuit}`;

        this.write_text(
            [docType],
            true,
            10,
            this.middle_width() + this.quarter_width() + 15,
            this.first_header_height() + 10 + this.interline() * 3, // 3 por que la ubico en la cuarta linea de texto
            this.interline(),
        );
    }

    leftVerticalBorder() {
        this.pdf.setLineWidth(0.5);
        this.pdf.line(this.margin_left, this.margin_top, this.margin_left, this.margin_bottom);
    }

    rightVerticalBorder() {
        this.pdf.setLineWidth(0.5);
        this.pdf.line(this.margin_right, this.margin_top, this.margin_right, this.margin_bottom);
    }

    topBorder() {
        this.pdf.setLineWidth(0.5);
        this.pdf.line(this.margin_left, this.margin_top, this.margin_right, this.margin_top);
    }

    bottomBorder() {
        this.pdf.setLineWidth(0.5);
        this.pdf.line(this.margin_left, this.margin_bottom, this.margin_right, this.margin_bottom);
    }

    first_header_height() {
        return this.margin_top * 11;
    }

    headerLeft() {
        this.pdf.line(this.margin_left, this.first_header_height(), this.middle_width(), this.first_header_height());
    }

    total_width() {
        return this.margin_right - this.margin_left;
    }

    total_height() {
        return this.margin_bottom - this.margin_top;
    }

    middle_width() {
        return this.total_width() / 2 + this.margin_left / 2;
    }

    quarter_width() {
        return this.middle_width() / 2;
    }

    middle_height() {
        return this.total_height() / 2;
    }

    quarter_height() {
        return this.middle_height() / 2;
    }

    one_cm() {
        return 10;
    }

    horizontalLine(x1: number, y1: number, x2: number, y2: number, style = 'S') {
        this.pdf.line(x1, y1, x2, y2, style);
    }

    verticalLine(x1: number, y1: number, x2: number, y2: number, style = 'S') {
        this.pdf.line(x1, y1, x2, y2, style);
    }

    interline(value = 6) {
        return value;
    }

    first_column_text() {
        return this.margin_left + this.one_cm();
    }

    invoice_type(invoice_letter: string = 'Z') {
        this.pdf.setFontSize(20);
        this.pdf.setFont('Helvetica', 'bold');
        this.pdf.text(invoice_letter, 96.5, 12);
        this.pdf.rect(93, 5, 13, 10);
    }

    headerRight() {
        this.pdf.line(this.middle_width(), this.first_header_height(), this.margin_right, this.first_header_height());
    }

    invoice_original(text = 'ORIGINAL') {
        this.write_text([text], false, 8, 110, 11, 5);
    }

    dividerHeader() {
        this.pdf.line(this.middle_width(), 23, this.middle_width(), this.first_header_height());
    }

    code201() {
        this.pdf.setFontSize(8);
        this.pdf.setFont('Helvetica', 'normal');
        this.pdf.text('Código 201', 92, 19);
    }

    internal_footer() {
        this.horizontalLine(
            this.margin_left,
            this.margin_bottom - this.one_cm() * 4,
            this.margin_right,
            this.margin_bottom - this.one_cm() * 4,
        );

        this.horizontalLine(
            this.margin_left,
            this.margin_bottom - this.one_cm() * 0.8,
            this.margin_right,
            this.margin_bottom - this.one_cm() * 0.8,
        );
    }

    lineasHorizontales() {
        this.horizontalLine(this.margin_left, 103, this.margin_right, 103);
        this.horizontalLine(this.margin_left, 103, this.margin_right, 103);
        this.horizontalLine(this.margin_left, this.first_line_height, this.margin_right, this.first_line_height);
        this.horizontalLine(
            this.margin_left,
            this.first_line_height + 10,
            this.margin_right,
            this.first_line_height + 10,
        );
    }

    lines(): void {
        this.leftVerticalBorder();
        this.rightVerticalBorder();
        this.topBorder();
        this.bottomBorder();
        this.headerRight();
        this.headerLeft();
        this.dividerHeader();
        this.code201();
        this.internal_footer();
        this.lineasHorizontales();
    }

    numberOfPages(currentPage: number, totalPages: number): void {
        if (totalPages === 1) {
            this.write_text([`Página ${currentPage}`], false, 8, 185, 288);
        } else {
            this.write_text([`Página ${currentPage} de ${totalPages}`], false, 8, 185, 288);
        }
    }

    totalToWords(value: number): void {
        const txt = this.numbersToWords(value);

        this.write_text(
            ['Son Pesos: ' + txt],
            true,
            8,
            this.first_column_text() - this.one_cm() / 2,
            this.margin_bottom - 2.5,
            this.interline(),
        );
    }

    productNameWidth(product_name: string, result: string[]): string[] {
        const product_name_width = this.pdf.getTextDimensions(product_name);

        if (product_name_width.w > this.invoiceProductMaxWidth) {
            const array_text: string[] = this.pdf.splitTextToSize(product_name, this.invoiceProductMaxWidth);

            array_text.forEach((text: string) => {
                this.productNameWidth(text, result);
            });
        } else {
            result.push(product_name);
        }

        return result;
    }

    factura_servicios(voucher: any) {
        if (voucher.fch_serv_desde) {
            this.pdf.text(
                `Período facturado Desde: ${dayjs(voucher.fch_serv_desde).format('DD-MM-YYYY')}`,
                14,
                this.first_line_height + 6,
            );
        }
        if (voucher.fch_serv_hasta) {
            this.pdf.text(
                `Hasta ${dayjs(voucher.fch_serv_hasta).format('DD-MM-YYYY')}`,
                90,
                this.first_line_height + 6,
            );
        }
        if (voucher.fch_vto_pago) {
            this.pdf.text(`Fecha de Vto. para el pago: ${voucher.fch_vto_pago}`, 130, this.first_line_height + 6);
            /* this.pdf.text(
                `Fecha de Vto. para el pago: ${dayjs(voucher.fch_vto_pago).format('DD-MM-YYYY')}`,
                130,
                this.first_line_height + 6,
            ); */
        }
    }

    /**
	 * Prints afip qr
	 * @param ver
	 * @param date
	 * @param cuit
	 * @param ptoVta
	 * @param CbteTipo
	 * @param nroCbte
	 * @param importe
	 * @param money
	 * @param ctz
	 * @param tipoDocRec
	 * @param nroDocRec
	 * @param tipoCodAut
	 * @param codAut
	 * @returns base_64
	 * * Especificación Técnica:
        El código QR deberá codificar el siguiente texto:

        {URL}?p={DATOS_CMP_BASE_64}
        Donde:
        {URL} = https://www.afip.gob.ar/fe/ qr/

        {DATOS_CMP_BASE_64} = JSON con datos del comprobante codificado en Base64

        La especificación del JSON con los datos del comprobante es la siguiente (versión 1):
        Campo	Tipo	Descripción	Valor ejemplo

        1-ver	Numérico 1 digito	OBLIGATORIO – versión del formato de los datos del comprobante	1
        2-fecha	full-date (RFC3339)	OBLIGATORIO – Fecha de emisión del comprobante	"2020-10-13"
        3-cuit	Numérico 11 dígitos	OBLIGATORIO – Cuit del Emisor del comprobante	30000000007
        4-ptoVta	Numérico hasta 5 digitos	OBLIGATORIO – Punto de venta utilizado para emitir el comprobante	10
        5-tipoCmp	Numérico hasta 3 dígitos	OBLIGATORIO – tipo de comprobante (según Tablas del sistema )	1
        6-nroCmp	Numérico hasta 8 dígitos	OBLIGATORIO – Número del comprobante	94
        7-importe	Decimal hasta 13 enteros y 2 decimales	OBLIGATORIO – Importe Total del comprobante (en la moneda en la que fue emitido)	12100
        8-moneda	3 caracteres	OBLIGATORIO – Moneda del comprobante (según Tablas del sistema )	"DOL"
        9-ctz	Decimal hasta 13 enteros y 6 decimales	OBLIGATORIO – Cotización en pesos argentinos de la moneda utilizada (1 cuando la moneda sea pesos)	65
        10-tipoDocRec	Numérico hasta 2 dígitos	DE CORRESPONDER – Código del Tipo de documento del receptor (según Tablas del sistema )	80
        11-nroDocRec	Numérico hasta 20 dígitos	DE CORRESPONDER – Número de documento del receptor correspondiente al tipo de documento indicado	20000000001
        12-tipoCodAut	string	OBLIGATORIO – “A” para comprobante autorizado por CAEA, “E” para comprobante autorizado por CAE	"E"
        13-codAut	Numérico 14 dígitos	OBLIGATORIO – Código de autorización otorgado por AFIP para el comprobante	70417054367476
	 */
    printAfipQr(
        ver: number,
        date: string,
        cuit: number,
        ptoVta: number,
        CbteTipo: number,
        nroCbte: number,
        importe: number,
        money: string,
        ctz: number,
        tipoDocRec: number,
        nroDocRec: number,
        tipoCodAut: string,
        codAut: number,
    ) {
        const qr = new QrAfip(
            ver,
            date,
            cuit,
            ptoVta,
            CbteTipo,
            nroCbte,
            importe,
            money,
            ctz,
            tipoDocRec,
            nroDocRec,
            tipoCodAut,
            codAut,
        );

        const qr_base_64 = qr.generate_qr();

        for (let i = 0; i < this.pdf.getNumberOfPages(); i++) {
            this.pdf.setPage(i + 1);
            this.pdf.addImage(qr_base_64, 'PNG', 5, 262, 40, 40);
        }
    }
    printPageNumber(InvoiceType: string) {
        for (let i = 0; i < this.pdf.getNumberOfPages(); i++) {
            this.pdf.setPage(i + 1);
            this.printStructure(InvoiceType);
            this.pdf.setDrawColor(0, 0, 0);
            this.lines();
            this.numberOfPages(i + 1, this.pdf.getNumberOfPages());
        }
    }

    printHorizontalLineAfterLastProduct(): void {
        for (let index = 0; index < this.pageWithProducts; index++) {
            this.pdf.setPage(index + 1);
            this.printInternalVerticalsLines(this.yCoordinateInternalverticalLines + 2);
            this.pdf.setLineWidth(0.5);
            this.pdf.line(
                this.margin_left,
                this.yCoordinateInternalverticalLines + 2,
                this.margin_right,
                this.yCoordinateInternalverticalLines + 2,
            );
        }
    }

    createDivsForConvertCommentToImages = (node: any, a1MM: number): void => {
        // Visit the current node
        if (node.children.length === 0) {
            const divElement = document.getElementById(`html_${this.tempDivCounter}`);

            this.tempDivHtml += node.outerHTML;

            this.tempDivHeightTotal = this.tempDivHeightTotal + node.clientHeight;

            if (this.tempDivHeightTotal >= a1MM && !this.tempDivHeight1MMgetReady) {
                this.tempDivHeightTotal = 0;

                this.tempDivCounter++;

                this.tempDivHeight1MMgetReady = true;

                const div: HTMLDivElement = document.createElement('div');

                div.setAttribute('width', '756px');

                div.innerHTML = this.tempDivHtml;

                if (divElement) {
                    divElement.appendChild(div);
                    this.tempDivHtml = '';
                }
            } else {
                const div: HTMLDivElement = document.createElement('div');

                div.setAttribute('width', '756px');

                div.innerHTML = this.tempDivHtml;

                if (divElement) {
                    divElement.appendChild(div);
                    this.tempDivHtml = '';
                }
            }

            if (this.tempDivHeightTotal >= this.tempDivMaxHeight) {
                this.tempDivHeightTotal = 0;

                this.tempDivCounter++;

                const div: HTMLDivElement = document.createElement('div');

                div.setAttribute('width', '756px');

                div.innerHTML = this.tempDivHtml;
                if (divElement) {
                    divElement.appendChild(div);
                    this.tempDivHtml = '';
                }
            }
        }
        // Recursively visit the children of the current node
        for (const child of node.children) {
            this.createDivsForConvertCommentToImages(child, a1MM);
        }
    };

    async convertCommentsToImage(comments: string) {
        const div = document.createElement('div');

        div.innerHTML = `<div id="comment-container" style="width:${HTML2CANVAS_SCALE.scale_02.width};">${comments}</div>`;

        let a1: number = this.tempDivMaxHeight - this.yCoordinateInternalverticalLines + 4;

        const mainDiv: HTMLDivElement | null = document.getElementById('main_data') as HTMLDivElement | null;

        if (mainDiv) {
            if (a1 <= this.tempDivMinHeight) {
                a1 = this.tempDivMaxHeight;
                this.imageInFirstPage = false;
            }

            mainDiv.innerHTML = div.innerHTML;

            this.createDivsForConvertCommentToImages(mainDiv, a1);
        }

        const divs = document.querySelectorAll('[id^="html_"]');
        const divsConElementos = Array.from(divs).filter((div) => div.children.length > 0);
        const self = this;

        for (const div of divsConElementos) {
            await html2canvas(div as HTMLDivElement, {
                logging: false,
                scale: 1.8,
                onclone(document, element) {
                    const ulList: NodeListOf<HTMLUListElement> = element.querySelectorAll('ul');

                    ulList.forEach((ulElement) => {
                        const liList: NodeListOf<HTMLLIElement> = ulElement.querySelectorAll('li');

                        liList.forEach((li) => {
                            li.style.paddingLeft = '1.3rem';
                            li.innerHTML = `<strong>●</strong> ${li.textContent}`;
                        });
                    });

                    const paragraphs: NodeListOf<HTMLParagraphElement> = element.querySelectorAll('p');

                    paragraphs.forEach((paragraph) => {
                        paragraph.style.paddingLeft = '1.3rem';
                        paragraph.style.paddingTop = '0px';
                        paragraph.style.paddingBottom = '0px';
                        paragraph.style.marginBottom = '0px';
                        paragraph.style.marginTop = '0px';
                    });
                },
            }).then(async function (canvas) {
                const ratio = Math.ceil(window.devicePixelRatio);

                canvas.getContext('2d')!.setTransform(ratio, 0, 0, ratio, 0, 0);

                const img = canvas.toDataURL('image/png');

                const data = {
                    base64: img,
                    width: (canvas.width * 12) / 100,
                    height: (canvas.height * 12) / 100,
                };

                self.imagesBase64.push(data);
            });
        }
    }

    async printCommentImage(invoiceType: string) {
        await sleep(200);

        let printInfirstPage: boolean = true;

        for (const img of this.imagesBase64) {
            this.pdf.setFontSize(10);

            if (this.imageInFirstPage && printInfirstPage) {
                const lastPage = this.pdf.getNumberOfPages();

                this.pdf.setPage(lastPage);

                this.pdf.addImage(
                    img.base64,
                    'PNG',
                    10,
                    this.yCoordinateInternalverticalLines + 4,
                    img.width,
                    img.height,
                );

                printInfirstPage = false;
            } else {
                this.pdf.addPage();

                this.pdf.addImage(img.base64, 'PNG', 10, 106, img.width, img.height);

                this.printStructure(invoiceType);
            }
        }
    }

    cleanTempDivsWithCommentsToConverterImages(): void {
        const divElement: HTMLElement | null = document.getElementById('main_data');

        if (divElement) {
            divElement.innerHTML = '';
        }

        const divs: NodeListOf<HTMLDivElement> = document.querySelectorAll('[id^="html_"]');

        divs.forEach((div) => (div.innerHTML = ''));
    }

    cae(cae: string, cae_vto: string) {
        const txtCAE: string = 'CAE N°: ';
        const txtCAEVTO: string = 'Fecha de Vto. de CAE: ';

        this.pdf.setFontSize(8);
        const width_position = 155;

        const height_position = 270;

        this.options = {
            lineHeightFactor: 1.2,
            maxWidth: 50,
            align: 'left',
        };
        // Primero, establece la fuente en negrita para 'CAE N°: '
        this.pdf.setFont('Helvetica', 'bold');
        this.pdf.text(txtCAE, width_position, height_position, this.options);

        let boldTextWidth = this.pdf.getTextWidth(txtCAE);

        this.pdf.setFont('Helvetica', 'normal');
        this.pdf.text(cae, width_position + boldTextWidth, height_position, this.options);

        this.pdf.setFont('Helvetica', 'bold');
        this.pdf.text(txtCAEVTO, width_position, height_position + 5, this.options);
        boldTextWidth = this.pdf.getTextWidth(txtCAEVTO);

        this.pdf.setFont('Helvetica', 'normal');
        this.pdf.text(cae_vto, width_position + boldTextWidth, height_position + 5, this.options);
    }

    afipLogo() {
        this.pdf.addImage(AfipLogo.getBase64(), 'PNG', 45, 267, 33, 16);
    }

    afipLegend() {
        this.pdf.setFontSize(7);
        this.pdf.text('Comprobante Autorizado', 45, 287);
        this.pdf.text('ARCA no se responsabiliza por los datos ingresados en el detalle de la operación', 45, 291);
    }

    paymentTypeLegend(paymentType: string) {
        /* this.write_text(
            ['Cheques a la orden de: '],
            true,
            10,
            this.first_column_text() - this.one_cm() / 2,
            this.margin_bottom - this.one_cm() * 2.5,
            this.interline(),
        ); */
        this.pdf.text(
            `Modo de pago: ${paymentType}`,
            this.first_column_text() - this.one_cm() / 2,
            this.margin_bottom - this.one_cm() * 3.32,
        );
    }
    printStructure(invoiceType: string): void {
        this.lines();

        this.printColumnNames();

        this.invoice_type(invoiceType);

        this.invoice_original();

        this.leftHeaderCompanyData();

        this.rightHeaderCompanyData();

        this.invoice_type_name();

        this.customer_data();

        this.factura_servicios(this.voucher);

        this.paymentTypeLegend(this.voucher!.payment_type ?? '');
        this.printTotals();
    }

    abstract print(): void;
    abstract printColumnNames(): void;
    abstract printInternalVerticalsLines(yCoordinate: number): void;
    abstract printProducts(pp: any): void;
    abstract printTotals(): void;
    abstract getFilePdf(): any;
}

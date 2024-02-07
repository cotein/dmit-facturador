import { Pdf } from '../Pdf';
import type { Company, Customer, InvoicePdf, Item, Voucher } from '@/app/types/Pdf';

export abstract class Invoice extends Pdf {
	public invoiceProductMaxWidth = 118;
	public company;
	public customer;
	public voucher;
	public items;
	public comment;
	public leftHeaderCompanyDataWidth = 85;

	constructor(company: Company, customer: Customer, voucher: Voucher, items: Item[], comment: string) {
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
	}

	leftHeaderCompanyData() {
		let height_position = 37;

		const companyData = [
			`Razón social:  ${this.company!.name} ${this.company!.last_name ?? ''}`,
			`Domicilio:  ${this.company!.address.street} ${this.company!.address.city} ${this.company!.address.cp} ${
				this.company!.address.state
			}`,
			`Cond. IVA:  ${this.company?.afipInscription}`,
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
	}

	rightHeaderCompanyData() {
		this.write_text(
			[
				`CUIT: ${this.company?.cuit}`,
				`Ingresos Brutos: ${this.company?.iibb}`,
				`Fecha inicio de Actividades: ${this.company?.activity_init}`,
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
		const customer = `${this.customer?.name} ${this.customer?.lastName ?? ''}`;
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

	invoice_type(invoice_letter = 'Z') {
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
		this.pdf.setFont('Helvetica');
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

	numberOfPages(currentPage: number) {
		this.write_text([`Pagina ${currentPage}`], false, 8, 185, 288);
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
	abstract headers_invoice_data(): void;
	abstract details_of_product(pp: any): void;
	abstract print(): void;
}

import type { Company } from '@/app/types/Company';
import { Invoice } from './Invoice';
import type { CustomerInvoice } from '@/app/types/Customer';
import type { ProductOnInvoiceTable } from '@/app/types/Product';

export class A extends Invoice {
	public typeA: string = 'A';
	public company;
	public customer;
	public voucherData;

	constructor(
		company: Company | undefined,
		customer: CustomerInvoice | undefined,
		voucherData: ProductOnInvoiceTable | undefined,
	) {
		super();
		if (company != undefined) {
			this.company = company;
		}
		if (customer != undefined) {
			this.customer = customer;
		}
		if (voucherData != undefined) {
			this.voucherData = voucherData;
		}
	}

	headers_invoice_data() {
		this.write_text(
			['CANTIDAD'],
			true,
			7,
			this.first_column_text() - 8,
			this.first_line_height + 15,
			this.interline(),
		);

		this.write_text(
			['DESCRIPCIÓN'],
			true,
			7,
			this.first_column_text() * 3.5,
			this.first_line_height + 15,
			this.interline(),
		);

		this.write_text(
			['P/UNIT.'],
			true,
			7,
			this.first_column_text() * 8.5,
			this.first_line_height + 15,
			this.interline(),
		);

		this.write_text(
			['IVA.'],
			true,
			7,
			this.first_column_text() * 9.7,
			this.first_line_height + 15,
			this.interline(),
		);

		this.write_text(
			['TOTAL'],
			true,
			7,
			this.first_column_text() * 10.8,
			this.first_line_height + 15,
			this.interline(),
		);

		this.write_text(
			['Cheques a la orden de: '],
			true,
			10,
			this.first_column_text() - this.one_cm() / 2,
			this.margin_bottom - this.one_cm() * 2.5,
			this.interline(),
		);
		// lineas para dividir las columnas en los detalles de los productos
		this.verticalLine(this.margin_left + 15, 103, this.margin_left + 15, this.margin_bottom - this.one_cm() * 4);
		//this.verticalLine(this.margin_right - 86, 103, this.margin_right - 86,  this.margin_bottom - (this.one_cm() * 4))
		this.verticalLine(this.margin_right - 65, 103, this.margin_right - 65, this.margin_bottom - this.one_cm() * 4);
		//this.verticalLine(this.margin_right - 48, 103, this.margin_right - 48,  this.margin_bottom - (this.one_cm() * 4))
		this.verticalLine(this.margin_right - 40, 103, this.margin_right - 40, this.margin_bottom - this.one_cm() * 4);
		this.verticalLine(this.margin_right - 21, 103, this.margin_right - 21, this.margin_bottom - this.one_cm() * 4);
	}

	details_of_product(products: ProductOnInvoiceTable[]) {
		let height_position = this.first_line_where_write_details; //desde 103 a 220, en ese rango se imprimwn los detalles
		let current_page = 1;
		let width_position = 0;
		let options = {};
		this.numberOfPages(current_page);
		this.invoice_original('originalk');

		products.forEach((product, index: number) => {
			height_position = height_position + 4;

			//##### QUANTITY ######
			width_position = 14;
			options = {
				lineHeightFactor: 1.7,
				maxWidth: 15,
				align: 'center',
			};

			this.pdf.setFontSize(this.size_text_details);

			const quantity = product.quantity;

			this.pdf.text(String(quantity), width_position, height_position, options);

			//##### PRODUCT NAME ######
			this.pdf.setFontSize(9);

			width_position = 24;

			options = {
				lineHeightFactor: 1.7,
				maxWidth: 150,
				align: 'left',
			};

			const product_name_width = this.pdf.getTextDimensions(product.product.name as string);

			if (product_name_width.w > 145) {
				const array_text = this.pdf.splitTextToSize(product.product.name as string, 145);

				array_text.forEach((line: string, i: number) => {
					this.pdf.text(line, width_position, height_position, options);

					height_position = height_position + 4;
				});

				height_position = height_position - 4;
			} else {
				this.pdf.text(product.product.name as string, width_position, height_position, options);
			}

			//##### UNIT PRICE ######
			width_position = 135;

			options = {
				lineHeightFactor: 1.7,
				maxWidth: 23,
				align: 'right',
			};

			//QUITO ESTE CAMPO
			//this.pdf.text(this.CurrencyFormat(product.unit_price_invoiceA) , width_position, height_position, options);

			//##### DISCOUNT ######
			this.pdf.setFontSize(8);
			//width_position = 152;
			width_position = 159;
			options = {
				lineHeightFactor: 1.7,
				maxWidth: 23,
				align: 'right',
			};
			// EN ESTE LUGAR QUITO DESCUENTO Y AGREGO PRECIO UNITARIO + IVA
			this.pdf.text(this.CurrencyFormat(product.total), width_position, height_position, options);

			//##### IVA PERCENTAGE ######
			width_position = 159;
			options = {
				lineHeightFactor: 1.7,
				maxWidth: 23,
				align: 'right',
			};
			//this.pdf.text(product.iva_name , width_position, height_position, options);

			//##### IVA IMPORT ######
			width_position = 179;
			options = {
				lineHeightFactor: 1.7,
				maxWidth: 23,
				align: 'right',
			};
			this.pdf.text(this.CurrencyFormat(product.iva_import), width_position, height_position, options);
			// QUITO IMPORTE DE IVA Y AGREGO DESCUENTO
			//this.pdf.text(this.CurrencyFormat(product.discount_import) , width_position, height_position, options);

			//##### TOTAL ######
			this.pdf.setFontSize(9);
			width_position = 200;
			options = {
				lineHeightFactor: 1.7,
				maxWidth: 23,
				align: 'right',
			};

			this.pdf.text(this.CurrencyFormat(product.total), width_position, height_position, options);

			if (height_position > 208) {
				this.pdf.addPage();
				height_position = 103;
				current_page = current_page + 1;
				this.numberOfPages(current_page);
			}
		});
	}

	print(): void {
		this.lines();

		this.headers_invoice_data();
		this.invoice_type(this.typeA);

		this.invoice_original();
		this.leftHeaderCompanyData();
		this.rightHeaderCompanyData();
		this.invoice_type_name();
		this.customer_data(
			'cliente',
			'fray luis beltran 623, monte grande - 1842',
			'responsable monotributo',
			'20227339730',
			'cuit',
		);
		this.details_of_product(this.voucherData);
		this.pdf.save('nombre del archivo.pdf');
	}
}

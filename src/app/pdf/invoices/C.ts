import type { Item } from '@/app/types/Pdf';
import { Invoice } from './Invoice';

export class C extends Invoice {
	public typeC: string = 'C';

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
			['DESCUENTO'],
			true,
			7,
			this.first_column_text() * 9.5,
			this.first_line_height + 15,
			this.interline(),
		);

		this.write_text(
			['P/UNIT..'],
			true,
			7,
			this.first_column_text() * 8.4,
			this.first_line_height + 15,
			this.interline(),
		);

		this.write_text(
			['TOTAL'],
			true,
			7,
			this.first_column_text() * 11,
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

		this.verticalLine(this.margin_left + 15, 103, this.margin_left + 15, this.margin_bottom - this.one_cm() * 4);
		this.verticalLine(this.margin_right - 63, 103, this.margin_right - 64, this.margin_bottom - this.one_cm() * 4);
		this.verticalLine(this.margin_right - 42, 103, this.margin_right - 42, this.margin_bottom - this.one_cm() * 4);
		this.verticalLine(this.margin_right - 21, 103, this.margin_right - 21, this.margin_bottom - this.one_cm() * 4);
	}

	details_of_product() {
		let height_position = this.first_line_where_write_details; //desde 103 a 220, en ese rango se imprimwn los detalles

		let current_page = 1;

		let width_position = 0;

		let options = {};

		this.numberOfPages(current_page);

		this.invoice_original('title');

		this.items?.forEach((product: Item, index: number) => {
			height_position = height_position + 4;

			//##### QUANTITY ######
			width_position = 14;

			options = {
				lineHeightFactor: 1.7,
				maxWidth: 15,
				align: 'center',
			};

			this.pdf.setFontSize(8);

			const quantity = product.quantity;
			this.pdf.text(String(quantity), width_position, height_position, options);

			//##### DESCRIPTION ######
			this.pdf.setFontSize(8);

			width_position = 24;

			options = {
				lineHeightFactor: 1.7,
				maxWidth: 150,
				align: 'left',
			};

			const arrayProductNameText: string[] = [];

			const productsNameText = this.productNameWidth(product.name as string, arrayProductNameText);

			productsNameText.forEach((line: string, i: number) => {
				this.pdf.text(line, width_position, height_position, options);
				const textDimention = this.pdf.getTextDimensions(line);
				if (textDimention.w + width_position > this.invoiceProductMaxWidth) {
					height_position = height_position + 4;
				}
			});

			//##### UNIT PRICE ######
			width_position = 156;

			options = {
				lineHeightFactor: 1.7,
				maxWidth: 23,
				align: 'right',
			};

			this.pdf.text(
				this.CurrencyFormat((product.unit_price as number) + product.iva_import),
				width_position,
				height_position,
				options,
			);

			width_position = 170;

			options = {
				lineHeightFactor: 1.7,
				maxWidth: 23,
				align: 'right',
			};

			//##### DISCOUNT ######
			this.pdf.setFontSize(8);

			width_position = 178;

			options = {
				lineHeightFactor: 1.7,
				maxWidth: 23,
				align: 'right',
			};

			this.pdf.text(this.CurrencyFormat(0), width_position, height_position, options);

			width_position = 200;

			options = {
				lineHeightFactor: 1.7,
				maxWidth: 23,
				align: 'right',
			};

			//##### TOTAL ######
			this.pdf.setFontSize(8);

			this.pdf.text(this.CurrencyFormat(product.total), width_position, height_position, options);

			if (height_position > 208) {
				const nextIndex = this.items?.findIndex((_, i) => i > index);

				const hasNext = nextIndex !== -1;

				if (hasNext) {
					this.pdf.addPage();

					height_position = 103;

					this.invoice_original('title');

					current_page = current_page + 1;

					this.numberOfPages(current_page);

					//////////////////////////
					this.lines();

					this.headers_invoice_data();
					this.invoice_type(this.typeC);

					this.invoice_original();
					this.leftHeaderCompanyData();
					this.rightHeaderCompanyData();
					this.invoice_type_name();
					this.customer_data();
				}
			}
		});

		if (this.comment != '' && this.comment != null) {
			const arrayCommentResult: string[] = [];

			const commentText = this.productNameWidth(this.comment as string, arrayCommentResult);

			options = {
				lineHeightFactor: 1.7,
				maxWidth: this.invoiceProductMaxWidth,
				align: 'left',
			};

			commentText.forEach((line: string, i: number) => {
				height_position = height_position + 4;

				const cleanedString = line.replace(/<[^>]+>/g, '');
				this.pdf.text(cleanedString, 24, height_position, options);

				const textDimention = this.pdf.getTextDimensions(cleanedString);

				if (textDimention.w + 24 > this.invoiceProductMaxWidth) {
					height_position = height_position + 4;
				}
			});
		}
	}

	details_of_totals() {
		let height_position = this.margin_bottom - 40;

		this.pdf.setFontSize(12);

		this.pdf.setFont('Helvetica', 'bold');

		height_position = height_position + 5;

		let options = {
			lineHeightFactor: 1.2,
			maxWidth: 100,
			align: 'right',
		};

		this.pdf.text('TOTAL', this.first_column_text() * 8.5, height_position, options);

		options = {
			lineHeightFactor: 1.2,
			maxWidth: 100,
			align: 'right',
		};

		const totalInvoice = this.items?.reduce((total: number, item: Item) => {
			return total + (item.total ?? 0);
		}, 0);
		this.pdf.text(this.CurrencyFormat(totalInvoice), this.first_column_text() * 11.5, height_position, options);

		this.totalToWords(totalInvoice);
	}

	print(): void {
		this.lines();

		this.headers_invoice_data();
		this.invoice_type(this.typeC);

		this.invoice_original();

		this.leftHeaderCompanyData();

		this.rightHeaderCompanyData();
		this.invoice_type_name();
		this.customer_data();
		this.details_of_product();
		this.details_of_totals();

		this.pdf.save('nombre del archivo.pdf');
	}
}

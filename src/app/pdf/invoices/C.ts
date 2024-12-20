import type { Item } from '@/app/types/Pdf';
import { Invoice } from './Invoice';
import dayjs from 'dayjs';

export class C extends Invoice {
    public typeC: string = 'C';

    printColumnNames() {
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
    }

    printInternalVerticalsLines(yCoordinate: number) {
        //this.verticalLine(this.margin_left + 15, 103, this.margin_left + 15, this.margin_bottom - this.one_cm() * 4);
        this.verticalLine(this.margin_left + 15, 103, this.margin_left + 15, yCoordinate);
        this.verticalLine(this.margin_right - 63, 103, this.margin_right - 63, yCoordinate);
        this.verticalLine(this.margin_right - 42, 103, this.margin_right - 42, yCoordinate);
        this.verticalLine(this.margin_right - 21, 103, this.margin_right - 21, yCoordinate);
    }

    printProducts() {
        this.height_position = this.first_line_where_write_details; //desde 103 a 220, en ese rango se imprimwn los detalles

        this.items?.forEach((product: Item, index: number) => {
            this.height_position = this.height_position + 3;

            //##### QUANTITY ######
            this.width_position = 14;

            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 15,
                align: 'center',
            };

            this.pdf.setFontSize(8);

            const quantity = product.quantity;
            this.pdf.text(String(quantity), this.width_position, this.height_position, this.options);

            //##### DESCRIPTION ######
            this.pdf.setFontSize(8);

            this.width_position = 24;

            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 150,
                align: 'left',
            };

            const arrayProductNameText: string[] = [];

            const productsNameText = this.productNameWidth(product.name as string, arrayProductNameText);

            productsNameText.forEach((line: string, i: number) => {
                this.pdf.text(line, this.width_position, this.height_position, this.options);

                const textDimention = this.pdf.getTextDimensions(line);

                if (textDimention.w + this.width_position > this.invoiceProductMaxWidth) {
                    this.height_position = this.height_position + 3;
                }
            });

            //##### UNIT PRICE ######
            this.width_position = 156;

            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 23,
                align: 'right',
            };

            this.pdf.text(
                this.CurrencyFormat((product.unit_price as number) + product.iva_import),
                this.width_position,
                this.height_position,
                this.options,
            );

            this.width_position = 170;

            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 23,
                align: 'right',
            };

            //##### DISCOUNT ######
            this.pdf.setFontSize(8);

            this.width_position = 178;

            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 23,
                align: 'right',
            };

            this.pdf.text(this.CurrencyFormat(0), this.width_position, this.height_position, this.options);

            this.width_position = 200;

            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 23,
                align: 'right',
            };

            //##### TOTAL ######
            this.pdf.setFontSize(8);

            this.pdf.text(this.CurrencyFormat(product.total), this.width_position, this.height_position, this.options);

            if (this.height_position > 208) {
                const nextIndex = this.items?.findIndex((_, i) => i > index);

                const hasNext = nextIndex !== -1;

                if (hasNext) {
                    this.pdf.addPage();

                    this.height_position = 103;

                    this.current_page++;

                    this.pageWithProducts++;

                    this.lines();

                    this.printColumnNames();

                    this.invoice_type(this.typeC);

                    this.invoice_original();

                    this.leftHeaderCompanyData();

                    this.rightHeaderCompanyData();

                    this.invoice_type_name();

                    this.customer_data();
                }
            }

            this.yCoordinateInternalverticalLines = this.height_position;
        });
    }

    printTotals() {
        this.height_position = this.margin_bottom - 40;

        this.pdf.setFontSize(12);

        this.pdf.setFont('Helvetica', 'bold');

        this.height_position = this.height_position + 5;

        this.options = {
            lineHeightFactor: 1.2,
            maxWidth: 100,
            align: 'right',
        };

        this.pdf.text('TOTAL', this.first_column_text() * 8.5, this.height_position, this.options);

        this.options = {
            lineHeightFactor: 1.2,
            maxWidth: 100,
            align: 'right',
        };

        const totalInvoice = this.items?.reduce((total: number, item: Item) => {
            return total + (item.total ?? 0);
        }, 0);

        this.pdf.text(
            this.CurrencyFormat(totalInvoice),
            this.first_column_text() * 11.5,
            this.height_position,
            this.options,
        );

        this.totalToWords(totalInvoice!);
    }

    async print(): Promise<void> {
        this.printStructure(this.typeC);

        this.printProducts();

        this.printHorizontalLineAfterLastProduct();

        if (this.comment != '' && this.comment != null) {
            await this.convertCommentsToImage(this.comment);
        }

        this.printPageNumber(this.typeC);

        this.cae(this.voucher!.cae, this.voucher!.cae_fch_vto);

        this.printAfipQr(
            1,
            dayjs(this.voucher!.cbte_fch).format('YYYY-MM-DD'),
            parseInt(this.company!.cuit, 10),
            parseInt(this.voucher!.pto_vta, 10),
            this.voucher!.voucher_type,
            parseInt(this.voucher!.cbte_desde, 10),
            this.voucher!.total,
            'PES',
            1,
            this.customer!.afipDocTipo,
            parseInt(this.customer!.cuit, 10),
            'E',
            parseInt(this.voucher!.cae, 10),
        );

        this.afipLogo();

        this.afipLegend();

        await this.printCommentImage(this.typeC);

        const customer_name = `${this.customer?.name} ${this.customer?.last_name ? this.customer?.last_name : ''}`;
        this.pdf.save(
            `${customer_name} - ${this.customer?.cuit} ${this.voucher?.name} ${this.voucher?.pto_vta}-${this.voucher?.cbte_desde}.pdf`,
        );

        this.cleanTempDivsWithCommentsToConverterImages();
    }
}

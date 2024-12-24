import type { Item } from '@/app/types/Pdf';
import { Invoice } from './Invoice';
import { AFIP_IVA } from '@/app/types/Constantes';
import dayjs from 'dayjs';
import { AFIP_INSCRIPTION } from '@/app/types/Constantes';

export class A extends Invoice {
    public typeA: string = 'A';

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
            ['P/UNIT.'],
            true,
            7,
            this.first_column_text() * 7,
            this.first_line_height + 15,
            this.interline(),
        );

        this.write_text(
            ['SUBTOTAL'],
            true,
            7,
            this.first_column_text() * 8.3,
            this.first_line_height + 15,
            this.interline(),
        );

        this.write_text(
            ['IVA'],
            true,
            7,
            this.first_column_text() * 9.8,
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
    }

    printInternalVerticalsLines(yCoordinate: number) {
        // lineas para dividir las columnas en los detalles de los productos
        this.verticalLine(this.margin_left + 15, 103, this.margin_left + 15, yCoordinate);
        this.verticalLine(this.margin_right - 88, 103, this.margin_right - 88, yCoordinate);
        this.verticalLine(this.margin_right - 65, 103, this.margin_right - 65, yCoordinate);
        //this.verticalLine(this.margin_right - 48, 103, this.margin_right - 48,  this.margin_bottom - (this.one_cm() * 4))
        this.verticalLine(this.margin_right - 40, 103, this.margin_right - 40, yCoordinate);
        this.verticalLine(this.margin_right - 21, 103, this.margin_right - 21, yCoordinate);
    }

    printProducts() {
        this.height_position = this.first_line_where_write_details; //desde 103 a 220, en ese rango se imprimwn los detalles

        //this.factura_servicios(this.voucher);

        this.items?.forEach((product, index: number) => {
            this.height_position = this.height_position + 4;

            //##### QUANTITY ######
            this.width_position = 14;

            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 15,
                align: 'center',
            };

            this.pdf.setFontSize(this.size_text_details);

            const quantity = product.quantity;

            this.pdf.text(String(quantity), this.width_position, this.height_position, this.options);

            //##### PRODUCT NAME / DESCRIPTION ######
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
                    this.height_position = this.height_position + 4;
                }
            });

            //##### UNIT PRICE ######
            this.width_position = 135;

            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 23,
                align: 'right',
            };

            this.pdf.setFontSize(8);
            //this.width_position = 152;
            this.width_position = 134;
            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 23,
                align: 'right',
            };

            this.pdf.text(
                this.CurrencyFormat(product.unit_price),
                this.width_position,
                this.height_position,
                this.options,
            );

            //##### IVA PERCENTAGE ######
            this.width_position = 159;
            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 23,
                align: 'right',
            };
            //this.pdf.text(product.iva_name , this.width_position, this.height_position, this.options);

            //##### IVA IMPORT ######
            this.width_position = 179;
            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 23,
                align: 'right',
            };
            this.pdf.text(
                this.CurrencyFormat(product.iva_import),
                this.width_position,
                this.height_position,
                this.options,
            );
            // QUITO IMPORTE DE IVA Y AGREGO DESCUENTO
            //this.pdf.text(this.CurrencyFormat(product.discount_import) , this.width_position, this.height_position, this.options);

            //##### TOTAL ######
            this.pdf.setFontSize(9);
            this.width_position = 200;
            this.options = {
                lineHeightFactor: 1.7,
                maxWidth: 23,
                align: 'right',
            };

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
                    this.invoice_type(this.typeA);
                    this.invoice_original();
                    this.leftHeaderCompanyData();
                    this.rightHeaderCompanyData();
                    this.invoice_type_name();
                    this.customer_data();
                }
            }
        });

        this.yCoordinateInternalverticalLines = this.height_position;
    }

    getCodeName(code: string): string {
        const iva = AFIP_IVA.find((item) => item.code === code);
        return iva ? iva.name : '';
    }

    printTotals() {
        type Neto = {
            afip_code: string;
            name: string;
            total: number;
        };

        const netos: Neto[] = this.items!.reduce((result: Neto[], item: Item) => {
            const index = result.findIndex((el) => el.afip_code === item.iva_afip_code);

            if (index < 0) {
                result.push({
                    afip_code: item.iva_afip_code,
                    name: `Neto ${this.getCodeName(item.iva_afip_code)}:`,
                    total: item.neto_import,
                });
            } else {
                result[index].total += item.neto_import;
            }

            return result;
        }, []);

        type IVA = {
            afip_code: string;
            name: string;
            total: number;
        };

        const ivas: IVA[] = this.items!.reduce((result: IVA[], item: Item) => {
            const index = result.findIndex((el) => el.afip_code === item.iva_afip_code);

            if (index < 0) {
                result.push({
                    afip_code: item.iva_afip_code,
                    name: `Iva ${this.getCodeName(item.iva_afip_code)}:`,
                    total: item.iva_import,
                });
            } else {
                result[index].total += item.iva_import;
            }

            return result;
        }, []);

        const percep_iibb = this.items!.reduce((acc: Array, item: Item) => {
            const index = acc.findIndex((el) => el.name === `Percep. IIBB ${item.percep_iibb_alicuota} %:`);

            if (index < 0) {
                acc.push({
                    name: `Percep. IIBB ${item.percep_iibb_alicuota} %:`,
                    total: parseFloat(item.percep_iibb_import),
                });
            } else {
                acc[index].total += parseFloat(item.percep_iibb_import);
            }
            return acc;
        }, []);

        const percep_iva = this.items!.reduce((acc: any, item: Item) => {
            const index = acc.findIndex((el: any) => el.name === `Percep. IVA ${item.percep_iva_alicuota} %:`);

            if (index < 0) {
                acc.push({
                    name: `Percep. IVA ${item.percep_iva_alicuota} %:`,
                    total: parseFloat(item.percep_iva_import),
                });
            } else {
                acc[index].total += parseFloat(item.percep_iva_import);
            }

            return acc;
        }, []);

        this.height_position = this.margin_bottom - 40;

        this.pdf.setFontSize(10);

        this.pdf.setFont('Helvetica', 'bold');

        this.height_position = this.height_position + 5;

        this.options = {
            lineHeightFactor: 1.2,
            maxWidth: 100,
            align: 'right',
        };

        ///////////////// NETOS //////////////////
        netos.forEach((neto: Neto) => {
            this.pdf.text(neto.name, this.first_column_text() * 8.5, this.height_position, this.options);
            this.pdf.text(
                this.CurrencyFormat(neto.total),
                this.first_column_text() * 11.5,
                this.height_position,
                this.options,
            );
            this.height_position = this.height_position + 5;
        });
        ///////////////// IVAS //////////////////
        ivas.forEach((iva: IVA) => {
            this.pdf.text(iva.name, this.first_column_text() * 8.5, this.height_position, this.options);
            this.pdf.text(
                this.CurrencyFormat(iva.total),
                this.first_column_text() * 11.5,
                this.height_position,
                this.options,
            );
            this.height_position = this.height_position + 5;
        });
        ///////////////// PERCEPCION IIBB //////////////////
        percep_iibb.forEach((iibb: any) => {
            if (iibb.total === 0) {
                return;
            }
            this.pdf.text(iibb.name, this.first_column_text() * 8.5, this.height_position, this.options);
            this.pdf.text(
                this.CurrencyFormat(iibb.total),
                this.first_column_text() * 11.5,
                this.height_position,
                this.options,
            );
            this.height_position = this.height_position + 5;
        });
        ///////////////// PERCEPCION IVA //////////////////
        percep_iva.forEach((percep_iva: any) => {
            this.pdf.text(percep_iva.name, this.first_column_text() * 8.5, this.height_position, this.options);
            this.pdf.text(
                this.CurrencyFormat(percep_iva.total),
                this.first_column_text() * 11.5,
                this.height_position,
                this.options,
            );
            this.height_position = this.height_position + 5;
        });
        ///////////////// TOTALS //////////////////
        this.pdf.text('TOTAL', this.first_column_text() * 8.5, this.height_position, this.options);

        const totalInvoice = this.items?.reduce((total: number, item: Item) => {
            return total + (item.total ?? 0) + item.percep_iibb_import! + item.percep_iva_import!;
        }, 0);

        this.pdf.text(
            this.CurrencyFormat(totalInvoice),
            this.first_column_text() * 11.5,
            this.height_position,
            this.options,
        );
        this.totalToWords(totalInvoice);
    }

    afipLegendRItoMonotributo() {
        const lines = this.pdf.splitTextToSize(
            'El crédito fiscal discriminado en el presente comprobante, sólo podrá ser computado a efectos del Régimen de Sostenimiento e Inclusión Fiscal para Pequeños Contribuyentes de la Ley Nº 27.618',
            70, // Ancho máximo de 70
        );

        this.pdf.setFontSize(7);
        this.pdf.setTextColor(255, 0, 0);
        this.pdf.text(lines, 80, 271, { align: 'left' });
        this.pdf.setTextColor(0);
    }

    async print(): Promise<void> {
        this.printStructure(this.typeA);

        this.printProducts();

        this.printHorizontalLineAfterLastProduct();

        if (this.comment != '' && this.comment != null) {
            await this.convertCommentsToImage(this.comment);
        }

        this.printPageNumber(this.typeA);

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

        if (
            this.company?.afipInscription_id === AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO &&
            (this.customer?.afipInscription_id === AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO ||
                this.customer?.afipInscription_id === AFIP_INSCRIPTION.MONOTRIBUTISTA_SOCIAL)
        ) {
            this.afipLegendRItoMonotributo();
        }

        await this.printCommentImage(this.typeA);

        const customer_name = `${this.customer?.name} ${this.customer?.last_name ? this.customer?.last_name : ''}`;
        this.pdf.save(
            `${customer_name} - ${this.customer?.cuit} ${this.voucher?.name} ${this.voucher?.pto_vta}-${this.voucher?.cbte_desde}.pdf`,
        );

        this.cleanTempDivsWithCommentsToConverterImages();
    }

    async getFilePdf(): Promise<any> {
        this.printStructure(this.typeA);

        this.printProducts();

        this.printHorizontalLineAfterLastProduct();

        if (this.comment != '' && this.comment != null) {
            await this.convertCommentsToImage(this.comment);
        }

        this.printPageNumber(this.typeA);

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

        if (
            this.company?.afipInscription_id === AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO &&
            (this.customer?.afipInscription_id === AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO ||
                this.customer?.afipInscription_id === AFIP_INSCRIPTION.MONOTRIBUTISTA_SOCIAL)
        ) {
            this.afipLegendRItoMonotributo();
        }

        await this.printCommentImage(this.typeA);

        const customer_name = `${this.customer?.name} ${this.customer?.last_name ? this.customer?.last_name : ''}`;
        const fileName = `${customer_name} - ${this.customer?.cuit} ${this.voucher?.name} ${this.voucher?.pto_vta}-${this.voucher?.cbte_desde}.pdf`;
        const file = this.pdf.output('datauristring', { filename: fileName });

        this.cleanTempDivsWithCommentsToConverterImages();

        return Promise.resolve(file);
    }
}

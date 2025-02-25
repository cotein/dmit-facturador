import { jsPDF } from 'jspdf';
import NumbersToWords from './NumbersToWords';
import Dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

Dayjs.extend(customParseFormat);

export type TextOptions = {
    maxWidth?: number;
    align?: 'left' | 'center' | 'right';
    baseline?: 'top' | 'middle' | 'bottom';
    angle?: number;
    style?: 'normal' | 'bold' | 'italic' | 'underline';
};

export class Pdf {
    public A4;
    public pdf;
    public margin_left: number;
    public margin_right: number;
    public margin_top: number;
    public margin_bottom: number;
    public first_line_height: number;
    public size_text_details: number;
    public size_text_totals: number;
    public first_line_where_write_details: number;
    public last_line_where_write_details: number;
    public width_description_area: number;
    public current_page: number;

    constructor() {
        this.A4 = {
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        };

        this.margin_left = 7;
        this.margin_right = 200;
        this.margin_top = 5;
        this.margin_bottom = 260;
        this.first_line_height = 85;
        this.size_text_details = 8;
        this.size_text_totals = 10;
        this.first_line_where_write_details = 103;
        this.last_line_where_write_details = 200;
        this.width_description_area = 135;
        this.current_page = 1;

        this.pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            hotfixes: ['px_scaling'],
        });
    }

    write_text(
        array_text: string[],
        bold: boolean = false,
        size_text: number = 8,
        width_position: number,
        height_position: number,
        interline: number = 5,
        options?: TextOptions,
    ) {
        this.pdf.setFontSize(size_text);

        if (bold) {
            this.pdf.setFont('Helvetica', 'bold');
        } else {
            this.pdf.setFont('Helvetica', 'normal');
        }

        array_text.forEach((element, index) => {
            if (options) {
                this.pdf.text(element, width_position, height_position, options);
            } else {
                this.pdf.text(element, width_position, height_position);
            }
            height_position = height_position + interline;
        });
        this.pdf.setFont('Helvetica', 'normal');
    }

    CurrencyFormat(value: number | string) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
        }).format(parseFloat(value as string));
    }

    /* addImage(data: string) {
		this.pdf.addImage(data, 'PNG', 50, 50);
	} */

    numbersToWords(value: number) {
        const numbersToWords = new NumbersToWords();

        const text = numbersToWords.NumeroALetras(value, {
            plural: 'PESOS',
            singular: 'PESO',
            centPlural: 'CENTAVOS',
            centSingular: 'CENTAVO',
        });

        return text;
    }

    /**
     * Formats a given date string into the specified format.
     *
     * @param date - The date string to be formatted.
     * @param formtatDate - The desired format for the date string. Defaults to 'DD-MM-YYYY'.
     * @returns The formatted date string.
     */
    dateFormatted(date: string, formtatDate: string = 'DD-MM-YYYY'): string {
        const dateFormats = ['DD-MM-YYYY', 'YYYY-MM-DD'];
        return Dayjs(date, dateFormats).format(formtatDate.toUpperCase());
        //return Dayjs(date, dateFormats).toISOString();
    }
}

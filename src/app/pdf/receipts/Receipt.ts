import type { TextOptionsLight } from 'jspdf';
import { Pdf } from '../Pdf';

export class Receipt extends Pdf {
    private totalWidth: number;
    private totalHeight: number;
    private puntoMedioAncho: number;
    private marginLeft: number;
    private marginRight: number;
    private marginTop: number;
    private marginBottom: number;
    private alturaDeEscrituraEnEjeY: number;
    private maximumWritingHeightPerPage: number = 277;

    constructor() {
        super();
        this.totalWidth = this.pdf.internal.pageSize.getWidth();
        this.totalHeight = this.pdf.internal.pageSize.getHeight();
        this.puntoMedioAncho = this.totalWidth / 2;
        this.marginLeft = 10; // 1 cm
        this.marginRight = this.totalWidth - this.marginLeft;
        this.marginTop = 10; // 1 cm
        this.marginBottom = this.totalHeight - this.marginTop; //287mm
        this.alturaDeEscrituraEnEjeY = this.marginTop;
    }

    public setAlturaDeEscrituraEnEjeY(altura: number): void {
        this.alturaDeEscrituraEnEjeY = altura;
    }

    public getAlturaDeEscrituraEnEjeY(): number {
        return this.alturaDeEscrituraEnEjeY;
    }

    public drawMainRectangle(): void {
        const rectWidth: number = this.marginRight - this.marginLeft;
        const rectHeight: number = this.marginBottom - this.marginTop;

        this.pdf.rect(this.marginLeft, this.marginTop, rectWidth, rectHeight);
    }

    public drawCompanyRectangles(): void {
        const rWidth: number = (this.marginRight - this.marginLeft) / 2;
        const rHeight: number = 50;

        // Recuadros de datos de la compañía
        this.pdf.rect(this.marginLeft, this.marginTop, rWidth, rHeight); // Recuadro izquierdo
        this.pdf.rect(this.puntoMedioAncho, this.marginTop, rWidth, rHeight); // Recuadro derecho
    }

    public drawClientRectangle(): void {
        const rectWidth: number = this.marginRight - this.marginLeft;

        // Recuadro de datos del cliente
        this.pdf.rect(this.marginLeft, this.marginTop + 50, rectWidth, 35); // Recuadro inferior
    }

    public drawInnerRectangle(): void {
        const innerRectWidth: number = 10; // 2 cm
        const innerRectHeight: number = 10; // 2 cm
        const innerRectX: number = this.marginLeft + (this.marginRight - this.marginLeft - innerRectWidth) / 2;
        const innerRectY: number = this.marginTop;

        this.pdf.setFillColor(255, 255, 255); // Color blanco
        this.pdf.setDrawColor(0, 0, 0); // Color negro
        this.pdf.rect(innerRectX, innerRectY, innerRectWidth, innerRectHeight, 'FD');

        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(16);
        const centerX: number = innerRectX + innerRectWidth / 2;
        const centerY: number = innerRectY + innerRectHeight / 2;
        const text: string = 'R';
        this.pdf.text(text, centerX, centerY, { align: 'center', baseline: 'middle' });
    }

    public writeClientData(name: string, address: string, ivaCondition: string): void {
        let textWidth: number = 0;
        const senoresText: string = 'SEÑOR/ES:';
        const domicilioText: string = 'DOMICILIO:';
        const condIvaText: string = 'COND. IVA:';
        const rectWidth: number = this.marginRight - this.marginLeft;
        const rectX: number = this.marginLeft;
        const rectY: number = this.marginTop + 50;
        const lineHeight: number = 5;

        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
        this.pdf.setTextColor(0, 0, 0); // Color negro

        const textX: number = rectX + 5;
        const textY: number = rectY + lineHeight;

        this.pdf.text(senoresText.toUpperCase(), textX, textY);
        textWidth = this.pdf.getStringUnitWidth(senoresText);
        this.pdf.text(name, textX + textWidth * 4, textY);

        this.pdf.text(domicilioText.toUpperCase(), textX, textY + lineHeight);
        textWidth = this.pdf.getStringUnitWidth(domicilioText);
        this.pdf.text(address, textX + textWidth * 4, textY + lineHeight);

        this.pdf.text(condIvaText.toUpperCase(), textX, textY + lineHeight + 5);
        textWidth = this.pdf.getStringUnitWidth(condIvaText);
        this.pdf.text(ivaCondition.toUpperCase(), textX + textWidth * 4, textY + lineHeight + 5);
    }

    public writePaidReceipts(): void {
        this.pdf.setFont('helvetica', 'bolditalic');
        this.pdf.setFontSize(10);
        this.pdf.setTextColor(0, 0, 0); // Color negro

        const textX: number = this.marginLeft + 5;
        const textY: number = this.marginTop + 50 + 35 + 5; // Posición debajo del rectángulo

        this.pdf.text('• Comprobantes pagados'.toUpperCase(), textX, textY);
    }

    public howManyPagesDoINeed(firstArray: any[], secondArray: any[]): number {
        const initialCoodinatesOnY: number = 105;
        let acc: number = 0;

        for (let i = 0; i < firstArray.length; i++) {
            acc = initialCoodinatesOnY + i * 5;
            this.setAlturaDeEscrituraEnEjeY(initialCoodinatesOnY + i * 5);
        }

        for (let i = 0; i < secondArray.length; i++) {
            this.setAlturaDeEscrituraEnEjeY(acc + i * 5);
        }

        const totalPages = Math.ceil(this.getAlturaDeEscrituraEnEjeY() / this.maximumWritingHeightPerPage);

        return totalPages;
    }

    public writeReceiptDetails(details: { name: string; total: number }[]): void {
        const options: TextOptionsLight = {
            lineHeightFactor: 1.2,
            maxWidth: 100,
            align: 'right',
        };

        const rectWidth: number = this.marginRight - this.marginLeft;

        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
        this.pdf.setTextColor(0, 0, 0); // Color negro

        const textX: number = this.marginLeft + 5;
        const textY: number = this.marginTop + 50 + 35 + 10; // Posición debajo de "Comprobantes pagados"

        let totalSum = 0; // Variable para almacenar la suma total

        for (let i = 0; i < details.length; i++) {
            const detailObj = details[i];
            const detailName = detailObj.name;
            const detailTotal = detailObj.total;
            totalSum += detailTotal;

            this.pdf.text(`${i + 1} - ${detailName}`, textX, textY + i * 5); // Nombre del voucher
            this.pdf.text(detailObj.total.toFixed(2), textX + rectWidth - 50, textY + i * 5, options); // Total del voucher alineado a la derecha
            this.alturaDeEscrituraEnEjeY = textY + i * 5;
            console.log(
                '🚀 ~ Receipt ~ writeReceiptDetails ~ this.alturaDeEscrituraEnEjeY:',
                this.alturaDeEscrituraEnEjeY,
            );
        }

        // Suma totalmarginBottom
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('Total:', textX, textY + details.length * 5 + 5); // Etiqueta "Total"
        this.pdf.text(totalSum.toFixed(2), textX + rectWidth - 50, textY + details.length * 5 + 5, options); // Suma total alineada a la derecha
        this.alturaDeEscrituraEnEjeY = textY + details.length * 5 + 5;

        /// Línea punteada
        const lineY = textY + details.length * 5 + 20; // Posición vertical debajo del total
        const lineLength = rectWidth - 10; // Longitud de la línea punteada
        const dotSpacing = 4; // Espaciado entre los puntos en la línea punteada

        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(128, 128, 128); // Color gris (RGB: 128, 128, 128)
        this.pdf.setLineDash([dotSpacing, dotSpacing], 0); // Patrón de línea punteada
        this.pdf.line(textX, lineY, textX + lineLength, lineY); // Dibujar la línea punteada desde el margen izquierdo hasta el margen derecho
        this.alturaDeEscrituraEnEjeY = lineY;
        console.log('🚀 ~ wwwwwwwwwwwwwwww ~ this.alturaDeEscrituraEnEjeY:', this.alturaDeEscrituraEnEjeY);
    }

    public savePDF(fileName: string = 'Recibo.pdf'): void {
        this.pdf.save(fileName);
    }
}

/* const pdfGenerator = new Receipt();
pdfGenerator.drawMainRectangle();
pdfGenerator.drawCompanyRectangles();
pdfGenerator.drawClientRectangle();
pdfGenerator.drawInnerRectangle();
pdfGenerator.savePDF('archivo.pdf'); */

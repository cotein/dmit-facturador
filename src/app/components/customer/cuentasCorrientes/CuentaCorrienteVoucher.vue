<template>
	<div class="voucher">
		<span>{{ props.record.voucher }}</span>
		<sdButton size="sm" type="dark" transparented @click="print"> Imprimir </sdButton>
	</div>
</template>

<script setup lang="ts">
import { Receipt } from '@/app/pdf/receipts/Receipt';
import jsPDF from 'jspdf';
type Props = {
	record: any;
};

const props = withDefaults(defineProps<Props>(), {
	record: undefined,
});

const print = () => {
	const array: { name: string; total: number }[] = [
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
		{
			name: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			total: 121,
		},
	];
	const pdf = new Receipt();

	for (let i = 0; i < pdf.howManyPagesDoINeed(array, array); i++) {
		console.log('🚀 ~ print ~ i:', i);
		pdf.drawMainRectangle();
		console.log('🚀 ~ print ~ drawMainRectangle:', pdf.howManyPagesDoINeed(array, array));

		pdf.drawCompanyRectangles();
		pdf.drawClientRectangle();
		pdf.writePaidReceipts();
		pdf.writeClientData(
			'Agustin Ariel',
			'SANTOS LUGARES (1676) - 1676 - Buenos Aires - ARGENTINA',
			'responsable inscripto',
		);
		pdf.drawInnerRectangle();
		pdf.writeReceiptDetails(array);
		pdf.pdf.addPage();
	}

	pdf.savePDF('archivo.pdf');
	/* const doc = new jsPDF();

	let alturaDeEscrituraEnEjeX = 0; //lo puedo poner dentro de una funcion

	const totalWidth = doc.internal.pageSize.getWidth();
	const totalHeight = doc.internal.pageSize.getHeight();
	const puntoMedioAncho = totalWidth / 2;

	const marginLeft = 10; // 1 cm
	const marginRight = totalWidth - marginLeft;
	const marginTop = 10; // 1 cm
	const marginBottom = totalHeight - marginTop;
	alturaDeEscrituraEnEjeX = marginTop;

	const rectWidth = marginRight - marginLeft;
	const rectHeight = marginBottom - marginTop;

	doc.rect(marginLeft, marginTop, rectWidth, rectHeight);

	const innerRectWidth = 10; // 2 cm
	const innerRectHeight = 10; // 2 cm
	const innerRectX = marginLeft + (rectWidth - innerRectWidth) / 2;
	const innerRectY = marginTop;

	const rWidth = rectWidth / 2;
	const rHeight = 50;

	// esto es para datos de la compañia
	doc.rect(marginLeft, marginTop, rWidth, rHeight); //recuadro izquierdo
	doc.rect(puntoMedioAncho, marginTop, rWidth, rHeight); //recuadro derecho

	// esto es para datos del cliente
	doc.rect(marginLeft, marginTop + 50, rectWidth, 35); //recuadro derecho

	doc.setFillColor(255, 255, 255); // Color blanco
	doc.setDrawColor(0, 0, 0); // Color negro
	doc.rect(innerRectX, innerRectY, innerRectWidth, innerRectHeight, 'FD');

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(16);
	const centerX = innerRectX + innerRectWidth / 2;
	const centerY = innerRectY + innerRectHeight / 2;
	const text = 'R';
	doc.text(text, centerX, centerY, { align: 'center', baseline: 'middle' });
	doc.save('archivo.pdf'); */
};
</script>

<style scoped>
div {
	display: flex;
	justify-content: space-between;
	width: 100%;
}
</style>

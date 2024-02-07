import { Title } from 'chart.js';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

export class ExcelService {
	public titleHeight: number = 31;

	download(dataExcel: any, nombreArchivo: string = 'pp') {
		const workbook = new Workbook();
		workbook.creator = 'Diego';

		const sheet = workbook.addWorksheet('Ventas');

		const row = sheet.getRow(2);
		row.height = this.titleHeight;
		/* sheet.columns.forEach((column) => {
			column.alignment = { vertical: 'middle', horizontal: 'left' };
		}); */
		sheet.mergeCells('B2:G2');
		const title = sheet.getCell('B2');
		title.value = 'Listado de comprobantes de venta';
		title.style.font = { bold: true, size: 18 };

		sheet.getCell('B2').style = {
			fill: {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: '00000000' }, // Fondo negro
			},
			font: {
				color: { argb: 'FFFFFFFF' }, // Letra blanca
				bold: true,
			},
			alignment: {
				vertical: 'middle', // Centrado vertical
				horizontal: 'center', // Centrado horizontal
			},
		};

		sheet.addTable({
			name: 'SaleInvoicesTable',
			ref: 'B5',
			headerRow: true,
			totalsRow: true,
			style: {
				theme: 'TableStyleDark3',
				showFirstColumn: true,
			},
			columns: [
				{ name: '#', totalsRowLabel: 'Totales:', filterButton: false },
				{ name: 'CLIENTE', totalsRowLabel: 'none', filterButton: false },
				{ name: 'CUIT', totalsRowLabel: 'none', filterButton: false },
				{ name: 'COMPROBANTE', totalsRowFunction: 'none', filterButton: false },
				{ name: 'FECHA', totalsRowFunction: 'none', filterButton: false },
				{ name: 'NUMERO', totalsRowFunction: 'none', filterButton: false },
				{ name: 'NETO', totalsRowFunction: 'sum', filterButton: false },
				{ name: 'IVA', totalsRowFunction: 'sum', filterButton: false },
				{ name: 'TOTAL', totalsRowFunction: 'sum', filterButton: false },
				{ name: 'CAE', totalsRowFunction: 'none', filterButton: false },
				{ name: 'VTO CAE', totalsRowFunction: 'none', filterButton: false },
				{ name: 'CONDICION', totalsRowFunction: 'none', filterButton: false },
				{ name: 'ESTADO', totalsRowFunction: 'none', filterButton: false },
			],
			rows: dataExcel,
			/* rows: [
				[1, 'Diego', 20227339730, 'FACTURA A', '22/04/1973', '0001-00000563', 1000, 210, 1210],
				[1, 'Diego', 'FACTURA A', '22/04/1973', '0001-00000564', 1000, 210, 1210],
				[1, 'Diego', 'FACTURA A', '22/04/1973', '0001-00000565', 1000, 210, 1210],
				[1, 'Diego', 'FACTURA A', '22/04/1973', '0001-00000566', 1000, 210, 1210],
				[1, 'Diego', 'FACTURA A', '22/04/1973', '0001-00000567', 1000, 210, 1210],
				[1, 'Diego', 'FACTURA A', '22/04/1973', '0001-00000568', 1000, 210, 1210],
			], */
		});

		const headerRow = sheet.getRow(5);
		headerRow.height = this.titleHeight / 1.3;

		headerRow.eachCell(function (cell, rowNumber) {
			sheet.getCell(cell.address).style = {
				fill: {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '00000000' }, // Fondo negro
				},
				font: {
					color: { argb: 'FFFFFFFF' }, // Letra blanca
					name: 'Arial Black',
				},
				alignment: {
					vertical: 'middle', // Centrado vertical
					horizontal: 'center', // Centrado horizontal
				},
			};
		});

		const columns = [
			{ id: 'B', width: 5 },
			{ id: 'C', width: 75 },
			{ id: 'D', width: 25 },
			{ id: 'E', width: 25 },
			{ id: 'F', width: 17 },
			{ id: 'G', width: 20 },
			{ id: 'H', width: 31 },
			{ id: 'I', width: 31 },
			{ id: 'J', width: 31 },
			{ id: 'K', width: 31 },
			{ id: 'L', width: 17 },
			{ id: 'M', width: 20 },
			{ id: 'N', width: 20 },
		];

		columns.forEach((column) => {
			const c = sheet.getColumn(column.id);
			c.width = column.width;
		});

		const table = sheet.getTable('SaleInvoicesTable');

		columns.forEach((column) => {
			for (let index = 0; index < table.table.rows.length; index++) {
				if (
					column.id === 'B' ||
					column.id === 'D' ||
					column.id === 'G' ||
					column.id === 'K' ||
					column.id === 'L'
				) {
					sheet.getCell(`${column.id}${index + 6}`).style.alignment = { horizontal: 'center' };
				}

				if (column.id === 'G' || column.id === 'H' || column.id === 'I') {
					sheet.getCell(`${column.id}${index + 6}`).numFmt = '$ #,##0.00;';
				}
			}
		});

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
			});

			fs.saveAs(blob, `${nombreArchivo}`);
		});
	}
}

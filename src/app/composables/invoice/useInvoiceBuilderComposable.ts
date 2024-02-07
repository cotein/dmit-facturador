import { FactoryInvoiceBuilder } from './Clases/FactoryInvoiceBuilder';
import { storeToRefs } from 'pinia';
import { useInvoiceStore } from '@/app/store/invoice/useInvoiceStore';
import type { AfipInvoiceBaseBuilder } from './Clases/AfipInvoiceBaseBuilder';

const { invoiceType } = storeToRefs(useInvoiceStore());

export const useInvoiceBuilderComposable = () => {
	const createBuilder = (
		invoiceType: number,
		inscriptionCompany: number,
		inscriptionCustomer: number,
	): AfipInvoiceBaseBuilder => {
		const invoiceBuilder = FactoryInvoiceBuilder.getInvoiceBuilder(
			invoiceType,
			inscriptionCompany,
			inscriptionCustomer,
		);

		return invoiceBuilder;
	};

	const createInvoiceBuilder = (
		builder: AfipInvoiceBaseBuilder,
		CantReg: any,
		PtoVta: any,
		CbteTipo: any,
		Concepto: any,
		DocTipo: any,
		DocNro: any,
		CbteDesde: any,
		CbteHasta: any,
		CbteFch: any,
		SaleConditionDays: any,
		ImpTotal: any,
		ImpTotConc: any,
		ImpNeto: any,
		ImpOpEx: any,
		ImpIVA: any,
		ImpTrib: any,
		FchServDesde: any,
		FchServHasta: any,
		MonId: any,
		MonCotiz: any,
		IvaAarray: any,
		CbtesAsoc: any,
		Tributos: any,
		Opcionales: any,
		Compradores: any,
		PeriodoAsoc: any,
		Actividades: any,
	) => {
		const concreteInvoiceBuilder = new builder() as AfipInvoiceBaseBuilder;
		concreteInvoiceBuilder.setCantReg(CantReg);
		concreteInvoiceBuilder.setPtoVta(PtoVta);
		concreteInvoiceBuilder.setCbteTipo(CbteTipo);
		concreteInvoiceBuilder.setConcepto(Concepto);
		concreteInvoiceBuilder.setDocTipo(DocTipo);
		concreteInvoiceBuilder.setDocNro(DocNro);
		concreteInvoiceBuilder.setCbteDesde(CbteDesde);
		concreteInvoiceBuilder.setCbteHasta(CbteHasta);
		concreteInvoiceBuilder.setCbteFch(CbteFch);
		concreteInvoiceBuilder.setImpTotal(ImpTotal);
		concreteInvoiceBuilder.setImpTotConc(ImpTotConc);
		concreteInvoiceBuilder.setImpNeto(ImpNeto);
		concreteInvoiceBuilder.setImpOpEx(ImpOpEx);
		concreteInvoiceBuilder.setImpIVA(ImpIVA);
		concreteInvoiceBuilder.setImpTrib(ImpTrib);
		concreteInvoiceBuilder.setFchServDesde(FchServDesde);
		concreteInvoiceBuilder.setFchServHasta(FchServHasta);
		concreteInvoiceBuilder.setFchVtoPago(CbteFch, SaleConditionDays);
		concreteInvoiceBuilder.setMonId(MonId);
		concreteInvoiceBuilder.setMonCotiz(MonCotiz);
		concreteInvoiceBuilder.setIvaAarray(IvaAarray);
		concreteInvoiceBuilder.setCbtesAsoc(CbtesAsoc);
		concreteInvoiceBuilder.setTributos(Tributos);
		concreteInvoiceBuilder.setOpcionales(Opcionales);
		concreteInvoiceBuilder.setCompradores(Compradores);
		concreteInvoiceBuilder.setPeriodoAsoc(PeriodoAsoc);
		concreteInvoiceBuilder.setActividades(Actividades);

		const result = concreteInvoiceBuilder.build();

		return result;
	};

	return { createBuilder, createInvoiceBuilder, invoiceType };
};

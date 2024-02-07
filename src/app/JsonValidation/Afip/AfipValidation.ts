import Ajv from 'ajv';

const ajv = new Ajv();

export const FECAEDetRequestJSONSchema = {
	type: 'object',
	additionalProperties: false,
	properties: {
		Concepto: {
			type: 'integer',
			if: {
				const: 2 || 3,
			},
			then: {
				required: ['FchServDesde', 'FchServHasta'],
			},
			else: {
				required: [],
			},
		},
		DocTipo: {
			type: 'integer',
		},
		DocNro: {
			type: 'integer',
		},
		CbteDesde: {
			type: 'integer',
		},
		CbteHasta: {
			type: 'integer',
		},
		CbteFch: {
			type: 'string',
		},
		ImpTotal: {
			type: 'number',
		},
		ImpTotConc: {
			type: 'integer',
		},
		ImpNeto: {
			type: 'number',
		},
		ImpOpEx: {
			type: 'integer',
		},
		ImpTrib: {
			type: 'integer',
		},
		ImpIVA: {
			type: 'integer',
		},
		FchServDesde: {
			type: 'string',
		},
		FchServHasta: {
			type: 'string',
		},
		MonId: {
			type: 'string',
		},
		MonCotiz: {
			type: 'integer',
		},
	},
	required: [
		'CbteDesde',
		'CbteFch',
		'CbteHasta',
		'Concepto',
		'DocNro',
		'DocTipo',
		'ImpIVA',
		'ImpNeto',
		'ImpOpEx',
		'ImpTotConc',
		'ImpTrib',
		'MonCotiz',
		'MonId',
	],
	title: 'FECAEDetRequest',
};

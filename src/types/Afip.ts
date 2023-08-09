export interface AfipInscription {
	id: number;
	name: string;
}

export interface AfipState {
	id: number;
	name: string;
}

export interface DatosGenerales {
	apellido: string;
	domicilioFiscal: DomicilioFiscal;
	estadoClave: string;
	idPersona: number;
	mesCierre: number;
	nombre?: string;
	razonSocial?: string;
	tipoClave: string;
	tipoPersona: string;
}

export interface DomicilioFiscal {
	codPostal: string;
	descripcionProvincia: string;
	direccion: string;
	idProvincia: number;
	localidad: string;
	tipoDomicilio: string;
}

export interface DatosRegimenGeneral {
	actividad: Actividad[] | Object;
	impuesto: Impuesto[] | Object;
	regimen: Regimen[] | Object;
}

export interface Actividad {
	descripcionActividad: string;
	idActividad: number;
	nomenclador: number;
	orden: number;
	periodo: number;
}

export interface Impuesto {
	descripcionImpuesto: string;
	idImpuesto: number;
	periodo: number;
}

export interface Regimen {
	descripcionRegimen: string;
	idImpuesto: number;
	idRegimen: number;
	periodo: number;
	tipoRegimen: string;
}

export interface DatosMonotributo {
	actividadMonotributista: Actividad;
	categoriaMonotributo: CategoriaMonotributo;
	impuesto: Impuesto;
}

export interface CategoriaMonotributo {
	descripcionCategoria: string;
	idCategoria: number;
	idImpuesto: number;
	periodo: number;
}

export interface Metadata {
	fechaHora: string;
	servidor: string;
}

export type PersonaReturn = {
	personaReturn: {
		errorConstancia?: ErrorConstancia;
		datosGenerales: DatosGenerales;
		datosMonotributo?: DatosMonotributo;
		datosRegimenGeneral: DatosRegimenGeneral;
		metaData: Metadata;
	};
};

export type ErrorConstancia = {
	apellido: string;
	error: string;
	idPersona: number;
	nombre: string;
};

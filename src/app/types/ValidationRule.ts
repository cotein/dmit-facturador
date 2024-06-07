export type Rule = {
    required?: boolean;
    message?: string;
    validator?: (...args: any[]) => Promise<void> | void;
    trigger?: string | string[];
    min?: number;
    max?: number;
    // Puedes añadir aquí otras propiedades según tus necesidades
};

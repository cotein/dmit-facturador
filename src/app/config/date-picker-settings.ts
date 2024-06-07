export const localeObject = {
    name: 'es', // name String
    weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'), // weekdays Array
    weekdaysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'), // OPTIONAL, short weekdays Array, use first three letters if not provided
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'), // OPTIONAL, min weekdays Array, use first two letters if not provided
    weekStart: 1, // OPTIONAL, set the start of a week. If the value is 1, Monday will be the start of week instead of Sunday。
    yearStart: 4, // OPTIONAL, the week that contains Jan 4th is the first week of the year.
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'), // months Array
    monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'), // OPTIONAL, short months Array, use first three letters if not provided
};

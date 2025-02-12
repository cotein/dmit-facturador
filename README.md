# DMIT Facturador

Este proyecto es una aplicación de facturación desarrollada con Vue 3 y Vite.

## Configuración recomendada del IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (y desactivar Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Soporte de tipos para importaciones de `.vue` en TS

TypeScript no puede manejar información de tipos para importaciones de `.vue` por defecto, por lo que reemplazamos la CLI `tsc` con `vue-tsc` para la verificación de tipos. En los editores, necesitamos [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) para que el servicio de lenguaje TypeScript sea consciente de los tipos `.vue`.

Si el plugin TypeScript independiente no te parece lo suficientemente rápido, Volar también ha implementado un [Modo de Toma de Control](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) que es más eficiente. Puedes habilitarlo con los siguientes pasos:

1. Desactiva la extensión TypeScript incorporada
    1) Ejecuta `Extensions: Show Built-in Extensions` desde el paleta de comandos de VSCode
    2) Encuentra `TypeScript and JavaScript Language Features`, haz clic derecho y selecciona `Disable (Workspace)`
2. Recarga la ventana de VSCode ejecutando `Developer: Reload Window` desde el paleta de comandos.

## Personalizar configuración

Consulta la [Referencia de Configuración de Vite](https://vitejs.dev/config/).

## Configuración del proyecto

```sh
npm install

# SISVEC - Guía de Despliegue en Entorno de Desarrollo

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 17.3.8.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

1. **Node.js**: Descarga e instala la última versión de [Node.js](https://nodejs.org/).
2. **Angular CLI**: Instala la CLI de Angular globalmente ejecutando el siguiente comando:
   ```bash
   npm install -g @angular/cli@17
   ```
3. **Dependencias del proyecto**: Una vez clonado el repositorio, instala las dependencias ejecutando:
   ```bash
   npm install
   ```

## Clonar el repositorio

    ``` bash
    git clone https://github.com/KenethUrrutia/SGSVU_API.git
    cd SGSVU_API
    ```

## Despliegue en Entorno de Desarrollo

1. **Servidor de Desarrollo**
   Para iniciar el servidor de desarrollo, ejecuta:

   ```bash
   ng serve
   ```

   Esto iniciará el servidor en la dirección: [http://localhost:4200/](http://localhost:4200/).

   El servidor recargará automáticamente la aplicación si realizas cambios en los archivos fuente.

2. **Configuración Adicional**
   Si necesitas cambiar el puerto por defecto (4200), puedes especificarlo de la siguiente manera:
   ```bash
   ng serve --port 4300
   ```

## Generación de Código

Para generar nuevos elementos en el proyecto, utiliza los comandos de Angular CLI. Por ejemplo:

- **Componente**:
  ```bash
  ng generate component nombre-componente
  ```
- **Servicio**:
  ```bash
  ng generate service nombre-servicio
  ```
- **Guard**:
  ```bash
  ng generate guard nombre-guard
  ```

## Construcción del Proyecto

Para compilar el proyecto y generar los artefactos necesarios para producción, utiliza:

```bash
ng build
```

Los archivos generados estarán disponibles en la carpeta `dist/`.

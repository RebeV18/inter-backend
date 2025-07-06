# Firebase + NestJS - Guía de Implementación

## 🔥 Configuración Completa de Firebase con NestJS

Has implementado exitosamente **Firebase Firestore** como base de datos NoSQL para tu aplicación NestJS. Aquí tienes toda la información para usarlo efectivamente.

## 📋 Estructura del Proyecto

```
src/
├── firebase/
│   ├── firebase.module.ts      # Módulo principal de Firebase
│   ├── firestore.service.ts    # Servicio genérico para Firestore
│   └── firebase.controller.ts  # Controlador para testing
├── config/
│   ├── firebase.config.ts      # Configuración de Firebase
│   └── environment.config.ts   # Variables de entorno
└── countries/
    ├── countries.service.ts    # Servicio actualizado para Firestore
    ├── countries.controller.ts # Controlador con nuevos endpoints
    └── dto/
        └── create-country.dto.ts # DTO mejorado
```

## 🚀 Configuración de Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Ve a **Project Settings > Service Accounts**
5. Genera una nueva clave privada (archivo JSON)

### 2. Configurar variables de entorno

Actualiza tu archivo `.env` con las credenciales de Firebase:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-clave-privada\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu-client-id
```

## 🎯 Endpoints Disponibles

### Countries API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/countries` | Crear un país |
| GET | `/countries` | Obtener todos los países |
| GET | `/countries?region=South America` | Filtrar por región |
| GET | `/countries/:id` | Obtener país por ID |
| PATCH | `/countries/:id` | Actualizar un país |
| DELETE | `/countries/:id` | Eliminar un país |

### Firebase Testing API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/firebase/test` | Probar conexión con Firebase |
| GET | `/firebase/collections/:collection` | Ver documentos de una colección |
| POST | `/firebase/seed/countries` | Crear países de ejemplo |

## 📊 Ejemplos de Uso

### Crear un país

```bash
POST /countries
Content-Type: application/json

{
  "name": "Chile",
  "code": "CL",
  "capital": "Santiago",
  "region": "South America",
  "population": 19116201,
  "area": 756096,
  "languages": ["Spanish"],
  "currencies": ["CLP"]
}
```

### Buscar países por región

```bash
GET /countries?region=South America
```

### Probar conexión con Firebase

```bash
GET /firebase/test
```

## 🛠️ Servicio FirestoreService

El `FirestoreService` proporciona métodos genéricos para trabajar con cualquier colección:

```typescript
// Crear documento
await this.firestoreService.create('collection', data, optionalId);

// Obtener todos los documentos
await this.firestoreService.findAll('collection');

// Obtener con filtros
await this.firestoreService.findAll('collection', [
  { field: 'region', operator: '==', value: 'South America' }
]);

// Obtener por ID
await this.firestoreService.findOne('collection', id);

// Actualizar
await this.firestoreService.update('collection', id, updateData);

// Eliminar
await this.firestoreService.remove('collection', id);

// Consulta personalizada
await this.firestoreService.query('collection', query => 
  query.where('field', '==', 'value').orderBy('name')
);
```

## 🔧 Características Implementadas

### ✅ Funciones Automáticas
- **Timestamps automáticos**: `createdAt` y `updatedAt`
- **Validación de DTOs** con class-validator
- **Manejo de errores** robusto
- **Tipado fuerte** con TypeScript

### ✅ Funciones Avanzadas
- **Filtros dinámicos** en consultas
- **Transacciones** para operaciones complejas
- **Consultas personalizadas** con query builder
- **Inyección global** del módulo Firebase

## 🌍 Estructura de Datos

### Documento Country en Firestore

```json
{
  "id": "documento-id-generado",
  "name": "Chile",
  "code": "CL",
  "capital": "Santiago",
  "region": "South America",
  "subregion": "South America",
  "population": 19116201,
  "area": 756096,
  "languages": ["Spanish"],
  "currencies": ["CLP"],
  "timezone": "UTC-3",
  "createdAt": "2025-01-06T10:30:00.000Z",
  "updatedAt": "2025-01-06T10:30:00.000Z"
}
```

## 🔒 Seguridad

### Variables de entorno seguras
- Todas las credenciales están en `.env`
- El archivo `.env` está en `.gitignore`
- Usa variables de entorno del sistema en producción

### Validación de datos
- DTOs con class-validator
- Sanitización automática
- Manejo de errores consistente

## 📈 Ventajas de Firebase + NestJS

| Característica | Benefit |
|---------------|---------|
| **Escalabilidad** | Auto-scaling de Firebase |
| **Tiempo real** | Listeners en tiempo real |
| **Offline** | Soporte offline nativo |
| **Seguridad** | Reglas de seguridad Firebase |
| **Performance** | CDN global de Firebase |
| **Costo** | Pay-as-you-go pricing |

## 🚀 Comandos para Probar

```bash
# Iniciar aplicación
npm run start:dev

# Probar conexión Firebase
curl http://localhost:4000/firebase/test

# Crear datos de ejemplo
curl -X POST http://localhost:4000/firebase/seed/countries

# Ver países creados
curl http://localhost:4000/countries

# Filtrar por región
curl "http://localhost:4000/countries?region=South%20America"
```

## 🎯 Próximos Pasos

1. **Configurar reglas de seguridad** en Firebase Console
2. **Implementar autenticación** con Firebase Auth
3. **Agregar índices compuestos** para consultas complejas
4. **Configurar backup automático** de Firestore
5. **Implementar cache** con Redis para mejor performance

## 🐛 Troubleshooting

### Error: "Firebase app already initialized"
- Reinicia la aplicación
- Verifica que no hay múltiples inicializaciones

### Error de credenciales
- Verifica que las variables de entorno están correctas
- Asegúrate de que el service account tiene permisos

### Error de conexión
- Verifica que Firestore está habilitado
- Comprueba las reglas de seguridad de Firestore

¡Firebase está completamente configurado y listo para usar! 🎉

# La Cuponera (React + Vite)

Proyecto de la cátedra: cuponera con Firebase (Auth, Firestore) y despliegue en Firebase Hosting.

**URL pública (Hosting):** sustituir tras cada despliegue con la URL que muestre la consola de Firebase, por ejemplo `https://cuponera-esen.web.app` (proyecto `cuponera-esen`).

## Requisitos del equipo

- Node.js LTS
- Cuenta con acceso al proyecto Firebase **cuponera-esen** (consola o rol en GCP)
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools` y luego `firebase login`

## Desarrollo local

```bash
npm install
npm run dev
```

La configuración del SDK web está en `src/firebase/config.js` (proyecto compartido).

## Roles y colección `perfiles`

- El rol de cada usuario vive en Firestore: **`perfiles/{uid}`** (mismo `uid` que en Authentication).
- El registro en la app crea `clientes/{uid}` y `perfiles/{uid}` con `role: "cliente"`.
- Los administradores gestionan roles en **Administración → pestaña Roles** (requiere un primer admin creado manualmente en Firestore o por consola).
- Para generar `perfiles` a partir de usuarios que solo existen en Auth (una sola vez o cuando haga falta), quien tenga la **clave JSON de cuenta de servicio** puede ejecutar en su máquina (sin subir ese archivo a Git):

```bash
npm run sync:auth-perfiles
```

(Ver comentarios al inicio de `scripts/syncAuthToPerfiles.mjs` para la variable de entorno o el argumento con la ruta al JSON.)

**Nunca** subas al repositorio archivos `*-firebase-adminsdk-*.json` ni pegues claves en chats.

## Despliegue (hosting + reglas Firestore)

Desde la raíz del repo, con el proyecto enlazado (`firebase use` o `.firebaserc` ya apunta a `cuponera-esen`):

```bash
npm run deploy
```

Esto ejecuta el `predeploy` de hosting (`npm run build`), sube la carpeta `dist` y publica `firestore.rules`.

Solo hosting: `npm run deploy:hosting`. Solo reglas: `npm run deploy:rules`. Solo funciones: `firebase deploy --only functions` (requiere plan Blaze en el proyecto Firebase).

### Cloud Functions (canje y correo)

En la carpeta `functions/` están las funciones **`canjearCupon`** (HTTPS callable: valida rol empleado, empresa, DUI frente al cupón y marca el canje) y **`encolarCorreoTrasCompra`** (disparador al crear un documento en `cupones`, encola un documento en la colección **`mail`**).

1. `cd functions && npm install`
2. `firebase deploy --only functions` (o el script `npm run deploy` en la raíz, que incluye `functions`).

Sin funciones desplegadas, el canje desde la app mostrará un error claro: el cliente ya no actualiza cupones directamente desde el navegador.

### Correo post-compra (extensión recomendada)

La función escribe documentos en **`mail`** con campos `to` y `message.subject` / `message.text`, compatibles con la extensión oficial [Trigger Email from Firestore](https://firebase.google.com/docs/extensions/official/firestore-send-email). Instalala la extensión en la consola de Firebase y configura el proveedor SMTP o el servicio de correo que indique el asistente de la extensión. **No subas** API keys ni credenciales al repositorio; configúralas solo en Firebase (parámetros de la extensión o secretos gestionados).

Variables típicas (según proveedor): las define la propia extensión en la instalación; no hace falta duplicarlas en un `.env` del front.

## Guion rápido para demo oral (cotejo)

1. **Admin La Cuponera:** iniciar sesión, pestaña Rubros (crear rubro), Empresas (CRUD con código AAA000 y comisión), Roles si aplica, aprobar ofertas en Explorar.
2. **Admin empresa:** Mis ofertas (rubro desde catálogo, crear oferta pendiente), gestión de empleados (UID de prueba con cuenta en Auth), reenvío/descarte si hay rechazo.
3. **Cliente:** registro con DUI, comprar cupón (código AAA000+7 dígitos), Mis cupones.
4. **Empleado:** Canjear con código + DUI del comprador.
5. **Contraseña:** “¿Olvidaste tu contraseña?” y, con sesión iniciada, Cambiar contraseña desde el menú (cuenta email/contraseña).

## Plantilla Vite (referencia)

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) — React Refresh con Babel
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) — React Refresh con SWC

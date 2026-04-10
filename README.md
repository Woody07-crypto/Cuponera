# La Cuponera (React + Vite)

Proyecto de la cátedra: cuponera con Firebase (Auth, Firestore) y despliegue en Firebase Hosting.

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

Solo hosting: `npm run deploy:hosting`. Solo reglas: `npm run deploy:rules`.

## Plantilla Vite (referencia)

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) — React Refresh con Babel
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) — React Refresh con SWC

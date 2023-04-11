// TRUE:  VALIDA EL TOKEN EN EL KEYCLOAK
// FALSE: CARGA TODO CON UN TOKEN QUEMADO 
export const ONLINE = false;

// URL AMBIENTE DESARROLLO
export const AMBIENTE_DOMAIN_URL = ONLINE ? 'https://portal.jardinazuayo.fin.ec/' : 'http://localhost:8343/';
export const API_PORTAL = ONLINE ? 'https://portal.jardinazuayo.fin.ec/' : 'http://localhost:8080/';
export const KEY_URL = 'https://portalbal.jardinazuayo.fin.ec/auth';

// ESTILO DE LOS CUADROS DE TEXTO
// outlined: CUADRO DE TEXTO
// standard: LINEA
export const TIPO_INPUT = "outlined";

// CONTEXTOS APP
export const API_URL = ONLINE ? `${AMBIENTE_DOMAIN_URL}grc-api-ws/` : `${AMBIENTE_DOMAIN_URL}`;
export const HOME_APP = '/grc-app/admin/home';
export const API_URL_SEGURIDADES =  `${API_PORTAL}web-seguridades-api-ws/`;
export const API_URL_TURNOS = `${AMBIENTE_DOMAIN_URL}`;

export const parameters = {
    cipherKey: "4756112463587241",
    cipherIV: "1112131415161718",
    keyAPILocations:
        "eyJzdWIiOiJKYXJkaW5BenVheW8iLCJuYW1lIjoiSkFQQUdPUyIsImlhdCI6MTUxNjIzOTAyMn0",
    tamanioClave: 4
};


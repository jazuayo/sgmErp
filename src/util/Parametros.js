import {AMBIENTE_DOMAIN_URL, KEY_URL, API_URL, API_URL_SEGURIDADES, API_URL_TURNOS} from './common/const.js';

const endpoints = {
  // turnoVirtual: "http://localhost:8595",
  // sgmErpRS: "http://erp.consuldig.com:8595",
  sgmErpRS: "http://localhost:8595",

  /* URL - REDIRECCION  * */
  loginKey: `${KEY_URL}`,
  portal: `${AMBIENTE_DOMAIN_URL}portal`,
  homeTransaccional: `${AMBIENTE_DOMAIN_URL}portal/pages/private/seguridad/home-transaccional.xhtml`,
};

export const prmToken = {
  username: "marco",
  password: "paredes",
};

export const prmApp = {
  timeoutValida: 2000,
};

export default endpoints;

import endpoints from "./Parametros";

/**
 * Descargar archivos desde back solo con URL -- Back metodo get
 * @param {*} valorPath
 * @param {*} nombreArchivo
 */
export const descargarArchivo = (valorPath, nombreArchivo, setCargando) => {
  let url = endpoints.sgmErpRS + valorPath;
  console.log("Archivo Descarga desde:", url);
  setCargando(true);
  fetch(url).then((response) => {
    setCargando(false);
    archivoResponseURL(response, nombreArchivo);
  });
};

/**
 * Descargar archivos desde back con requestBody/registro -- Back metodo post
 * @param {*} valorPath
 * @param {*} nombreArchivo
 * @param {*} datosRegistro
 */
export const descargarArchivoRegistro = (
  valorPath,
  nombreArchivo,
  datosRegistro,
  setCargando
) => {
  let url = endpoints.sgmErpRS + valorPath;
  console.log("Archivo Descarga:", url, JSON.stringify(datosRegistro));
  setCargando(true);
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosRegistro),
  }).then((response) => {
    setCargando(false);
    archivoResponseURL(response, nombreArchivo);
  });
};

/**
 * Validar response para descargar archivo
 * @param {*} response
 * @param {*} nombreArchivo
 */
function archivoResponseURL(response, nombreArchivo) {
  response.blob().then((blob) => {
    if (blob.type === "application/json") {
      alert("Error al descargar archivo");
    } else {
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      a.click();
    }
  });
}

const mapeoErrores = [
  {
    message: "FAILED TO FETCH",
    presenta: "Error en la conexión de red",
  },
];

const mensajeError = (error) => {
  var v_error = "error no procesado";
  if (error.message) {
    v_error = error.message;
    mapeoErrores.forEach((mapeo) => {
      if (error.message.toUpperCase().indexOf(mapeo["message"]) >= 0) {
        v_error = mapeo["presenta"];
      }
    });
  }
  return v_error;
};

export default async function ClientJSON(url, body = null, method = "POST", header = { Accept: "application/json", "Content-Type": "application/json"}) {
  try {
    const requestHeaders = header;

    const token = localStorage.getItem("token");
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    var requestBody = null;
    if (body) {
      //requestBody = JSON.stringify(body);
      requestBody = body;
    }
    console.log("ClientJSON REQ:", method, url, requestBody);

    const requestOptions = {
      method: method,
      headers: requestHeaders,
      body: requestBody,
    };

    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const responseData = await response.json();
      console.log("ClientJSON OK:", url, response.status, responseData);
      return { datos: responseData };
    } else {
      console.log("ClientJSON ERR:", url, response.status, response);
      var v_respuesta = response;
      if (response.status === 401) {
        v_respuesta = "error con la sesion";
        if (url.indexOf("/login") < 0) {
          console.log("recarga pagina");
          window.location.reload();
        }
      }
      if (response.status === 404) {
        v_respuesta = "recurso no encontrado";
      }
      if (response.status === 400 || response.status === 403) {
        v_respuesta = "Error en la conexión";
      }
      return { error: v_respuesta };
    }
  } catch (error) {
    console.log("ClientJSON CATCH:", url, error);
    return { error: mensajeError(error) };
  }
}



import React, { createContext, useState, useEffect } from "react";
import ClientJSON from "../util/ClientJSON";
import endpoints, { prmToken } from "../util/Parametros";

export const AppContext = createContext();

const AppProvider = (props) => {
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({
    tipo: "success",
    texto: "",
  });

  const mensajeInfo = (mensaje) => {
    setMensaje({
      ...mensaje,
      tipo: "success",
      texto: mensaje,
    });
  };

  const mensajeError = (mensaje) => {
    setMensaje({
      ...mensaje,
      tipo: "error",
      texto: mensaje,
    });
  };

  const recuperaToken = () => {
    (async () => {
      const parametros = {
        username: prmToken.username,
        password: prmToken.password,
      };
      var respuesta = await ClientJSON(
        endpoints.turnoVirtual + "/login",
        parametros,
        "POST"
      );
      if (!respuesta.error) {
        localStorage.setItem("token", respuesta.datos.token);
      } else {
        mensajeError(respuesta.error);
        localStorage.setItem("token", "Err:" + respuesta.error);
      }
    })();
  };
  /*
  useEffect(() => {
    const delayFn = setTimeout(() => {
      setMensaje({
        ...mensaje,
        tipo: "error",
        texto: "",
      });
    }, 4000);
    return () => clearTimeout(delayFn);
  }, [mensaje]);
*/
  useEffect(() => {
    //recuperaToken();
  }, []);

  return (
    <AppContext.Provider
      value={{
        cargando,
        setCargando,
        mensaje,
        mensajeInfo,
        mensajeError,
        dialogoEliminar,
        setDialogoEliminar,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;

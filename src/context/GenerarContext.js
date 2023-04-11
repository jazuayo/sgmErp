import React, { createContext, useContext, useEffect, useState } from "react";
import ClientJSON from "../util/ClientJSON";
import endpoints from "../util/Parametros";
import { AppContext } from "./AppContext";

export const GenerarContext = createContext();

const recuperaRetencionDetPorRetencion = (
  retencionId,
  registroDependiente,
  setRegistroDependiente,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS +
        "/retencionDetalle/recuperaPorRetencion/" +
        retencionId,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setRegistroDependiente({
        ...registroDependiente,
        retencionDetalleId: null,
        impuestoCod: "",
        impuestoDes: "",
        baseImponible: 0,
        valorRetenido: 0,
        detalles: respuesta.datos,
      });
    } else {
      mensajeError(
        "Error al recuperar los detalle de las retenciones por el id de la retencion."
      );
    }
  })();
};

const recuperaEstados = (setEstados, mensajeError, setCargando) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/estado",
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setEstados(respuesta.datos);
    } else {
      mensajeError("Error al recuperar los estados.");
    }
  })();
};

const recuperaOrigenes = (setOrigenes, mensajeError, setCargando) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/origen",
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setOrigenes(respuesta.datos);
    } else {
      mensajeError("Error al recuperar los origenes.");
    }
  })();
};

const recuperaCategoriasOrg = (
  organizacionCod,
  setCategorias,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/categoriaOrganizacion/" + organizacionCod,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setCategorias(respuesta.datos);
    } else {
      mensajeError("Error al recuperar las categorías por organizacion.");
    }
  })();
};

const recuperaCuentasPorOrganizacion = (
  setCuentas,
  organizacionCod,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/planCuenta/organizacion/" + organizacionCod,
      null,
      "POST"
    );
    setCargando(false);
    if (!respuesta.error) {
      setCuentas(respuesta.datos);
    } else {
      mensajeError("Error al recuperar los planes de cuenta por organizacion.");
    }
  })();
};

const recuperaDocumentosPorOrg = (
  setDocumentos,
  organizacionCod,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/documento/organizacion/" + organizacionCod,
      null,
      "POST"
    );
    if (!respuesta.error) {
      setDocumentos(respuesta.datos);
    } else {
      mensajeError("Error al recuperar los documentos por organizacion.");
    }
    setCargando(false);
  })();
};
const recuperaTiposPlanCuentas = (
  setTiposPlanCuentas,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/planCuentaTipo",
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setTiposPlanCuentas(respuesta.datos);
    } else {
      mensajeError("Error al recuperar los tipos planes de cuentas.");
    }
  })();
};

const recuperaDocPorOrgOrigen = (
  organizacionCod,
  origenCod,
  setDocumentos,
  mensajeError,
  setCargando
) => {
  let datos = {
    organizacionCod: organizacionCod,
    origenCod: origenCod,
  };
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/documento/buscarPorOrganizacionOrigen",
      JSON.stringify(datos),
      "POST"
    );
    setCargando(false);
    if (!respuesta.error) {
      setDocumentos(respuesta.datos);
    } else {
      mensajeError(
        "Error al recuperar los documentos por organización y origen."
      );
    }
  })();
};

const recuperaInventarioPorItem = (
  itemId,
  setItemInventario,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/itemInventario/" + itemId,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setItemInventario(respuesta.datos);
    } else {
      mensajeError("Error al recuperar datos del inventario por item.");
    }
  })();
};

const recuperarImpuestoTipo = (setImpuestoTipo, mensajeError, setCargando) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/impuestoTipo",
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setImpuestoTipo(respuesta.datos);
    } else {
      mensajeError("Error al recuperar tipo de impuestos.");
    }
  })();
};
const recuperarImpuestoConCategoriaPorOrg = (
  codigoOrganizacion,
  setImpuesto,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/impuesto/" + codigoOrganizacion,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setImpuesto(respuesta.datos);
    } else {
      mensajeError(
        "Error al recuperar impuestos con categorias por organizacion."
      );
    }
  })();
};
const recuperarImpuesto = (setImpuesto, mensajeError, setCargando) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/impuesto",
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setImpuesto(respuesta.datos);
    } else {
      mensajeError("Error al recuperar impuestos.");
    }
  })();
};

const recuperarPersonas = (
  tipo,
  codigoOrganizacion,
  setPersonas,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/persona/" + tipo + "/" + codigoOrganizacion,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setPersonas(respuesta.datos);
    } else {
      mensajeError("Error al recuperar personas.");
    }
  })();
};
const recuperarPersonasTipo = (setTipoPersonas, mensajeError, setCargando) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/personaTipo",
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setTipoPersonas(respuesta.datos);
    } else {
      mensajeError("Error al recuperar el tipo de personas.");
    }
  })();
};

const recuperarGrupoItems = (
  codigoOrganizacion,
  setGrupoItems,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/grupoItems/" + codigoOrganizacion,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setGrupoItems(respuesta.datos);
    } else {
      mensajeError("Error al recuperar los grupo de items.");
    }
  })();
};
const recuperarItems = (
  organizacionCod,
  setItems,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/item/" + organizacionCod,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setItems(respuesta.datos);
    } else {
      mensajeError("Error al recuperar items.");
    }
  })();
};

const recuperarFormasDePagoPorOrganizacion = (
  organizacionCod,
  setFormasPago,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/formaPago/" + organizacionCod,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setFormasPago(respuesta.datos);
    } else {
      mensajeError("Error al recuperar formas de pago.");
    }
  })();
};

const recuperarFormasDePagoPorOrganizacionYCategoria = (
  organizacionCod,
  categoriaCod,
  setFormasPago,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS +
        "/formaPago/categoria/" +
        organizacionCod +
        "/" +
        categoriaCod,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setFormasPago(respuesta.datos);
    } else {
      mensajeError("Error al recuperar formas de pago.");
    }
  })();
};

const recuperaDocumentoTipo = (
  setDocumentoTipos,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/documentoTipo",
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setDocumentoTipos(respuesta.datos);
    } else {
      mensajeError("Error al recuperar los tipos de documentos.");
    }
  })();
};
const recuperarLugares = (setLugares, mensajeError, setCargando) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/lugar",
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      /*
      Del JSON de respuesta tomar solo los de nivel 3
      de esta manera tomo solo la respuesta de 2 niveles
      Canton -> Provincia.... si  no hay ese nivle no se toma en cuenta
       */
      const objetoLugares = {};
      respuesta.datos.map((item) => {
        if (item.lugar != null) {
          if (item.lugar.lugar != null) {
            if (!objetoLugares.hasOwnProperty(item.lugar.nombre)) {
              objetoLugares[item.lugar.nombre] = {
                cantones: [],
              };
            }
            objetoLugares[item.lugar.nombre].cantones.push({
              lugarId: item.lugarId,
              nombre: item.nombre,
            });
          }
        }
      });
      setLugares(objetoLugares);
    } else {
      mensajeError("Error al recuperar lugares.");
    }
  })();
};
const recuperarItemGrupoTipos = (
  setItemGrupoTipo,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/itemGrupoTipo",
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setItemGrupoTipo(respuesta.datos);
    } else {
      mensajeError("Error al recuperar los tipos de item grupo.");
    }
  })();
};
const recuperaImpuestosPorTipo = (
  impuestoTipoCod,
  setImpuesto,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/impuesto/impuestoTipo/" + impuestoTipoCod,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setImpuesto(respuesta.datos);
    } else {
      mensajeError("Error al recuperar los impuestos por el tipo.");
    }
  })();
};
const recuperarItemGrupoTiposPorOrganizacion = (
  organizacionCod,
  setItemGrupoTipo,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/itemGrupoTipo/" + organizacionCod,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setItemGrupoTipo(respuesta.datos);
    } else {
      mensajeError(
        "Error al recuperar los tipos de item grupo por organizacion."
      );
    }
  })();
};
const recuperarPrecioCalculaPorOrganizacion = (
  organizacionCod,
  setParametroPrecioCalcula,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS + "/parametro/precio/" + organizacionCod,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setParametroPrecioCalcula(respuesta.datos);
    } else {
      mensajeError(
        "Error al recuperar los parametros para claculos de precio."
      );
    }
  })();
};
const recuperarPlanDeCuentasPorOrganizacion = (
  tipo,
  codigoOrganizacion,
  setCuentas,
  mensajeError,
  setCargando
) => {
  setCargando(true);
  (async () => {
    var respuesta = await ClientJSON(
      endpoints.sgmErpRS +
        "/planCuenta/" +
        tipo +
        "/organizacion/" +
        codigoOrganizacion,
      null,
      "GET"
    );
    setCargando(false);
    if (!respuesta.error) {
      setCuentas(respuesta.datos);
    } else {
      mensajeError("Error al recuperar plan de cuentas por organizacion.");
    }
  })();
};

const GenerarProvider = (props) => {
  const { mensajeError, setCargando } = useContext(AppContext);

  const [documentoTipos, setDocumentoTipos] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasPorItems, setCategoriasPorItems] = useState([]);
  const [items, setItems] = useState([]);
  const [tipoPersonas, setTipoPersonas] = useState([]);
  const [stepActivo, setStepActivo] = useState(0);
  const [documentos, setDocumentos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [comprobantes, setComprobantes] = useState([]);
  const [tiposPlanCuentas, setTiposPlanCuentas] = useState([]);

  const [estados, setEstados] = useState([]);
  const [origenes, setOrigenes] = useState([]);
  const [registro, setRegistro] = useState({});
  const [registroDependiente, setRegistroDependiente] = useState({});
  const [impuestoTipo, setImpuestoTipo] = useState([]);
  const [impuesto, setImpuesto] = useState([]);
  const [categoriasPorImpuesto, setCategoriasPorImpuesto] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [grupoItems, setGrupoItems] = useState([]);
  const [grupoItemsImpuesto, setGrupoItemsImpuesto] = useState([]);
  const [itemInventario, setItemInventario] = useState([]);
  const [lugares, setLugares] = useState({});
  const [cantones, setCantones] = useState([]);
  const [itemGrupoTipo, setItemGrupoTipo] = useState({});
  const [parametroPrecioCalcula, setParametroPrecioCalcula] = useState([]);

  const listarPlanDeCuentas = (codigoOrganizacion, tipo) => {
    recuperarPlanDeCuentasPorOrganizacion(
      tipo,
      codigoOrganizacion,
      setCuentas,
      mensajeError,
      setCargando
    );
  };
  const listarPrecioCalculaPorOrganizacion = (organizacionCod) => {
    recuperarPrecioCalculaPorOrganizacion(
      organizacionCod,
      setParametroPrecioCalcula,
      mensajeError,
      setCargando
    );
  };
  const listarItemGrupoTiposPorOrganizacion = (organizacionCod) => {
    recuperarItemGrupoTiposPorOrganizacion(
      organizacionCod,
      setItemGrupoTipo,
      mensajeError,
      setCargando
    );
  };
  const listarImpuestosPorTipo = (impuestoTipoCod) => {
    recuperaImpuestosPorTipo(
      impuestoTipoCod,
      setImpuesto,
      mensajeError,
      setCargando
    );
  };
  const listarItemGrupoTipos = () => {
    recuperarItemGrupoTipos(setItemGrupoTipo, mensajeError, setCargando);
  };
  const listarLugares = () => {
    recuperarLugares(setLugares, mensajeError, setCargando);
  };
  const listaDocumentosTipos = () => {
    recuperaDocumentoTipo(setDocumentoTipos, mensajeError, setCargando);
  };
  const listarFormasPagoPorOrganizacionYCategoria = (
    organizacionCod,
    categoriaCod
  ) => {
    recuperarFormasDePagoPorOrganizacionYCategoria(
      organizacionCod,
      categoriaCod,
      setFormasPago,
      mensajeError,
      setCargando
    );
  };
  const listaFormasPagoPorOrganizacion = (organizacionCod) => {
    recuperarFormasDePagoPorOrganizacion(
      organizacionCod,
      setFormasPago,
      mensajeError,
      setCargando
    );
  };

  const listaInventarioPorItem = (itemId) => {
    recuperaInventarioPorItem(
      itemId,
      setItemInventario,
      mensajeError,
      setCargando
    );
  };

  const listaItems = (organizacionCod) => {
    recuperarItems(organizacionCod, setItems, mensajeError, setCargando);
  };
  const listaGrupoItems = (codigoOrganizacion) => {
    recuperarGrupoItems(
      codigoOrganizacion,
      setGrupoItems,
      mensajeError,
      setCargando
    );
  };
  const listaTipoPersona = () => {
    recuperarPersonasTipo(setTipoPersonas, mensajeError, setCargando);
  };
  const listaPersonas = (codigoOrganizacion, tipo) => {
    recuperarPersonas(
      tipo,
      codigoOrganizacion,
      setPersonas,
      mensajeError,
      setCargando
    );
  };
  const listaImpuestosConCategoriaPorOrg = (codigoOrganizacion) => {
    recuperarImpuestoConCategoriaPorOrg(
      codigoOrganizacion,
      setImpuesto,
      mensajeError,
      setCargando
    );
  };

  const listaImpuestos = () => {
    recuperarImpuesto(setImpuesto, mensajeError, setCargando);
  };
  const listaImpuestosTipo = () => {
    recuperarImpuestoTipo(setImpuestoTipo, mensajeError, setCargando);
  };

  const listaCuentasPorOrganizacion = (organizacionCod) => {
    recuperaCuentasPorOrganizacion(
      setCuentas,
      organizacionCod,
      mensajeError,
      setCargando
    );
  };

  const listaDocumentosPorOrg = (organizacionCod) => {
    recuperaDocumentosPorOrg(
      setDocumentos,
      organizacionCod,
      mensajeError,
      setCargando
    );
  };
  const listaRetencionesDetPorRetencion = (retencionId) => {
    recuperaRetencionDetPorRetencion(
      retencionId,
      registroDependiente,
      setRegistroDependiente,
      mensajeError,
      setCargando
    );
  };

  const listaTiposPlanCuentas = () => {
    recuperaTiposPlanCuentas(setTiposPlanCuentas, mensajeError, setCargando);
  };

  const listaDocPorOrgOrigen = (organizacionCod, origenCod) => {
    recuperaDocPorOrgOrigen(
      organizacionCod,
      origenCod,
      setDocumentos,
      mensajeError,
      setCargando
    );
  };

  const listaEstados = () => {
    recuperaEstados(setEstados, mensajeError, setCargando);
  };

  const listaOrigenes = () => {
    recuperaOrigenes(setOrigenes, mensajeError, setCargando);
  };

  const listaCategoriasOrg = (organizacionCod) => {
    recuperaCategoriasOrg(
      organizacionCod,
      setCategorias,
      mensajeError,
      setCargando
    );
  };

  useEffect(() => {
    const recuperaLS = () => {
      const registroLS = localStorage.getItem("registro");
      if (registroLS) {
        setRegistro(JSON.parse(registroLS));
      }
    };
    recuperaLS();
  }, []);

  useEffect(() => {
    localStorage.setItem("registro", JSON.stringify(registro));
  }, [registro]);

  return (
    <GenerarContext.Provider
      value={{
        listarImpuestosPorTipo,
        listarItemGrupoTipos,
        itemGrupoTipo,
        cantones,
        setCantones,
        listarLugares,
        setLugares,
        lugares,
        listarFormasPagoPorOrganizacionYCategoria,
        listaDocumentosTipos,
        documentoTipos,
        setDocumentoTipos,
        listaFormasPagoPorOrganizacion,
        setFormasPago,
        formasPago,
        setFacturas,
        facturas,
        listaItems,
        items,
        grupoItemsImpuesto,
        setGrupoItemsImpuesto,
        listaGrupoItems,
        grupoItems,
        listaTipoPersona,
        tipoPersonas,
        listaPersonas,
        personas,
        setPersonas,
        listaImpuestosTipo,
        impuestoTipo,
        listaImpuestos,
        setImpuesto,
        impuesto,
        setStepActivo,
        stepActivo,
        listaCategoriasOrg,
        categorias,
        setRegistro,
        registro,
        setRegistroDependiente, // Procesar registro que requiere datos del registro principal
        registroDependiente,
        documentos,
        listaEstados,
        estados,
        listaOrigenes,
        origenes,
        cuentas,
        listaTiposPlanCuentas,
        tiposPlanCuentas,
        setComprobantes,
        comprobantes,
        listaDocPorOrgOrigen,
        listaCuentasPorOrganizacion,
        listaRetencionesDetPorRetencion,
        listaInventarioPorItem,
        itemInventario,
        setItemInventario,
        listaDocumentosPorOrg,
        listarItemGrupoTiposPorOrganizacion,
        listarPrecioCalculaPorOrganizacion,
        setParametroPrecioCalcula,
        parametroPrecioCalcula,
        listarPlanDeCuentas,
        listaImpuestosConCategoriaPorOrg,
      }}
    >
      {props.children}
    </GenerarContext.Provider>
  );
};

export default GenerarProvider;

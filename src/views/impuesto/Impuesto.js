import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import ImpuestoPage from "./ImpuestoPage";

export default function Impuesto(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <ImpuestoPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

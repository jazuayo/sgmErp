import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import CuentaPage from "./CuentaPage";

export default function Cuenta(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <CuentaPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

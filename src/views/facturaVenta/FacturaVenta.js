import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import FacturaVentaPage from "./FacturaVentaPage";

export default function FacturaVenta(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <FacturaVentaPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

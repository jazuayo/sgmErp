import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import FacturaCompraPage from "./FacturaCompraPage";

export default function FacturaCompra(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <FacturaCompraPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

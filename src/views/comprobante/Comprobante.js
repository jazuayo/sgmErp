import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import ComprobantePage from "./ComprobantePage";

export default function Comprobante(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <ComprobantePage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

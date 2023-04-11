import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import NotaCreditoPage from "./NotaCreditoPage";

export default function NotaCredito(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <NotaCreditoPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

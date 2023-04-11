import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import ClaveFirmaPage from "./ClaveFirmaPage";

export default function ClaveFirma(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <ClaveFirmaPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

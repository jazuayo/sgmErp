import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import DocumentoPage from "./DocumentoPage";

export default function Documento(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <DocumentoPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

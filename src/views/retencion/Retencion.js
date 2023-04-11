import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import RetencionPage from "./RetencionPage";

export default function Retencion(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <RetencionPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

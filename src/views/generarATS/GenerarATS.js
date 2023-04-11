import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import GenerarATSPage from "./GenerarATSPage";

export default function GenerarATS(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <GenerarATSPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import ReportesFacPage from "./ReportesFacPage";

export default function ReportesFac(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <ReportesFacPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

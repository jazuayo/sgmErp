import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import ReportePage from "./ReportePage";

export default function Reporte(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <ReportePage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

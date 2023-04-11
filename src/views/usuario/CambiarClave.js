import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import CambiarClavePage from "./CambiarClavePage";

export default function CambiarClave(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <CambiarClavePage
          accionesPantalla={props.parameters.acciones}
        ></CambiarClavePage>
      </GenerarProvider>
    </AppProvider>
  );
}

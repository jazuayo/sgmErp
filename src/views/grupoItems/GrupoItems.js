import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import GrupoItemsPage from "./GrupoItemsPage";

export default function GrupoItems(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <GrupoItemsPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

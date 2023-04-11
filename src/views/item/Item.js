import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import ItemPage from "./ItemPage";

export default function Item(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <ItemPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

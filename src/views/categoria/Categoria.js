import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import CategoriaPage from "./CategoriaPage";
export default function Categoria(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <CategoriaPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

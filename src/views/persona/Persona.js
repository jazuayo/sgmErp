import GenerarProvider from "../../context/GenerarContext";
import AppProvider from "../../context/AppContext";
import PersonaPage from "./PersonaPage";

export default function Persona(props) {
  return (
    <AppProvider>
      <GenerarProvider>
        <PersonaPage accionesPantalla={props.parameters.acciones} />
      </GenerarProvider>
    </AppProvider>
  );
}

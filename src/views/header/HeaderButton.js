/*eslint-disable*/
import IconButton from "@material-ui/core/IconButton";
// @material-ui/core components
import Tooltip from "@material-ui/core/Tooltip";
// core components
import {
  AddIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  DeleteIcon,
  DoneIcon,
  SaveIcon,
  SearchIcon,
  ArrowDownwardIcon,
  AutorenewRoundedIcon,
  QueueRoundedIcon,
  UpdateIcon,
  RemoveCircleOutlineIcon,
  AddTaskIcon,
  PictureAsPdfIcon,
  CancelPresentationIcon,
  CurrencyExchangeIcon,
  ReceiptIcon,
  FactCheckIcon,
  PrintIcon,
  AttachEmailIcon,
} from "../../components/Icons.js";

export default function HeaderButton(props) {
  const etiquetas = {
    nuevo: "Nuevo",
    save: "Guardar",
    borrar: "Borrar",
    buscar: "Buscar",
    /*next: "Siguiente",*/
    back: "Regresar",
    fin: "Finalizar",
    sinTurno: "Sin Turno",
    volverLlamar: "Volver Llamar",
    actualizar: "Actualizar",
    agregarItem: "Agregar item",
    eliminarItem: "Eliminar item",
  };

  const { children, onClick, disabled, label, icono, tipo, ...rest } = props;

  let etiqueta = etiquetas[tipo];
  etiqueta = etiqueta ? etiqueta : label;

  return (
    <Tooltip title={etiqueta}>
      <IconButton
        aria-label={etiqueta}
        style={{ color: "#FDFEFE" }}
        disabled={disabled}
        onClick={() => onClick()}
      >
        {icono}
        {"anular" === tipo && <CancelPresentationIcon />}
        {"removerItem" === tipo && <RemoveCircleOutlineIcon />}
        {"agregarItem" === tipo && <AddTaskIcon />}
        {"back" === tipo && <ArrowBackIcon />}
        {"borrar" === tipo && <DeleteIcon />}
        {"next" === tipo && <ArrowForwardIcon />}
        {"save" === tipo && <SaveIcon />}
        {"fin" === tipo && <DoneIcon />}
        {"nuevo" === tipo && <AddIcon />}
        {"buscar" === tipo && <SearchIcon />}
        {"descargar" === tipo && <ArrowDownwardIcon />}
        {"sinTurno" === tipo && <QueueRoundedIcon />}
        {"volverLlamar" === tipo && <AutorenewRoundedIcon />}
        {"actualizar" === tipo && <UpdateIcon />}
        {"pdf" === tipo && <PictureAsPdfIcon />}
        {"retencion" === tipo && <CurrencyExchangeIcon />}
        {"nota" === tipo && <ReceiptIcon />}
        {"procesar" === tipo && <FactCheckIcon />}
        {"imprimir" === tipo && <PrintIcon />}
        {"email" === tipo && <AttachEmailIcon />}
      </IconButton>
    </Tooltip>
  );
}

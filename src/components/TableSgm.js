import {
  createTheme,
  MuiThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React from "react";
import { localizationTable } from "../util/utils.js";
import AddIcon from "@material-ui/icons/AddAlarm";
class TableSgm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCount: 0,
    };
  }

  render() {
    //console.log(this.props.selectedRow);
    return (
      <div>
        <br />
        <MuiThemeProvider theme={theme}>
          <MaterialTable
            actions={this.props.actions}
            isLoading={this.props.isLoading}
            columns={this.props.columns}
            data={this.props.data}
            title={this.props.title}
            localization={localizationTable()}
            onRowClick={this.props.onRowClick}
            options={{
              selection: this.props.selection,
              paging:
                this.props.paging != null
                  ? this.props.paging
                  : this.props.data
                  ? this.props.data.length >= 10
                  : false,
              pageSize: this.props.pageSize ? this.props.pageSize : 10,
              exportButton:
                this.props.export != null ? this.props.export : false,
              search: this.props.search != null ? this.props.search : true,
              headerStyle: {
                backgroundColor: "#117A65",
                color: "#FFF",
              },
              grouping: this.props.grouping,
            }}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}

const theme = createTheme({
  overrides: {
    MuiPaper: {
      root: {
        boxShadow: "none !important",
      },
    },
    MuiTableRow: {
      root: {
        height: "inherit !important",
        backgroundColor: "#ffffff6b !important",
        "&:hover,&:focus": {
          backgroundColor: "#EBEDEF !important",
        },
        "&$selected": {
          backgroundColor: "#EBEDEF ",
        },
      },
    },
    MuiTableCell: {
      root: {
        padding: "10px",
      },
      body: {
        fontSize: "normal  !important",
      },
    },
    MuiListItem: {
      root: {
        disabled: {
          display: "none",
          "&:first-child": {
            display: "inherit",
            paddingBottom: 0,
          },
        },
      },
    },
  },
});

const TablaDatos = withStyles({ withTheme: true })(TableSgm);
export default TablaDatos;

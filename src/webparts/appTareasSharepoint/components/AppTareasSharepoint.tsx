import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export interface ITarea {
  Title: string;
  Codigo: string;
  Estado: string;
  Descripcion: string;
}

interface IAppTareasSharepointProps {
  tareaList: ITarea[];
}

const AppTareasSharepoint: React.FC<IAppTareasSharepointProps> = ({
  tareaList,
}) => {
  const columns = [
    {
      name: "Title",
      label: "Title",
    },
    {
      name: "Codigo",
      label: "Codigo",
    },
    {
      name: "Estado",
      label: "Estado",
    },
    {
      name: "Descripcion",
      label: "Descripcion",
    },
  ];

  const options: MUIDataTableOptions = {
    filter: true,
    selectableRows: "multiple",
    filterType: "dropdown",
    responsive: "vertical",
    rowsPerPage: 5,
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <MUIDataTable
        title={"Lista de Tareas"}
        data={tareaList}
        columns={columns}
        options={options}
      />
    </ThemeProvider>
  );
};

export default AppTareasSharepoint;

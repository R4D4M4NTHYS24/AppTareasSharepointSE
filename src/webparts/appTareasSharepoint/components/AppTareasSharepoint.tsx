import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export interface ITarea {
  id: number;
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
  const handleEdit = (taskId: number) => {
    // Lógica para editar la tarea con el ID "taskId"
  };

  const handleDelete = (taskId: number) => {
    // Lógica para eliminar la tarea con el ID "taskId"
  };

  const columns = [
    {
      name: "Title",
      label: "Title",
      options: {
        setCellProps: () => ({ style: { minWidth: "20%" } }),
      },
    },
    {
      name: "Codigo",
      label: "Codigo",
      options: {
        setCellProps: () => ({ style: { minWidth: "20%" } }),
      },
    },
    {
      name: "Estado",
      label: "Estado",
      options: {
        setCellProps: () => ({ style: { minWidth: "20%" } }),
      },
    },
    {
      name: "Descripcion",
      label: "Descripcion",
      options: {
        setCellProps: () => ({ style: { minWidth: "20%" } }),
      },
    },
    {
      name: "actions",
      label: "ACTIONS",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (_: any, tableMeta: any) => {
          const taskId = tareaList[tableMeta.rowIndex].id;
          return (
            <>
              <IconButton onClick={() => handleEdit(taskId)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(taskId)}>
                <DeleteIcon />
              </IconButton>
            </>
          );
        },
        setCellHeaderProps: () => ({ style: { textTransform: "uppercase" } }),
      },
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
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 style={{ marginRight: "16px" }}>Lista de Tareas</h2>
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: "white", color: "black" }}
            >
              Agregar+
            </Button>
          </div>
        }
        data={tareaList}
        columns={columns}
        options={options}
      />
    </ThemeProvider>
  );
};

export default AppTareasSharepoint;

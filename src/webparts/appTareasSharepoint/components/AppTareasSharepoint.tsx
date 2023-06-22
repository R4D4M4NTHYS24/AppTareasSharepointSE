import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { IAppTareasSharepointProps } from "./IAppTareasSharepointProps";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export interface ITarea {
  id: number;
  Title: string;
  Codigo: number;
  Estado: string;
  Descripcion: string;
}

const AppTareasSharepoint: React.FC<IAppTareasSharepointProps> = ({
  tareaList,
  handleDelete,
}) => {
  const handleEdit = (taskId: number): void => {
    // Lógica para editar la tarea con el ID "taskId"
  };

  const handleDeleteClick = async (
    codigo: number,
    rowIndex: number
  ): Promise<void> => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar la tarea?"
    );

    if (confirmDelete) {
      console.log("Elemento al que se dio clic:", tareaList[rowIndex]);
      await handleDelete(codigo);
    }
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
          const rowIndex = tableMeta.rowIndex;
          const tarea = tareaList[rowIndex];
          return (
            <>
              <IconButton onClick={() => handleEdit(tarea.id)}>
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDeleteClick(tarea.Codigo, rowIndex)}
              >
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
              Agregar Tarea
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

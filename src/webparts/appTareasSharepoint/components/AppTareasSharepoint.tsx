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
  Id: number;
  Title: string;
  Codigo: number;
  Estado: string;
  Descripcion: string;
}

const AppTareasSharepoint: React.FC<IAppTareasSharepointProps> = ({
  tareaList,
  handleDelete,
}) => {
  const handleEdit = (itemId: number): void => {
    // Lógica para editar la tarea con el ID "itemId"
  };

  const handleDeleteClick = async (rowIndex: number): Promise<void> => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar la tarea?"
    );

    if (confirmDelete) {
      const tarea = rowIndex;
      //console.log(tarea);
      await handleDelete(tarea);
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
              <IconButton onClick={() => handleEdit(tarea.Id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(rowIndex)}>
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

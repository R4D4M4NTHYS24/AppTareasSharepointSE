import * as React from "react";
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import AppTareasSharepoint, { ITarea } from "./components/AppTareasSharepoint";

export interface IAppTareasSharepointWebPartProps {
  description: string;
  title: string;
}

export default class AppTareasSharepointWebPart extends BaseClientSideWebPart<IAppTareasSharepointWebPartProps> {
  private rootElement: HTMLElement;

  public async render(): Promise<void> {
    this.renderComponent();
  }

  public onDispose(): void {
    ReactDom.unmountComponentAtNode(this.rootElement);
    this.rootElement.remove();
  }

  private async loadTareasData(): Promise<ITarea[]> {
    const response = await fetch(
      "https://secol.sharepoint.com/sites/AppTareasSharepoint/_api/web/lists/getbytitle('Tarea')/items?$select=Title,Codigo,Estado,Descripcion",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    const tareaList = data.value;

    return tareaList;
  }

  private async getRequestDigest(): Promise<string> {
    const apiUrl =
      "https://secol.sharepoint.com/sites/AppTareasSharepoint/_api/contextinfo";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=nometadata",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.FormDigestValue;
      } else {
        throw new Error("Error al obtener el token de solicitud");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async deleteTarea(codigo: number): Promise<void> {
    try {
      const digest = await this.getRequestDigest();
      const apiUrl = `https://secol.sharepoint.com/sites/AppTareasSharepoint/_api/web/lists/getbytitle('Tarea')/items?$filter=Codigo eq ${codigo}`;
      console.log(apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=nometadata",
        },
      });

      if (response.ok) {
        const data = await response.json();

        const itemId = data.value[0].Id;

        const deleteUrl = `https://secol.sharepoint.com/sites/AppTareasSharepoint/_api/web/lists/getbytitle('Tarea')/items(${itemId})`;

        const deleteResponse = await fetch(deleteUrl, {
          method: "POST",
          headers: {
            "X-RequestDigest": digest,
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE",
          },
        });

        if (deleteResponse.ok) {
          console.log("Tarea eliminada correctamente");
          await this.loadTareasData(); // Cargar datos actualizados
        } else {
          console.log("Error al eliminar la tarea");
        }
      } else {
        console.log("Error al obtener el elemento de la lista");
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async renderComponent(): Promise<void> {
    const tareaList = await this.loadTareasData();

    const handleDelete = async (codigo: number): Promise<void> => {
      await this.deleteTarea(codigo);
      await this.loadTareasData();
    };

    const element = React.createElement(AppTareasSharepoint, {
      tareaList: tareaList,
      handleDelete: handleDelete,
    });

    this.rootElement = document.createElement("div");
    this.domElement.appendChild(this.rootElement);
    ReactDom.render(element, this.rootElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Configuración de la web part",
          },
          groups: [
            {
              groupName: "Opciones",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Título",
                  placeholder: "Ingrese un título",
                }),
                // Agrega más campos de propiedad aquí según tus necesidades
              ],
            },
          ],
        },
      ],
    };
  }
}

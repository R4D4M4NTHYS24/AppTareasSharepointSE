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
  private tareaList: ITarea[]; // Declarar tareaList como propiedad de la clase

  public async render(): Promise<void> {
    await this.renderComponent();
  }

  public onDispose(): void {
    ReactDom.unmountComponentAtNode(this.rootElement);
    this.rootElement.remove();
  }

  private async loadTareasData(): Promise<void> {
    const response = await fetch(
      "https://secol.sharepoint.com/sites/AppTareasSharepoint/_api/web/lists/getbytitle('Tarea')/items",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();

    this.tareaList = data.value; // Asignar el valor a la propiedad tareaList
    //console.log(this.tareaList[1].Id);
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

  private async deleteTarea(itemId: number): Promise<void> {
    console.log(this.tareaList);
    const indexItem = this.tareaList[itemId].Id;
    console.log(indexItem);
    try {
      const digest = await this.getRequestDigest();
      const deleteUrl = `https://secol.sharepoint.com/sites/AppTareasSharepoint/_api/web/lists/getbytitle('Tarea')/items(${indexItem})`;

      const response = await fetch(deleteUrl, {
        method: "POST",
        headers: {
          "X-RequestDigest": digest,
          "IF-MATCH": "*",
          "X-HTTP-Method": "DELETE",
        },
      });

      if (response.ok) {
        console.log("Tarea eliminada correctamente");
      } else {
        console.log("Error al eliminar la tarea");
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async renderComponent(): Promise<void> {
    await this.loadTareasData();

    const handleDelete = async (itemId: number): Promise<void> => {
      await this.deleteTarea(itemId);
      console.log(itemId);
      await this.loadTareasData();
    };

    const element = React.createElement(AppTareasSharepoint, {
      tareaList: this.tareaList,
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

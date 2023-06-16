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

  private async renderComponent(): Promise<void> {
    const tareaList = await this.loadTareasData();

    const element: React.ReactElement<any> = React.createElement(
      AppTareasSharepoint,
      {
        tareaList: tareaList,
      }
    );

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

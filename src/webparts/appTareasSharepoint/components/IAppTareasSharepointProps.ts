import { ITarea } from "./AppTareasSharepoint";

export interface IAppTareasSharepointProps {
  tareaList: ITarea[];
  handleDelete: (taskId: number) => Promise<void>;
}

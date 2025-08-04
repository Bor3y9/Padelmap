import { Schema, model } from "mongoose";
import { ITaskAtr } from "../common/interfaces";
import { ResourceName, TaskStatus } from "../common/enums";

const taskSchema = new Schema<ITaskAtr>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: TaskStatus,
      default: TaskStatus.New,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TaskModel = model(ResourceName.Task, taskSchema);

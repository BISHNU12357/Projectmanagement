import mongoose, { Schema } from "mongoose"
import { AvailableTaskStatuses, TaskStatusEnum } from "../constant/task.constant.js"

const taskSchema = new Schema( {
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: AvailableTaskStatuses,
        default: TaskStatusEnum.TODO,
    },
    attachment: {
        type: [{
            uri: String,
            mimetype: String,
            size: number
        },],
        default: []
    },
}, { timestamps: true } );

export const Task = mongoose.model( "Task", taskSchema );
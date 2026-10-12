import mongoose from "mongoose";

const issueSchema = mongoose.Schema({ 

    title:{
        type: String,
        required: [true, 'title is required'],
        trim: true,
        maxlength: [20, "Title can not be more than 20 characters long"],
    },

    description: {
        type: String,
        required: [true, 'description is required'],
        trim: true,
        maxlength: [200, "Description can not be more than 200 characters long"],
    },

    category: {
        type: String,
        required: [true, 'category is required'],
        enum: ['Garbage', 'Road', 'Streetlight', 'Water'],
    },

    location: {
        type: String,
        required: [true, 'location is required'],
    },

    status: {
        type: String,
        required: [true, 'status is required'],
        enum: ['Reported', 'In Progress', 'Resolved'],
    },

    priority: {
        type: String,
        required: [true, 'priority is required'],
        enum: ['Low', 'Medium', 'High'],
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'createdBy is required'],
    },

    history: {
        type: Array,
        default: [],
    }
})

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
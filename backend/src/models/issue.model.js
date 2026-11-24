import mongoose from "mongoose";

const issueSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [50, "Title cannot be more than 50 characters long"],
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, "Description cannot be more than 500 characters long"],
    },

    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Garbage', 'Road', 'Streetlight', 'Water', 'Pothole', 'Sanitation'],
    },

    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
    },

    geoLocation: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
        },
    },

    image: {
        type: String,
        trim: true,
    },

    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['Reported', 'In Progress', 'Resolved'],
        default: 'Reported',
    },

    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'createdBy is required'],
    },

    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    upvotesCount: {
        type: Number,
        default: 0,
    },

    history: {
        type: Array,
        default: [],
    },

    duplicateOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue',
        default: null,
    }
}, { timestamps: true });

issueSchema.index({ geoLocation: "2dsphere" });

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;

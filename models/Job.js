/**
 * Mongoose schema and model for Job documents.
 *
 * Fields:
 * - company: Name of the company (required, max length 50).
 * - position: Job position title (required, max length 100).
 * - status: Current status of the job application ('interview', 'declined', 'pending'; default 'pending').
 * - createdBy: Reference to the User who created the job (required).
 *
 * Automatically manages `createdAt` and `updatedAt` timestamps.
 * @version 1.0
 */

const mongoose = require('mongoose');


const JobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Please provide company name'],
            maxlength: 50,
        },
        position: {
            type: String,
            required: [true, 'Please provide position'],
            maxlength: 100,
        },
        status: {
            type: String,
            enum: ['interview', 'declined', 'pending'],
            default: 'pending',
        },
        // This field stores a reference to another document 
        // — more specifically, to the user collection.
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user'],
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model('Job', JobSchema);
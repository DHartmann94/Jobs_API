/**
 * Job controller for handling CRUD operations on job entries.
 *
 * - `getAllJobs`: Retrieves all jobs created by the authenticated user.
 * - `getJob`: Retrieves a specific job by ID for the authenticated user.
 * - `createJob`: Creates a new job entry tied to the authenticated user.
 * - `updateJob`: Updates an existing job entry if it belongs to the authenticated user.
 * - `deleteJob`: Deletes a job entry if it belongs to the authenticated user.
 *
 * Uses custom error classes for consistent error handling.
 * @version 1.0
 */

const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');


/**
 * Retrieves all job entries created by the authenticated user, sorted by creation date.
 *
 * @param {Object} req - Express request object containing the authenticated user's ID.
 * @param {Object} res - Express response object used to return the list of jobs.
 */
const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

/**
 * Retrieves a specific job by ID if it was created by the authenticated user.
 *
 * @param {Object} req - Express request object containing the job ID and user ID.
 * @param {Object} res - Express response object used to return the job.
 *
 * @throws {NotFoundError} If no job is found with the given ID for the user.
 */
const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId }, } = req;

    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId,
    });

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({ job });
};

/**
 * Creates a new job entry associated with the authenticated user.
 *
 * @param {Object} req - Express request object containing job data and user ID.
 * @param {Object} res - Express response object used to return the created job.
 */
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};

/**
 * Updates an existing job if it belongs to the authenticated user.
 *
 * Validates that `company` and `position` fields are not empty.
 *
 * @param {Object} req - Express request object containing job ID, user ID, and update data.
 * @param {Object} res - Express response object used to return the updated job.
 *
 * @throws {BadRequestError} If `company` or `position` fields are empty.
 * @throws {NotFoundError} If no job is found with the given ID for the user.
 */
const updateJob = async (req, res) => {
    const { body: { company, position }, user: { userId }, params: { id: jobId }, } = req;

    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty');
    }

    const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({ job });
};

/**
 * Deletes a job by ID if it belongs to the authenticated user.
 *
 * @param {Object} req - Express request object containing job ID and user ID.
 * @param {Object} res - Express response object used to send the response.
 *
 * @throws {NotFoundError} If no job is found with the given ID for the user.
 */
const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId }, } = req;

    const job = await Job.findOneAndDelete({
        _id: jobId,
        createdBy: userId,
    });

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).send();
};


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
};
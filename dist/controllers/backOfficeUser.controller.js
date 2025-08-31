import "express-session";
import backofficeUserService from "../services/backofficeuser.service";
import { getApiResponseMessages, ApiResponseStatus } from "../utils/apiResponse";
const responses = getApiResponseMessages();
export const createUser = async (req, res) => {
    try {
        const data = await backofficeUserService.create(req.body);
        const result = {
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: data,
        };
        res.json(result);
    }
    catch (err) {
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: "",
        });
    }
};
export const getBySessionUserName = async (req, res) => {
    try {
        const username = req.session?.userName; // express-session middleware
        if (!username) {
            return res.json({
                StatusCode: responses[ApiResponseStatus.Failed],
                Message: "Session username not found.",
                Data: "",
            });
        }
        const data = await backofficeUserService.getByUserName(username);
        res.json({
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: data,
        });
    }
    catch (err) {
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: "",
        });
    }
};
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const data = await backofficeUserService.sendPasswordResetToken(email);
        res.json({
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: data,
        });
    }
    catch (err) {
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: "",
        });
    }
};
export const changePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        const data = await backofficeUserService.changePassword(userId, newPassword);
        res.json({
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: data,
        });
    }
    catch (err) {
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: "",
        });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const data = await backofficeUserService.resetPassword(token, newPassword);
        res.json({
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: data,
        });
    }
    catch (err) {
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: "",
        });
    }
};
export const getAllUsers = async (_req, res) => {
    try {
        const data = await backofficeUserService.getAll();
        res.json({
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: data,
        });
    }
    catch (err) {
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: "",
        });
    }
};
export const getNumberOfBackOfficeUsers = async (req, res) => {
    try {
        const { number } = req.params;
        const data = await backofficeUserService.getNumberOfBackOfficeUsers(Number(number));
        res.json({
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: data,
        });
    }
    catch (err) {
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: "",
        });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await backofficeUserService.deleteById(id);
        res.json({
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: data,
        });
    }
    catch (err) {
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: "",
        });
    }
};
export const updateUser = async (req, res) => {
    try {
        // Get ID from either URL params or request body
        const id = req.params.id || req.body.id;
        const updateData = req.params.id ? req.body : { ...req.body, id: undefined };
        console.log('Update User Request:', { id, updateData });
        console.log('Request body:', req.body);
        console.log('Request params:', req.params);
        if (!id) {
            return res.json({
                StatusCode: responses[ApiResponseStatus.BadRequest],
                Message: "User ID is required",
                Data: null,
            });
        }
        const data = await backofficeUserService.update(id, updateData);
        console.log('Update User Result:', data);
        res.json({
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: data,
        });
    }
    catch (err) {
        console.error('Update User Error:', err);
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: null,
        });
    }
};
export const testUserById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Testing user with ID:', id);
        const user = await backofficeUserService.getById(id);
        console.log('Found user:', user);
        res.json({
            StatusCode: responses[ApiResponseStatus.Successful],
            Message: ApiResponseStatus.Successful,
            Data: user,
        });
    }
    catch (err) {
        console.error('Test User Error:', err);
        res.json({
            StatusCode: responses[ApiResponseStatus.Failed],
            Message: err.message,
            Data: null,
        });
    }
};

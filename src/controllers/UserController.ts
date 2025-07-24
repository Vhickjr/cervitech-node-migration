
import { Request, Response } from "express";
import { AppUserService } from "../services/AppUserService";
import { GetApiResponseMessages, ApiResponseStatus } from "../helpers/ApiResponse";
import { DataResult } from "../helpers/DataResult";

const UserController = {
  async updatePictureUrl(req: Request, res: Response) {
    const responses = GetApiResponseMessages();
    const updateViewModel = req.body;

    console.log("UpdatePictureUrl input:", updateViewModel);

    let dataResult: DataResult;

    try {
      if (!updateViewModel.userId || !updateViewModel.pictureUrl) {
        dataResult = {
          statusCode: responses[ApiResponseStatus.BadRequest],
          message: ApiResponseStatus.BadRequest,
          data: null
        };
        return res.status(dataResult.statusCode).json(dataResult);
      }

      try {
        // TODO: Implement updatePictureUrl functionality
        const result = true;
        dataResult = {
          statusCode: responses[ApiResponseStatus.Successful],
          message: ApiResponseStatus.Successful,
          data: result
        };
      } catch (customError: any) {
        console.error("CustomException:", customError.message);
        dataResult = {
          statusCode: responses[ApiResponseStatus.Failed],
          message: customError.message,
          data: null
        };
      }
    } catch (error: any) {
      console.error("Exception:", error.message);
      dataResult = {
        statusCode: responses[ApiResponseStatus.UnknownError],
        message: ApiResponseStatus.UnknownError,
        exceptionErrorMessage: error.message,
        data: null
      };
    }

    res.status(dataResult.statusCode).json(dataResult);
    return;
  },
  async updateSubscription(req: Request, res: Response) {
    const responses = GetApiResponseMessages();
    const id = parseInt(req.params.id);

    console.log("UpdateSubscription input ID:", id);

    let dataResult: DataResult;

    try {
      if (!id || isNaN(id)) {
        dataResult = {
          statusCode: responses[ApiResponseStatus.BadRequest],
          message: ApiResponseStatus.BadRequest,
          data: null
        };
        return res.status(dataResult.statusCode).json(dataResult);
      }

      try {
        // TODO: Implement updateSubscription functionality  
        const result = true;

        dataResult = {
          statusCode: responses[ApiResponseStatus.Successful],
          message: ApiResponseStatus.Successful,
          data: result
        };
      } catch (customError: any) {
        console.error("CustomException:", customError.message);

        dataResult = {
          statusCode: responses[ApiResponseStatus.Failed],
          message: customError.message,
          data: null
        };
      }
    } catch (error: any) {
      console.error("Unhandled Exception:", error.message);

      dataResult = {
        statusCode: responses[ApiResponseStatus.UnknownError],
        message: ApiResponseStatus.UnknownError,
        exceptionErrorMessage: error.message,
        data: null
      };
    }

    return res.status(dataResult.statusCode).json(dataResult);
  },

  async deleteUserById(req: Request, res: Response) {
    const responses = GetApiResponseMessages();
    const { id } = req.query;

    console.log("DeleteUserById input ID:", id);

    let dataResult: DataResult;

    try {
      if (!id || (id as string).trim() === '') {
        dataResult = {
          statusCode: responses[ApiResponseStatus.BadRequest],
          message: "User ID is required",
          data: null
        };
        return res.status(dataResult.statusCode).json(dataResult);
      }

      try {
        const result = await AppUserService.deleteAppUserById(id as string);

        dataResult = {
          statusCode: responses[ApiResponseStatus.Successful],
          message: ApiResponseStatus.Successful,
          data: result
        };
      } catch (customError: any) {
        console.error("CustomException:", customError.message);

        dataResult = {
          statusCode: responses[ApiResponseStatus.Failed],
          message: customError.message,
          data: null
        };
      }
    } catch (error: any) {
      console.error("Unhandled Exception:", error.message);

      dataResult = {
        statusCode: responses[ApiResponseStatus.UnknownError],
        message: ApiResponseStatus.UnknownError,
        exceptionErrorMessage: error.message,
        data: null
      };
    }

    return res.status(dataResult.statusCode).json(dataResult);
  },

  async deleteUserByEmail(req: Request, res: Response) {
    const responses = GetApiResponseMessages();
    const { email, token } = req.query;

    console.log("DeleteUserByEmail input email:", email, "token:", token);

    let dataResult: DataResult;

    try {
      if (!email || (email as string).trim() === '') {
        dataResult = {
          statusCode: responses[ApiResponseStatus.BadRequest],
          message: "Email is required",
          data: null
        };
        return res.status(dataResult.statusCode).json(dataResult);
      }
      
      try {
        const result = await AppUserService.deleteAppUserByEmail(email as string, token as string);

        dataResult = {
          statusCode: responses[ApiResponseStatus.Successful],
          message: ApiResponseStatus.Successful,
          data: result
        };
      } catch (customError: any) {
        console.error("CustomException:", customError.message);

        dataResult = {
          statusCode: responses[ApiResponseStatus.Failed],
          message: customError.message,
          data: null
        };
      }
    } catch (error: any) {
      console.error("Unhandled Exception:", error.message);

      dataResult = {
        statusCode: responses[ApiResponseStatus.UnknownError],
        message: ApiResponseStatus.UnknownError,
        exceptionErrorMessage: error.message,
        data: null
      };
    }

    return res.status(dataResult.statusCode).json(dataResult);
  }
};

export default UserController;

import { Request, Response } from "express";
import { PictureUrlUpdateViewModel } from "../viewmodels/PictureUrlUpdateViewModel";
import { updatePictureUrlAsync, updateSubscriptionAsync, deleteByIdAsync, deleteByEmailAsync } from "../services/AppUserService";
import { GetApiResponseMessages, ApiResponseStatus } from "../helpers/ApiResponse";
import { DataResult } from "../helpers/DataResult";

const UserController = {
  async updatePictureUrl(req: Request, res: Response): Promise<void> {
    const responses = GetApiResponseMessages();
    const updateViewModel: PictureUrlUpdateViewModel = req.body;

    console.log("UpdatePictureUrl input:", updateViewModel);

    let dataResult: DataResult;

    try {
      if (!updateViewModel.userId || !updateViewModel.pictureUrl) {
        dataResult = {
          statusCode: responses[ApiResponseStatus.BadRequest],
          message: ApiResponseStatus.BadRequest,
          data: null
        };
        res.status(dataResult.statusCode).json(dataResult);
        return 
      }

      try {
        const result = await updatePictureUrlAsync(updateViewModel);
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
  async updateSubscription(req: Request, res: Response): Promise<void> {
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
        res.status(dataResult.statusCode).json(dataResult);
        return
      }

      try {
        const result = await updateSubscriptionAsync(id);

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

    res.status(dataResult.statusCode).json(dataResult);
    return;
  },

  async deleteAccount(req: Request, res: Response): Promise<void> {
    const responses = GetApiResponseMessages();
    const id = req.query.id as string;

    console.log("DeleteAccount input id:", id);

    let dataResult: DataResult;

    try {
      if (!id || id.trim().length === 0) {
        dataResult = {
          statusCode: responses[ApiResponseStatus.BadRequest],
          message: ApiResponseStatus.BadRequest,
          data: null
        };
        res.status(dataResult.statusCode).json(dataResult);
        return;
      }

      try {
        const result = await deleteByIdAsync(id);

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

    res.status(dataResult.statusCode).json(dataResult);
    return;
  },

  async deleteAccountByEmail(req: Request, res: Response): Promise<void> {
    const responses = GetApiResponseMessages();
    const email = req.query.email as string;

    console.log("DeleteAccountByEmail input email:", email);

    let dataResult: DataResult;

    try {
      if (!email || email.trim().length === 0) {
        dataResult = {
          statusCode: responses[ApiResponseStatus.BadRequest],
          message: ApiResponseStatus.BadRequest,
          data: null
        };
        res.status(dataResult.statusCode).json(dataResult);
        return;
      }

      try {
        const result = await deleteByEmailAsync(email);

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
          data: false
        };
      }
    } catch (error: any) {
      console.error("Unhandled Exception:", error.message);

      dataResult = {
        statusCode: responses[ApiResponseStatus.UnknownError],
        message: ApiResponseStatus.UnknownError,
        exceptionErrorMessage: error.message,
        data: false
      };
    }

    res.status(dataResult.statusCode).json(dataResult);
    return;
  }
}

export default UserController;
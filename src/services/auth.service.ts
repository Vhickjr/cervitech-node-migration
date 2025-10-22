import { HashUtil } from '../utils/hash';
import { SignupRequest, SignupResponse, PasswordResetTokenRequest, SendPasswordTokenResponse, PasswordResetResponse, PasswordResetRequest } from '../viewmodels/auth.viewmodel';
import { TokenUtil } from '../utils/token.util';
import { LoginResponse, LoginRequest, LoginResponseResult, LogoutRequest, LogoutResponse } from '../types/auth.types';
import { generateToken } from '../utils/generateToken';
import User from '../models/User';
import { MOBILE_CHANNEL } from '../enums/mobileChannel';
import TokenBlacklist from '../models/TokenBlacklist';
import AppUser from '../models/AppUser';
import { LoginViewModel, AppUserViewModel } from '../types/auth.types';
//import { CustomException } from '../utils/customException';
import { Goal } from '../models/Goal';
import { logger } from '../utils/logger';
import { DateLibrary } from '../utils/dateLibrary';
import { AuthValidation } from '../validation/authValidation';



export class AuthService {
  static async signup(data: SignupRequest): Promise<SignupResponse> {
    console.log("Data", data);

    const validationError: string[] | null = AuthValidation.signupValidation(data)
    if(validationError){
      return{
        success: false,
        message: validationError
      }
    }

    const {password, confirmPassword, ...userData} = data;
    const existing = await AppUser.findOne({ email: userData.email });
    //if (existing) throw new Error('Email already in use');
    if(existing){
      return{
        success:false,
        message: ["Email already in Use"]

      }
    }

    

    const hashedPassword = await HashUtil.hash(password);

    try{
      const createdUser = await AppUser.create({
      ...userData,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      username: userData.username,
      pictureUrl: userData.pictureUrl || '',
      fcmToken: userData.fcmToken || '',
      lastLoginDateTime: new Date(),
      allowPushNotifications: true,
      hasPaid: false,
      isGoalOn: false,
      responseRate: 0,
      neckAngleRecords: [],
      goals: [],
      mobileChannel: userData.mobileChannel || MOBILE_CHANNEL.WEB,
      prompt: 0,
      notificationCount: 0,
      currentTargetedAverageNeckAngle: 0,
      dateRegistered: new Date(),
      deleted: false
    });

    const userObj = createdUser.toObject();
    delete userObj.password;

    return {
      success:true,
      message: ['Signup successful'],
      data: userObj,
    };
    }catch(error: any){
      if (error.code === 11000){
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        return {
          success: false,
          message: [`${field} '${value}' is already taken`]
        };
      }
       logger.error(`Signup failed: ${error.message}`);
       return {
        success: false,
        message: ['Internal server error occurred during signup']
       }
    }
  }

  static async sendPasswordResetToken({ email }: PasswordResetTokenRequest): Promise<SendPasswordTokenResponse> {
    const user = await AppUser.findOne({ email });
    //if (!user) throw new Error('User not found');
    if(!user){
      return{
        success: false,
        message : ["User doesn't exist"]
      }
    }

    const token = TokenUtil.generateResetToken(user._id.toString());

    return {
      success: true,
      message: ['Password link generated'],
      resetLink: `http://localhost:4000/api/auth/reset-password?token=${token}`
    };
  }

  static async resetPassword({ token, newPassword }: PasswordResetRequest): Promise<PasswordResetResponse> {
    const { userId } = TokenUtil.verifyResetToken(token);
    const hashed = await HashUtil.hash(newPassword);
    await AppUser.findByIdAndUpdate(userId, { password: hashed });
    return { 
      success: true,
      message: ['Password reset successfully' ]
    };
  }

  //The authenticate method being used
  static async authenticatev1(model: LoginRequest): Promise<LoginResponseResult> {
    const { emailOrUsername, password, mobileChannel } = model;
    
    // Validate mobile channel using enum values
    /* if (!Object.values(MOBILE_CHANNEL).includes(mobileChannel)) {
      throw new CustomException("Please make sure you pass a valid MobileChannel value for this user");
    } */

    const validationError: string[] | null= AuthValidation.loginValidation(model)
    if(validationError){
      return{
        success: false,
        message:validationError,
      }
    }

    

/*     if (!emailOrUsername) {
      throw new CustomException("Please provide an email or username");
    } */

    const user = await AppUser.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      /* throw new CustomException("This account does not exist. Please check the email or username provided."); */
      return{
        success:false,
        message: ["This account does not exist. Please check the email or username provided."]
      }
    }

    if (user.deleted) {
      /* throw new CustomException("This account has been deleted. Please contact support if you believe this is an error."); */
      return{
        success:false,
        message: ["This account has been deleted. Please contact support if you believe this is an error."]
      }
    }

    const isValidPassword = await HashUtil.compare(password, user.password);
    if (!isValidPassword) {
      /* throw new CustomException("An incorrect password provided. Please check password and try again."); */
      return{
        success:false,
        message:["An incorrect password provided. Please check password and try again."]
      }
    }

    user.lastLoginDateTime = new Date();
    user.mobileChannel = mobileChannel;
    await user.save();

    const token = generateToken(user);

    let currentTargetedAverageNeckAngle = 0;
    const lastSetGoal = await Goal.findOne({ appUserId: user._id });
    if (lastSetGoal) {
      currentTargetedAverageNeckAngle = lastSetGoal.targetedAverageNeckAngle;
    }

    return {
      success:true,
      message: ["Authentication successful"],
      data:{
         id: user._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      hasPaid: user.hasPaid,
      pictureUrl: user.pictureUrl,
      fcmToken: user.fcmToken,
      isGoalOn: user.isGoalOn,
      allowPushNotifications: user.allowPushNotifications,
      mobileChannel: user.mobileChannel,
      currentTargetedAverageNeckAngle,
      dateRegistered: user.dateRegistered.toISOString(),
      responseRate: user.responseRate,
      lastLoginDateTime: user.lastLoginDateTime,
      prompt: user.prompt,
      notificationCount: user.notificationCount,
      token,
      deleted: user.deleted,
      }
    };
  }

/*   static async logout(userId: string, token: string): Promise<boolean> { */
    static async logout(logoutInfo: LogoutRequest): Promise<LogoutResponse>{
      const {userId, token} = logoutInfo;
        const validationError = AuthValidation.logoutValidation(logoutInfo)
        if(validationError){
          return{
            success: false,
            message: validationError
          }
        }
    /* if (!userId) throw new CustomException("UserId is not provided");
        if (!token) throw new CustomException("Token is missing"); */

      const user = await AppUser.findById(userId);

     /*  if (!user) throw new CustomException("User not found"); */
     if(!user){
      return{
        success: false,
        message: ["User not found"]
      }
     }

      try {
        await TokenBlacklist.create({
          token,
          expiresAt: new Date(Date.now() + 3600 * 1000),
        });

        user.fcmToken = "";
        await user.save();

        return{
          success: true,
          message:["Logout successful"]
        }
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        logger.error(`Logout failed: ${err.message}`);
        return {
          success: false,
          message: ['Internal server error during logout']
        };
      }
    }
  

    //The first logout is better because it handles token blacklisting
  /* static async logoutv2(userId: string): Promise<boolean> {
    try {
      if (userId === "") {
        throw new Error("UserId is not provided");
      }
      console.log("Attempting logout for userId:", userId);

      const user = await AppUser.findById(userId).exec();
      if (!user) {
        throw new CustomException("This user cannot be retrieved at the moment, please contact support.");
      }
      console.log("User found:", user.email);
      user.fcmToken = "";
      await user.save();

      return true;
    } catch (error) {
      if (error instanceof CustomException) {
        logger.error(error.message);
        throw error;
      } else {
        logger.error("Unexpected error during logout", error);
        throw error;
      }
    }
  } */

 /*  static async authenticate(model: LoginViewModel): Promise<AppUserViewModel> {
    try {
      // Validate mobile channel using enum values
      if (!Object.values(MOBILE_CHANNEL).includes(model.mobileChannel)) {
        throw new Error('Please make sure you pass a valid MobileChannel value for this user');
      }

      if (!model.emailOrUsername || model.emailOrUsername.trim() === '') {
        throw new CustomException('Please provide an email or username');
      }

      const identifier = model.emailOrUsername.trim();
      logger.info(`Authenticating user with identifier: ${identifier}`);

      const user = await AppUser.findOne({
        $or: [{ email: identifier }, { username: identifier }]
      }).exec();

      if (!user) {
        throw new CustomException('This account does not exist. Please check the email or username provided.');
      }
      
      const isValidPassword = await HashUtil.compare(model.password, user.password);

      if (!isValidPassword) {
        throw new CustomException('An incorrect password provided. Please check password and try again.');
      }

      user.lastLoginDateTime = new Date();
      await user.save();

      const lastSetGoal = await Goal.findOne({ appUserId: user._id }).exec();
      const currentTargetedAverageNeckAngle = lastSetGoal?.targetedAverageNeckAngle ?? 0;

      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        hasPaid: user.hasPaid,
        pictureUrl: user.pictureUrl,
        fcmToken: user.fcmToken,
        isGoalOn: user.isGoalOn,
        allowPushNotifications: user.allowPushNotifications,
        mobileChannel: user.mobileChannel,
        currentTargetedAverageNeckAngle,
        dateRegistered: user.dateRegistered.toISOString(),
        responseRate: user.responseRate,
        lastLoginDateTime: user.lastLoginDateTime,
        prompt: user.prompt,
        notificationCount: user.notificationCount,
        deleted: user.deleted
      };
    } catch (error) {
      if (error instanceof CustomException) {
        logger.error(error.message);
        throw error;
      }

      logger.error('Unexpected error during authentication:', error);
      throw new Error('Internal server error');
    }
  } */
}

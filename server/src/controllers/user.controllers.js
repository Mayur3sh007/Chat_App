import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";  
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";

//User section
const generateAccessandRefreshTokens = async(userId)=>{   
    try {
        const user = await User.findById(userId)
  
        if(!user)
        {
            throw new ApiError(404,"User not found");
        }
        
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken                
        await user.save({ validateBeforeSave: false })  
        
        return {accessToken, refreshToken}           
  
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Refresh and Access Tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => String(field).trim() === "")) {
    throw new ApiError(400, "All fields are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with same username or email exists");
  }

  const user = await User.create({
    email,
    password,
    username: String(username).toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering User");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set secure to true only in production
    expires: new Date(Date.now() + 24 * 3600 * 1000), // Expire in 1 day
    sameSite: "none", // Allow cross-site cookie access for production
  };

  // Set cookies
  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  // Return user data with tokens
  return res.status(201).json(
    new ApiResponse(
      200,
      {
        user: createdUser,
        accessToken,
        refreshToken,
      },
      "User registered and logged in successfully"
    )
  );
});


const loginUser = asyncHandler(async (req, res) => {
    console.log("Login Process Started");
    const { email, password } = req.body;
  
    if (!email) {
      throw new ApiError(400, "Username & Email is required");
    }
  
    const user = await User.findOne({ email });
  
    if (!user) {
      throw new ApiError(404, "User doesn't exist");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid User Credentials");
    }
  
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Set secure to true only in production
      expires: new Date(Date.now() + 24 * 3600 * 1000), // Expire in 1 day
      sameSite: 'none',  // Allow cross-site cookie access for production
      //strict in dev
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  });
  

const logoutUser = asyncHandler(async(req,res)=>{  
  await User.findByIdAndUpdate(
      req.user._id,   
      {
          $unset:{          
              refreshToken: 1 
          }
      },
      {
          new:true       
      },
  )

  const options = {   
      httpOnly:true,
      secure:true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged OUT"))
})

//contollers for if user is authenticated
const getUserData = asyncHandler(async(req, res)=>{
    const user = req.user;

    if(!user){
        throw new ApiError(409,"urlser not logged in")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,user,"User Data fetched Successfully"))

})


//Controllers Based on Problem Statement

export
{
  registerUser,
  loginUser,
  logoutUser,
  getUserData
}
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Conversation } from "../models/conversation.model.js";


const generateAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()

        await user.save({ validateBeforeSave: false })

        return { accessToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

// Register user
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body

    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ email: email.toLowerCase() })

    if (existedUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const profileLocalPath = req.files?.profile[0]?.path;

    if (!profileLocalPath) {
        throw new ApiError(400, "Profile file is required")
    }

    const profile = await uploadOnCloudinary(profileLocalPath)

    if (!profile) {
        throw new ApiError(400, "Profile file is required")
    }

    const user = await User.create({
        name,
        email,
        password,
        profile: profile.url,
    })

    const createdUser = await User.findById(user._id).select("-password")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

//Login user
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    if (!password) {
        throw new ApiError(400, "password is required");
    }


    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken } = await generateAccessTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken
                },
                "User logged In Successfully"
            )
        )

})


//Logout user
const logoutUser = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

//Get all users except logged-in user
const getAllUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id

  // Get all users except logged-in user
  const users = await User.find(
    { _id: { $ne: userId } },
    "name profile isOnline lastSeen"
  )
  
  return res.status(200).json(new ApiResponse(200, users));
})

//Edit User Details
const editUserDetails = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    const { name, about, password } = req.body || {}
    const profileLocalPath = req.files?.profile?.[0]?.path

    // Nothing to update
    if (
        name === undefined &&
        about === undefined &&
        password === undefined &&
        !profileLocalPath
    ) {
        throw new ApiError(400, "No data provided to update")
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // ---------- Profile Image ----------
    if (profileLocalPath) {
        const profile = await uploadOnCloudinary(profileLocalPath)
        if (!profile?.url) {
            throw new ApiError(400, "Failed to upload profile image")
        }
        user.profile = profile.url
    }

    // ---------- Name ----------
    if (typeof name === "string") {
        const trimmedName = name.trim()
        if (trimmedName) {
            user.name = trimmedName
        }
    }

    // ---------- About ----------
    if (typeof about === "string") {
        const trimmedAbout = about.trim()
        if (trimmedAbout) {
            user.about = trimmedAbout
        }
    }

    // ---------- Password ----------
    if (password !== undefined) {
        if (password.length < 4) {
            throw new ApiError(400, "Password must be at least 4 characters")
        }
        user.password = password // hashed in pre-save hook
    }

    await user.save()

    const updatedUser = await User.findById(userId).select("-password")

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User details updated successfully")
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    editUserDetails,
}
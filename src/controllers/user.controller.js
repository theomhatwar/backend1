import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details from frontend request body
    const { fullName, email, username, password } = req.body;

    // 2. Validation - Check if any required text fields are empty
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if user already exists in the database (by email or username)
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // 4. Check for uploaded files (Avatar is mandatory, Cover Image is optional)
    // Multer populates req.files if multiple files are uploaded
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image file is required");
    }

    // 5. Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file upload failed. Please try again.");
    }

    // 6. Create the user object and save it into the database
    // Note: Bcrypt will automatically hash the password here because of userSchema.pre("save")
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // Default to empty string if no cover image
        email,
        password,
        username: username.toLowerCase()
    });

    // 7. Remove sensitive fields (password and refresh token) from the response object
    const createdUser = await User.findById(user._id).select("-password -refreshtoken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 8. Return a success response back to the client
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully!")
    );
});

export { registerUser };



// import {asyncHandler} from "../utils/asyncHandler.js";

// const registerUser = asyncHandler(async (req,res)=>{
//     res.status(200).json({
//         message:"ok"
//     })
// })

// export {registerUser}

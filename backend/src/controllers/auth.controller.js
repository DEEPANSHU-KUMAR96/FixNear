import User from "../models/user.model";
import { sendTokenResponse } from "../utils/auth.utils.js";


export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {

        const isUserAllReadyExisted = await User.findOne({
            $or: [
                { email: email }
            ]
        })

        if (isUserAllReadyExisted) {
            return res.status(400).json({
                message: 'User already existed with this email'
            })
        }


        const user = await User.create({
            name,
            email,
            password,
            role: "user"
        })
        await sendTokenResponse(user, res, "User registered successfully");
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error registering user" });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    const user = await User.findOne({
        $or: [
            { email: email }
        ]
    }).select("+password");

    if (!user) {
        return res.status(404).json({
            message: 'user not found with this email'
        })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
        return res.status(400).json({
            message: 'your email and password is invalid'
        })
    }
    await sendTokenResponse(user, res, "User logged in successfully");
}


export const logoutUser = async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({
        message: 'User logged out successfully'
    })
}

export const getUser = async (req, res) => {
      const user = req.user
    res.status(200).json({
        success: true,
        user: req.user
    })
}

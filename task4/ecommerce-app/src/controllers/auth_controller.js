const userModel = require('../schema/user_model');
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const joi = require("joi");

async function registerUser(req, res) {
    try {
        const {fullName, email, password, role} = req.body;
        console.log(req.body);

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const roleSchema = joi.string().valid("admin", "customer").required();
        const { error } = roleSchema.validate(role);
        if (error) {
            return res.status(400).json({ message: "Invalid role. Role must be either 'admin' or 'customer'." });
        }

        const passwordSchema = joi.string()
            .min(8)
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 8 characters long',
            });
        const { error: passwordError } = passwordSchema.validate(password);
        if(passwordError){
            console.log(passwordError);
            return res.status(400).json({ message: passwordError.message });
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);
        const newUser = await userModel.create({
            fullName,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            },
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function loginUser(req, res) {
    try{
        const { email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if(!existingUser){
            return res.status(404).json({ message: "User not found" });
        }

        const passwordsMatch = bcrypt.compareSync(password, existingUser.password);
        if(!passwordsMatch){
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const token = jsonWebToken.sign(
            {userId: existingUser._id, email: existingUser.email, role: existingUser.role}, process.env.JWT_KEY);

        return res.status(200).json({
            message: "Login successfully",
            user: {
                fullName: existingUser.fullName,
                email: existingUser.email,
                role: existingUser.role
            },
            token: token
        });
    }catch (error) {
        console.log("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    registerUser,
    loginUser
};

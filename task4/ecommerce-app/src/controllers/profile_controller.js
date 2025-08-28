const userModel = require('../schema/user_model');

async function getUserProfile(req, res) {
    const userId = req.decoded.userId;
    try {
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getUserProfile
}
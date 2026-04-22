const Group = require('../models/group');
const mongoose = require('mongoose');

// ADD ACTIVITY
exports.addActivity = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { action, details } = req.body;

        const userId = req.user.id; // assuming auth middleware

        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            {
                $push: {
                    activities: {
                        user: userId,
                        action,
                        details
                    }
                }
            },
            { new: true }
        );

        if (!updatedGroup) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json({
            message: "Activity added successfully",
            data: updatedGroup.activities
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding activity",
            error: error.message
        });
    }
};

exports.getActivities = async (req, res) => {
    console.log("getActivities called with groupId:", req.params.groupId);
    try {
        const { groupId } = req.params;
        const userID = req.user?.id;

        // 1️⃣ Validate ID
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: "Invalid group ID" });
        }

        // 2️⃣ Fetch group
        const group = await Group.findById(groupId)
            .populate("activities.user", "name email")
            .select("activities members");

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // 4️⃣ Sort safely
        const activities = [...group.activities].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({
            message: "Activities fetched successfully",
            data: activities
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching activities",
            error: error.message
        });
    }
};
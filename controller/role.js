const Role = require('../models/role');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.addRole = async (req, res) => {
    const { name,username,email, contactNumber, password, ward } = req.body;
    const requesterRole = req?.user?.role;
    if (requesterRole !== 'Super Admin' && requesterRole !== 'Admin') {
        return res.status(403).json({ message: "You don't have authority to add user" });
    }
    try {
        
        const existingRole = await Role.findOne({ name, email, ward });
        if (existingRole) {
            return res.status(400).json({
                message: "Role is already exists"
                
            });
        }


        let user = await User.findOne({ email });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({
                username,
                email,
                password: hashedPassword,
                contactNumber,
                role: name,
                ward
            });
            await user.save();
        } else {
            await User.findByIdAndUpdate(
                user._id,
                {username,email, contactNumber, password, ward, role: name },
                { new: true, runValidators: true }
            );
        }
        const newRole = new Role({
            userId: user._id,
            name,
            username,
            email,
            contactNumber,
            password,
            ward
        });
        const savedRole = await newRole.save();
        res.status(201).json({
            message: "Role added successfully",
            Role: savedRole
        });
    } catch (error) {
        console.error('Error adding role', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

exports.editRole = async (req, res) => {
    const { role_id } = req.params;
    const { name,username,email, contactNumber, password, ward } = req.body;
    const requesterRole = req?.user?.role;
    if (requesterRole !== 'Super Admin' && requesterRole !== 'Admin') {
        return res.status(403).json({ message: "You don't have authority to edit role" });
    }
    if (!name) {
        return res.status(400).json({
            message: "Role name is required",
        });
    }
    try {
        const roleUpdateData = { name,email,contactNumber,ward };
        const updatedRole = await Role.findByIdAndUpdate(
            role_id,
            roleUpdateData,
            { new: true, runValidators: true }
        );
        if (!updatedRole) {
            return res.status(404).json({
                message: "Role not found",
            });
        }
        let user = await User.findOne({
            $or: [
                { email },
                { _id: updatedRole.userId }
            ]
        });

        if (!user) {
            if (!password) {
                return res.status(400).json({
                    message: "Password is required to create a new user",
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({
                // firstName,
                // lastName,
                username,
                email,
                password: hashedPassword,
                contactNumber,
                role: name,
                ward
            });
            await user.save();
        } else {
            const userUpdateData = { role: name, ward };
            // if (firstName) userUpdateData.firstName = firstName;
            if (username) userUpdateData.username = username;
            if (email) userUpdateData.email = email;
            if (contactNumber) userUpdateData.contactNumber = contactNumber;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                userUpdateData.password = await bcrypt.hash(password, salt);
            }
            await User.findByIdAndUpdate(user._id, userUpdateData, { new: true, runValidators: true });
        }
        res.status(200).json({
            message: "Role updated successfully",
            role: updatedRole,
        });
    } catch (error) {
        console.error('Error updating role', error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// exports.deleteRole = async (req, res) => {
//     const { role_id } = req.params;
//     try {
//         const deletedRole = await Role.findByIdAndDelete(role_id);
//         if (!deletedRole) {
//             return res.status(404).json({
//                 message: "Role not found",
//             });
//         }
//         res.status(200).json({
//             message: "Role deleted successfully",
//             role: deletedRole,
//         });
//     } catch (error) {
//         console.error('Error deleting role', error);
//         res.status(500).json({
//             message: "Internal Server Error"
//         });
//     }
// }


exports.deleteRole = async (req, res) => {
    const { role_id } = req.params;
    try {
        // Find the role by ID
        const deletedRole = await Role.findByIdAndDelete(role_id);

        // If role is not found, return a 404 error
        if (!deletedRole) {
            return res.status(404).json({
                message: "Role not found",
            });
        }

        // Find the user associated with the role
        const user = await User.findById(deletedRole.userId);

        // If user is found, delete the user
        if (user) {
            await User.findByIdAndDelete(user._id);
        }

        res.status(200).json({
            message: "Role and associated user deleted successfully",
            role: deletedRole,
            userId: deletedRole.userId,  // Optionally return the userId if needed
        });
    } catch (error) {
        console.error('Error deleting role', error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}
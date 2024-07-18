import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async(req, res) => {
    try {
        const data = await Users.findAll({
            attributes:['uuid', 'name', 'email', 'role']
        });
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getUsersById = async(req, res) => {
    try {
        const data = await Users.findOne({
            where: {
                uuid: req.params.id
            },
            attributes:['uuid', 'name', 'email', 'role']
        });
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createUsers = async(req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;
    if (password !== confirmPassword) {
        res.status(400).json({ msg: "Password and Confirm Password did not match" });
    }
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ msg: "Registered successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateUsers = async(req, res) => {
    const user = await Users.findOne({
            where: {
                uuid: req.params.id
            }
    });
    if (!user) {
        res.status(404).json({msg: "User not foud"})
    }

    const { name, email, password, confirmPassword, role } = req.body;

    let hashPassword;

    if (password === "" ||  password === null) {
        hashPassword = user.password
    } else {
        hashPassword = await argon2.hash(password);
    }

    if (password !== confirmPassword) {
        res.status(400).json({ msg: "Password and Confirm Password did not match" });
    }

    try {
        await Users.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "Updated successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deleteUsers = async(req, res) => {
    const user = await Users.findOne({
            where: {
                uuid: req.params.id
            }
    });
    if (!user) {
        res.status(404).json({msg: "User not foud"})
    }

    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "Deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
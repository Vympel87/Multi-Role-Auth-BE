import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) =>{
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) {
        return res.status(404).json({ msg: "User Not Found" });
    }

    const match = await argon2.verify(user.password, req.body.password);

    if (!match) {
        return res.status(400).json({ msg: "Wrong Password" });
    }

    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({uuid, name, email, role});
}

export const GetUserLogin = async (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Please login to your account!"});
    }
    const user = await Users.findOne({
        attributes:['uuid','name','email','role'],
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    };
    res.status(200).json(user);
}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if (err) {
            res.status(400).json({ msg: "Cannot logout" });
        }
        res.status(200).json({msg: "You are logged out"});
    });
}
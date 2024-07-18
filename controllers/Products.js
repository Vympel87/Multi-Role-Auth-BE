import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import {Op} from "sequelize"

export const getProducts = async(req, res) => {
    try {
        let data;

        if (req.role === "admin") {
            data = await Products.findAll({
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }],
                attributes: ['uuid', 'name', 'price']
            });
        } else {
            data = await Products.findAll({
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }],
                where: {
                    userId: req.userId
                },
                attributes: ['uuid', 'name', 'price']
            });
        }
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getProductById = async(req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!product) {
            return res.status(404).json({ msg: "Data not found" });
        }

        let data;

        if (req.role === "admin") {
            data = await Products.findOne({
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }],
                attributes: ['uuid', 'name', 'price'],
                where: {
                    id: product.id
                }
            });
        } else {
            data = await Products.findOne({
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }],
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                },
                attributes: ['uuid', 'name', 'price']
            });
        }
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createProduct = async (req, res) => {
    const { name, price } = req.body;
    try {
        await Products.create({
            name: name,
            price: price,
            userId: req.userId
        });
        res.status(201).json({msg: "Product Created Successfully"})
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateProduct = async(req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!product) {
            return res.status(404).json({ msg: "Data not found" });
        }

        const { name, price } = req.body;

        if (req.role === "admin") {
            await Products.update({ name, price }, {
                where: {
                    id: product.id
                }
            });
        } else {

            if (req.userId !== product.userId) {
                return res.status(403).json({ msg: "Forbidden Access"})
            }

            await Products.update({ name, price }, {
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                },
            });
        }
        res.status(200).json({ msg: "Product Updated Succesfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteProduct = async(req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!product) {
            return res.status(404).json({ msg: "Data not found" });
        }

        const { name, price } = req.body;

        if (req.role === "admin") {
            await Products.destroy({
                where: {
                    id: product.id
                }
            });
        } else {

            if (req.userId !== product.userId) {
                return res.status(403).json({ msg: "Forbidden Access"})
            }

            await Products.destroy({
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                },
            });
        }
        res.status(200).json({ msg: "Product Deleted Succesfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
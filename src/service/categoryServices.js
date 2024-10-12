import db from '../models/index';
import mysql from 'mysql2'
const getCategory = async () => {



    // get category
    try {
        let category = [];
        category = await db.Category.findAll();


        if (category) {
            return {
                EM: 'lấy data thành côngg ',
                EC: 0,
                DT: category
            }
        } else {
            return {
                EM: 'lấy data thất bại',
                EC: -1,
                DT: []
            }
        }
    } catch (error) {

        return {
            EM: 'lỗi',
            EC: -2,
            DT: []
        }
    }
}

// create category

const checkCategoryname = async (rawcategorydata) => {
    try {
        let category = await db.Category.findOne(
            {
                where: { categoryName: rawcategorydata }
            }
        )
        if (category) {
            return true;
        } else {
            return false;
        }
    } catch (error) {

    }
}
const createCategory = async (namecategory) => {
    try {
        let isCategorynameExist = await checkCategoryname(namecategory)

        if (isCategorynameExist === true) {
            return {
                EM: 'Danh mục này đã tồn tại',
                EC: 1
            }
        }
        const max_id = await db.Category.max("id");

        await db.Category.create({
            id: max_id + 1,
            categoryName: namecategory,

        })
        return {
            EM: " Tạo danh mục thành công",
            EC: 0
        }

    } catch (error) {
        console.log(error)
        return {
            EM: " error",
            EC: -2
        }
    }
}


// update category
const updateCategory = async (valuedata) => {
    try {
        let category = await db.Category.findOne({
            where: { id: valuedata.dataid }
        })
        if (category) {
            category.categoryName = valuedata.dataname;
            await category.save();
            return {
                EM: "update thành công ",
                EC: 0,
                DT: ''
            }
        }
        else {
            return {
                EM: "không tìm thấy category",
                EC: 2,
                DT: ''
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Đã xảy ra lỗi",
            EC: 1,
            DT: []
        };
    }
}

// delete category


const deleteCategory = async (idcategory) => {
    try {

        let category = await db.Category.findOne({
            where: { id: idcategory }
        });

        if (category) {

            await category.destroy();
            return {
                EM: "Xóa thành công",
                EC: 0,
                DT: category
            };
        } else {

            return {
                EM: "Không tìm thấy danh mục",
                EC: 2,
                DT: []
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Đã xảy ra lỗi",
            EC: 1,
            DT: []
        };
    }
}

module.exports = {
    getCategory, createCategory, deleteCategory, updateCategory
}

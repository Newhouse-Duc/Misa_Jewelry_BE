import categoryServices from '../service/categoryServices';

const handlerCategory = async (req, res) => {

    setTimeout(async () => {
        try {
            let data = await categoryServices.getCategory();
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EM: "error from server",
                EC: '-1',
                DT: '',

            })
        }
    }, 500)
}


const handleCreateCategory = async (req, res) => {
    try {

        if (!req.body.categoryname) {
            return res.status(200).json({
                EM: "mising data required",
                EC: '1',
                DT: '',
            })
        }

        let data = await categoryServices.createCategory(req.body.categoryname)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: '',

        })
    } catch (error) {

        return res.status(500).json({
            EM: "error from server",
            EC: '-1',
            DT: '',

        })
    }
}


const handleDeleteCategory = async (req, res) => {

    setTimeout(async () => {
        try {
            let data = await categoryServices.deleteCategory(req.body.id);

            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: '',

            })
        } catch (error) {

            return res.status(500).json({
                EM: "error from server",
                EC: '-1',
                DT: '',

            })
        }
    }, 500)
}

const handlEditCategory = async (req, res) => {


    try {
        let data = await categoryServices.updateCategory(req.body);

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: '',

        })
    } catch (error) {

        return res.status(500).json({
            EM: "error from server",
            EC: '-1',
            DT: '',

        })
    }

}


module.exports = {
    handlerCategory, handleCreateCategory, handleDeleteCategory, handlEditCategory
}

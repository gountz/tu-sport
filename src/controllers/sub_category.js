const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/users');
const subCategorySchema = require('../models/sub_category');


router.get('', async (req, res) => {
    await subCategorySchema.find()
        .then( subCategories => {
            res.status(201).json({data: subCategories});
        })
        .catch( err => {
            res.status(403).json({message: "Hubo un error al obtener Sub categorias"})
        })
})

router.get('/:id', async (req, res) => {
    await subCategorySchema.findById({_id: req.params.id})
        .then( subCategory => {
            res.status(201).json({data: subCategory});
        })
        .catch( err => {
            res.status(403).json({message: "Hubo un error al obtener categorias"})
        })
})

router.post('/add', validateToken, (req, res) => {
    const { name } = req.body.data.subCategory;
    const subCategoryData = {name: name.toUpperCase()};
    const subCategory = new subCategorySchema(subCategoryData);
    subCategory.save()
        .then( subCategory => {
            res.status(201).json({data: subCategory});
        })
        .catch( err => {
            res.status(403).json({message: "Hubo un error en el formulario o datos del formulario"})
        })
})


router.put('/edit/:id',  validateToken, async (req, res) => {
    const { name } = req.body.data.subCategory;
    const subCategoryData = {name: name.toUpperCase()}
    await subCategorySchema.findByIdAndUpdate({_id: req.params.id}, subCategoryData)
        .then( subCategory => {
            res.status(201).json({data: subCategory});
        })
        .catch(err => {
            res.status(406).json({message:"Error en los datos de Sub categorias"})
        })
})


router.delete('/delete/:id', validateToken, async (req, res) => {
    await subCategorySchema.deleteOne({_id: req.params.id})
            .then( () => {
                res.status(201).json({message: "Success"});
            })
            .catch( err => {
                res.status(406).json({message: "Error en los datos de envio"});
            });
})

module.exports = router;
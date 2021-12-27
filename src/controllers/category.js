const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/users');
const categorySchema = require('../models/category');
const subCategorySchema = require('../models/sub_category');

router.get('', async (req, res) => {
    await categorySchema.find()
        .then( category => {
            res.status(201).json({data: category});
        })
        .catch( err => {
            res.status(403).json({message: "Hubo un error al obtener categorias"})
        })
})

router.get('/:id', validateToken, async (req, res) => {
    await categorySchema.find({_id: req.params.id})
        .then( category => {
            [category] = category
            res.status(201).json({data: category});
        })
        .catch( err => {
            res.status(403).json({message: "Hubo un error al obtener categorias"})
        })
})

router.post('/add', validateToken, (req, res) => {
    const { name } = req.body.data.category;
    const categoryData = {name: name.toUpperCase()};
    const category = new categorySchema(categoryData);
    category.save()
        .then( category => {
            res.status(201).json({data: category});
        })
        .catch( err => {
            res.status(406).json({message: "Hubo un error al obtener categorias"})
        })
})

router.put('/edit/:id', validateToken, async (req, res) => {
    await categorySchema.findById({_id: req.params.id })
        .then(category => {
            categorySchema.replaceOne({_id: category.id }, { name: req.body.data.category.name.toUpperCase(), sub_c: category.sub_c })
                .then(category => {
                    res.status(201).json({data: category})
                })
                .catch( err => {
                    res.status(406).json({ message: "Error al editar categoria"})
                });
        })
});

router.put('/edit/:id/sub-category/:sc', validateToken, async (req, res) => {
    await subCategorySchema.findById({_id: req.params.sc})
        .then( ( subCategory ) => {
            categorySchema.findById({_id: req.params.id})
                .then((category) => {
                    category.sub_c = category.sub_c.push(subCategory);
                    categorySchema.findByIdAndUpdate( { _id: req.params.id }, category)
                        .then( () => {
                            res.status(201).json({data: category})
                        })
                        .catch( err => {
                            res.status(406).json({message: "Error en datos de envio"})
                        })
                })
                .catch(err => {
                    res.status(406).json({message: "Error en datos de envio"})
                })
        })
        .catch( err => {
            res.status(406).json({message: "Error en datos de envio"})
        })
})

router.delete('/delete/:id/sub-category/:sc', validateToken, async (req, res) => {
    await categorySchema.findById({_id: req.params.id})
        .then(category => {
            subCategorySchema.findById({_id: req.params.sc})
                .then( subC => {
                    const index = category.sub_c.indexOf(subC)
                    if (index > -1) {
                        category.sub_c.splice(index, 1);
                    }else{
                        category.sub_c.pop()
                    }
                    categorySchema.replaceOne({_id: category._id }, { name: category.name.toUpperCase(), sub_c: category.sub_c})
                        .then( category => {
                            res.status(201).json({message: "Success"});
                        })
                        .catch( err => {
                            res.status(406).json({ message: "Error al editar categoria", error: err})
                        })
                })
                .catch( err => {
                    res.status(406).json({ message: "Error al buscar Sub Categoria"})
                })
        })
        .catch( err => {
            res.status(406).json({ message: "Error al obtener categoria", error: err})
        })
});
    

router.delete('/delete/:id', validateToken, async (req, res) => {
    await categorySchema.deleteOne({_id: req.params.id})
            .then( () => {
                res.status(201).json({message: "Success"});
            })
            .catch( err => {
                res.status(406).json({message: "Error en los datos de envio"});
            });
})

module.exports = router;
const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/users');
const productSchema = require('../models/products');
const categorySchema = require('../models/category');

router.get('', async (req, res) => {
    await productSchema.find()
        .then( products => {
            res.status(201).json({data: products});
        })
        .catch( err => {
            res.status(403).json(
                { message: "Hubo un error al obtener productos" }
            )
        })
});


router.get('/get-products/filter/:ctg/:sc/:min/:max', async (req, res) => {
    if(req.params.ctg && req.params.sc !== '0'){
        await productSchema.find({category: req.params.ctg, sub_category: req.params.sc})
        .then( products => {
            if(req.params.min && req.params.max){
                products = products.filter( prd => prd.price >= req.params.min && prd.price <= req.params.max);
                return res.json({data: products});
            }else if(req.params.min){
                products = products.filter( prd => prd.price >= req.params.min);
                return res.json({data: products});
            }else if(req.params.max){
                products = products.filter(prd => prd.price <= req.params.max);
                return res.json({data: products});
            }else{
                return res.json({data: products});
            }
        })
        .catch( err => {
            res.status(406).json({ message: "Error al obtener productos" })
        })
    }else if (req.params.ctg){
        await productSchema.find({category: req.params.ctg})
            .then( products => {
                if(req.params.min && req.params.max){
                    products = products.filter( prd => prd.price >= req.params.min && prd.price <= req.params.max);
                    return res.json({data: products});
                }else if(req.params.min){
                    products = products.filter( prd => prd.price >= req.params.min);
                    return res.json({data: products});
                }else if(req.params.max){
                    products = products.filter(prd => prd.price <= req.params.max);
                    return res.json({data: products});
                }else{
                    return res.json({data: products});
                }
            })
            .catch( err => {
                res.status(406).json({ message: "Error al obtener productos" })
            })
    }else{
        res.status(406).json({ message: "Error en los datos de envio" })
    }
})

router.get('/get-products/filter-search/:t', async (req, res) => {
    const productReturn = []
    await productSchema.find()
        .then( products => {
            for(let product of products){
                const index = product.title.indexOf(req.params.t.toUpperCase())
                let data = product.title.slice(index, (index + req.params.t.length));
                if(data){
                    productReturn.push(product)
                } 
            }
            for(let productS of products){
                const index = productS.sub_title.indexOf(req.params.t.toUpperCase())
                let data = productS.sub_title.slice(index, (index + req.params.t.length));
                if(data){
                    productReturn.push(productS)
                } 
            }
            return res.status(200).json({data: productReturn});
        }) 
        .catch( err => {
            return res.status(406).json({message: "mensaje" })
        })
    
})

router.get('/get-products/for/categories',  async (req, res ) => {
    const sendData = [];
    const sendJson = () => {
        res.status(200).json({data: sendData})
    }
    categorySchema.find()
        .then( categories => {
            if(categories){
                for(let category of categories){
                    productSchema.find({category: { _id : category._id } })
                        .then( products => {
                            sendData.push({category, products})
                            if(sendData.length === categories.length){
                                sendJson();
                            }
                        })
                        .catch(err => {
                            res.json({message: "err"})
                        })
                }
            }
        })
        .catch( err => {
            res.status(406).json({ message: "Error al obtener categorias" });
        });
});

router.get('/last-products', async (req, res) => {
    await productSchema.find()
        .then( products => {
            if(products.length > 10){
                products.splice(products.length - 4);
            }
            res.status(201).json({data: products});
        })
        .catch( err => {
            res.status(403).json(
                {message: "Hubo un error al obtener productos"}
            );
        })
});

router.get('/:id', async (req, res) => {
    await productSchema.find({_id: req.params.id})
        .then( product => {
            res.status(201).json({data: product});
        })
        .catch( err => {
            res.status(403).json({message: "Hubo un error al obtener productos"})
        });
});

router.post('/add', validateToken, async (req, res) => {
    const { title, sub_title, category, sub_category, size, price, thumbnail, images } = req.body.data.product;
    const productData = {
        title: title.toUpperCase(),
        sub_title: sub_title.toUpperCase(),
        category,
        sub_category,
        size: size.toUpperCase(),
        price,
        thumbnail,
        images
    }

    const product = new productSchema(productData);
    product.save()
        .then( (product) => {
            res.status(201).json({data: product});
        })
        .catch( err => {
            res.status(406).json({message: "Error en los datos enviados"});
        });
});

router.put('/add/image/:id', validateToken, async (req, res) => {
    const { img } = req.body.data.product
    await productSchema.findById({_id: req.params.id})
        .then( product => {
            product.images.push(img);
            productSchema.replaceOne({_id: product._id }, product)
                        .then(product => {
                            res.status(201).json({data: product})
                        })
                        .catch( err => {
                            res.status(406).json({ message: "Error en los datos enviados"})
                        })
                })
        .catch( err => {
            res.status(406).json({message:"Error en los datos del producto"})
        });
})

router.delete('/delete/image/:id', validateToken, async (req, res) => {
    await productSchema.findById({_id: req.params.id})
        .then( product => {
            const image = product.images.find( image => image === req.body.data.images);
            const index = product.images.indexOf(image);
            if (index > -1) {
                product.images.splice(index, 1);
            }else{
                product.images.pop();
            }
            productSchema.replaceOne({_id: req.params.id }, product)
                .then( product => {
                    res.status(201).json({data: product})
                })
                .catch( err => {
                    res.status(406).json({ message: "Error al borrar imagen", error: err})
                })
            })
        .catch( err => {
            res.status(406).json({ message: "Error al obtener producto", error: err})
        });
})

router.put('/edit/:id', validateToken, async (req, res) => {
    const { title, sub_title, category, sub_category, size, price, thumbnail } = req.body.data.product;
    const productData = {
        title: title.toUpperCase(),
        sub_title: sub_title.toUpperCase(),
        category,
        sub_category,
        size: size.toUpperCase(),
        price,
        thumbnail
    }
    await productSchema.findByIdAndUpdate({_id: req.params.id}, productData)
        .then( product => {
            res.status(201).json({data: product});
        })
        .catch(err => {
            res.status(406).json({message:"Error en los datos del producto"})
        });
})

router.delete('/delete/:id', validateToken, async (req, res) => {
    await productSchema.deleteOne({_id: req.params.id})
            .then( () => {
                res.status(201).json({message: "Success"});
            })
            .catch( err => {
                res.status(406).json({message: "Error en los datos de envio"});
            });
})

module.exports = router;
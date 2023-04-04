const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try { 
    const productData = await Product.findAll({
    attributes: [
      'id',
      'product_name',
      'price',
      'stock'
],
include: [
  {
    model: Category,
    attributes: ['category_name']
  },
  {
    model: Tag,
    attributes: ['tag_name']
  }
]});
  res.json(productData);
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
});

router.get('/:id', async (req, res) => {
  try {
    const productById = await Product.findByPk(req.params.id, {
      attributes: [
        'id',
        'product_name',
        'price',
        'stock'
      ],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag,
          attributes: ['tag_name']
        }
      ]
    }
    )
    res.json(productById)
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }

});

// create new product
router.post('/', (req, res) => {

Product.create({
  product_name: req.body.product_name,
  price: req.body.price,
  stock: req.body.stock,
  category_id: req.body.category_id,
  tagIds: req.body.tagIds
})
  .then((product) => {
   // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  if (req.body.tagIds.length) {
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: product.id,
        tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(product);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});


// update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;

module.exports = router;
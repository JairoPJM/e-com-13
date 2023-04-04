const router = require('express').Router();
const { Category, Product } = require('../../models');
const { update } = require('../../models/Product');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
try {
  const category = await Category.findAll({
    attributes: [
      'id',
      'category_name'
    ],
    include: [
      {
        model: Product,
        attributes: [
          'id',
          'product_name',
          'price',
          'stock',
          'category_id'
        ]
      }
    ],
  })
  res.json(category)
} catch(err) {
  console.log(err)
  res.status(500).json(err)
}
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryById = await Category.findByPk(req.params.id, {
      attributes: [
        'id',
        'category_name'
      ],
      include:[
        {
          model: Product,
          attributes: [
            'id',
            'product_name',
            'price',
            'stock',
            'category_id'
          ]
        }
      ],
    })
    res.json(categoryById)
  }catch (err){
    console.log(err);
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create({
    category_name: req.body.category_name
  })
  res.json(newCategory);
  } catch (err){
    console.log(err)
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    if(!updateCategory) {
      res.status(404).json({message: "ID not found, Please try again"})
    }
    res.json(updateCategory)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const deleteCategory = Category.destroy({
      where: {
        id: req.params.id
      }
    })
    deleteCategory => {
      if(!deleteCategory) {
        res.status(404).json({message: "This category does not exist"})
      }
    }
    res.json(deleteCategory)
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
});

module.exports = router;
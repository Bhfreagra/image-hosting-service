const router = require('express').Router()
const upload = require('../middlewares/uploadMiddleware')
const ImageController = require('../controllers/image-controller')
const ImageValidator = require('../validators/image-validator')
const { logError } = require('zippy-logger')


router.post('/singleImage', upload.single('image'), ImageValidator.single, async (req, res) => {
  try {
    const imageController = new ImageController()
    const result = await imageController.upload(req.file)
    res.status(200).send(result)
  } catch (err) {
    logError({ message: err.msg || err.message, path: 'Index routes, singleImage, POST ' })
    res.status(err.status || 500).send({error: err.msg || err.message})
  }
})

router.post('/multiImage', upload.array('image', 10), ImageValidator.multi, async (req, res) => {
  try {
    const imageController = new ImageController()
    const result = await imageController.uploadMulti(req.files)
    res.status(200).send(result)
  } catch (err) {
    logError({ message: err, path: 'Index routes, multiImage, POST' })
    res.status(err.status || 500).send({error: err.msg || err.message})
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      res.status(408).send('Invalid id!')
    }

    const imageController = new ImageController()
    const result = await imageController.fetch(id)
    res.status(200).send(result)

  } catch (err) {
    logError({ message: err, path: 'Index routes, id, GET' })
    res.status(err.status || 500).send({error: err.msg || err.message})
  }
})

router.get('/', async (req, res) => {
  try {
    const ids = req.query.ids

    if (!ids || ids.length === 0)
      return res.status(200).send({})

    if (typeof ids === 'string') {
      ids = [ids]
    }

    const imageController = new ImageController()
    const result = await imageController.fetchList(ids)
    res.status(200).send(result)

  } catch (err) {
    logError({ message: err, path: 'Index routes, root , GET' })
    rres.status(err.status || 500).send({error: err.msg || err.message})
  }
})

router.delete('/id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      res.status(408).send('Invalid id!')
    }

    const imageController = new ImageController()
    const result = imageController.remove(id)
    res.status(200).send()

  } catch(err) {
    logError({ message: err, path: 'Index routes, id , DELETE' })
    rres.status(err.status || 500).send({error: err.msg || err.message})
  }
})

module.exports = router
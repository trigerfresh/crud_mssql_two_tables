const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const controller = require('../controllers/userController')

const router = express.Router()

const uploadDir = path.join(__dirname, '../uploads/images')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const nameWithoutExt = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)
    cb(null, `${Date.now()}-${nameWithoutExt || 'img'}${ext}`)
  },
})

const upload = multer({ storage })

router.get('/', controller.getUsers)
router.get('/:id', controller.getUser)
router.post(
  '/',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
  ]),
  controller.addUser,
)
router.put(
  '/:id',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
  ]),
  controller.editUser,
)

router.delete('/:id', controller.removeUser)

module.exports = router

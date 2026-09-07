const userModel = require('../models/userModels')

// =========================
// GET ALL USERS
// =========================
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers()

    res.status(200).json({
      success: true,
      message: users,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

// =========================
// GET USER BY ID
// =========================
const getUser = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id)

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      message: user[0],
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

// =========================
// CREATE USER
// =========================
const addUser = async (req, res) => {
  try {
    const id = await userModel.createUser({
      name: req.body.name,
      email: req.body.email,

      image1: req.files?.image1?.[0]?.filename || '',

      image2: req.files?.image2?.[0]?.filename || '',

      designation: req.body.designation,
      address: req.body.address,
    })

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      id: id,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

// =========================
// UPDATE USER
// =========================
const editUser = async (req, res) => {
  try {
    await userModel.updateUser(req.params.id, {
      name: req.body.name,
      email: req.body.email,

      image1: req.files?.image1?.[0]?.filename || '',

      image2: req.files?.image2?.[0]?.filename || '',

      designation: req.body.designation,
      address: req.body.address,
    })

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

// =========================
// DELETE USER
// =========================
const removeUser = async (req, res) => {
  try {
    await userModel.deleteUser(req.params.id)

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

module.exports = {
  getUser,
  getUsers,
  addUser,
  editUser,
  removeUser,
}

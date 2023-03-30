const express = require('express');


const getAllUsers = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}
const createUser = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}
const getUser = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}
const updateUser = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}
const deleteUser = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}

const router = express.Router();

router
    .route('/')
    .get(getAllUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;
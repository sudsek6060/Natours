const { query } = require('express');
const Tour = require('../model/tourModel');
const { json } = require('express/lib/response');


// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.getAllTours = async (req, res) => {
    try {    
        // Build query
        // 1.Filtering
        const queryObj = {...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el])
        //  console.log(req.query, queryObj);

        // 2.Advance filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));


    // const tours = await Tour.find({
    //     duration: 5,
    //     difficulty: 'easy'
    // })

    // const tours = await Tour.find()
    //     .where('duration')
    //     .equals(5)
    //     .where('difficulty')
    //     .equals('easy')
        
    const query = Tour.find(JSON.parse(queryStr))

    // Execute query
    const tours = await query;

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }
   
};

exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }

    // // if(id > tours.length) {

    // 
};

exports.createTour = async (req, res) => {

    try {
        const newTour = await Tour.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            tours: newTour
        }
    })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error
        })
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }

    
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
        status: 'success',
        data: null
    })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }
    
};
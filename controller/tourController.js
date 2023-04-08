const { query } = require('express');
const Tour = require('../model/tourModel');
const { json } = require('express/lib/response');


// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getAllTours = async (req, res) => {
    try {    
        // Build query
        // 1.1 Filtering
        const queryObj = {...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el])
        //  console.log(req.query, queryObj);

        // 1.2 Advance filtering
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
        
    let query = Tour.find(JSON.parse(queryStr))

    //2. Sorting
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }else {
        query = query.sort('-createdAt')
    };
    // 3. Field Limiting
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    }else {
        query = query.select('-__v')
    }

    // 4. Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if(req.query.page){
        const numTours = await Tour.countDocuments();
        if(skip >= numTours) throw new Error('This page does not exist')
    }

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
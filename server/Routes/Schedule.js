const express = require('express');
const router = express.Router();
const Schedule = require('../Models/TaskSchema');
const User = require('../Models/UserSchema')

router.get('/', async(res, req) => {
    try {
        const schedules = await Schedule.find();
        res.json(schedules)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
} )

router.get('/:id', async(req, res)=>{
    try {
        const Schedule = await Schedule.findById(req.params.id);
        if(!Schedule) return res.status(404).json({ message: 'Schedule Not Found' });
        res.json(Schedule);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


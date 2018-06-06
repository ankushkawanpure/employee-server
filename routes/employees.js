/**
 * Created by ankush on 6/4/18.
 */
const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');
const Employee = require('../models/employee');

const minutes = 5;
const postLimiter = new RateLimit({
    windowMs: minutes * 60 * 1000,
    max: 100,
    delayMs: 0,
    handler: (req, res) => {
        res.status(429).json({ success: false, msg: `Too many requests. Please try again after ${minutes} minutes.` });
    }
});

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such user.` });
        });
});


router.get('/', (req, res) => {
    Employee.find({})
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
        });
});

router.post('/', postLimiter, (req, res) => {

    let newEmployee = new Employee({
        name: sanitizeName(req.body.name),
        email: sanitizeEmail(req.body.email),
        address: sanitizeAddress(req.body.address),
        basesalary: sanitizeBaseSalary(req.body.basesalary),
        deductions: sanitizeDeduction(req.body.deductions),
        takehomepay: sanitizeTakehomePay(req.body.takehomepay)
    });

    newEmployee.save()
        .then((result) => {
            res.json({
                success: true,
                msg: `Successfully added!`,
                result: {
                    _id: result._id,
                    name: result.name,
                    email:result.email,
                    address: result.address,
                    basesalary: result.basesalary,
                    deductions: result.deductions,
                    takehomepay: result.takehomepay
                }
            });
        })
        .catch((err) => {
            if (err.errors) {
                if (err.errors.name) {
                    res.status(400).json({ success: false, msg: err.errors.name.message });
                    return;
                }
                if (err.errors.email) {
                    res.status(400).json({ success: false, msg: err.errors.email.message });
                    return;
                }
                if (err.errors.address) {
                    res.status(400).json({ success: false, msg: err.errors.address.message });
                    return;
                }
                if (err.errors.basesalary) {
                    res.status(400).json({ success: false, msg: err.errors.basesalary.message });
                    return;
                }
                if (err.errors.deductions) {
                    res.status(400).json({ success: false, msg: err.errors.deductions.message });
                    return;
                }
                if (err.errors.takehomepay) {
                    res.status(400).json({ success: false, msg: err.errors.takehomepay.message });
                    return;
                }
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

router.put('/:id', (req, res) => {

    let updatedEmployee = {
        name: sanitizeName(req.body.name),
        email: sanitizeEmail(req.body.email),
        address: sanitizeAddress(req.body.address),
        basesalary: sanitizeBaseSalary(req.body.basesalary),
        deductions: sanitizeDeduction(req.body.deductions),
        takehomepay: sanitizeTakehomePay(req.body.takehomepay)
    };

    Employee.findOneAndUpdate({ _id: req.params.id }, updatedEmployee, { runValidators: true, context: 'query' })
        .then((oldResult) => {
            Employee.findOne({ _id: req.params.id })
                .then((newResult) => {
                    res.json({
                        success: true,
                        msg: `Successfully updated!`,
                        result: {
                            _id: newResult._id,
                            name: newResult.name,
                            email: newResult.email,
                            address: newResult.address,
                            basesalary: newResult.basesalary,
                            deductions: newResult.deductions,
                            takehomepay: newResult.takehomepay
                        }
                    });
                })
                .catch((err) => {
                    res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
                    return;
                });
        })
        .catch((err) => {
            if (err.errors) {
                if (err.errors.name) {
                    res.status(400).json({ success: false, msg: err.errors.name.message });
                    return;
                }
                if (err.errors.email) {
                    res.status(400).json({ success: false, msg: err.errors.email.message });
                    return;
                }
                if (err.errors.basesalary) {
                    res.status(400).json({ success: false, msg: err.errors.basesalary.message });
                    return;
                }
                if (err.errors.deductions) {
                    res.status(400).json({ success: false, msg: err.errors.deductions.message });
                    return;
                }
                if (err.errors.takehomepay) {
                    res.status(400).json({ success: false, msg: err.errors.takehomepay.message });
                    return;
                }
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

router.delete('/:id', (req, res) => {

    Employee.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
                result: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    address: result.address,
                    basesalary: result.basesalary,
                    deductions: result.deductions,
                    takehomepay: result.takehomepay
                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});

module.exports = router;


sanitizeName = (name) => {
    return stringCapitalizeName(name);
};

sanitizeEmail = (email) => {
    return email.toLowerCase();
};

sanitizeAddress = (address) => {
    return address;
};

sanitizeBaseSalary = (baseSalary) => {
    if (isNaN(baseSalary) && baseSalary !== '')
        return '';
    return parseInt(baseSalary);
};

sanitizeDeduction = (deduction) => {
    return deduction;
};

sanitizeTakehomePay = (pay) => {
    if (isNaN(pay) && pay !== '')
        return '';
    return parseInt(pay);
};

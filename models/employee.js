const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 40],
        message: 'Name must not exceed {ARGS[1]} characters.'
    })
];

const emailValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 40],
        message: 'Email must not exceed {ARGS[1]} characters.'
    }),
    validate({
        validator: 'isEmail',
        message: 'Email must be valid.'
    })
];

const deductionsvalidator = [
    //TODO: validator for deduction
];

const addressvalidator = [
    // TODO: address validator
];

const basesalaryvalidator = [
    //TODO: validator for base salary
];

const takehomepay = [
    //TODO: takehome pay validator
]

// Define the database model
const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        validate: nameValidator
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        validate: emailValidator
    },
    address: {
        type: String,
        validate: addressvalidator
    },
    basesalary: {
        type: Number,
        validate: basesalaryvalidator,
        required: [true, 'Base salary is required']
    },
    deductions: {
        type: String,
        validate: deductionsvalidator
    },
    takehomepay: {
        type: Number,
        validate: takehomepay,
        required: [true, 'Take home salary is required']
    }
});

// Use the unique validator plugin
EmployeeSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Employee = module.exports = mongoose.model('employee', EmployeeSchema);

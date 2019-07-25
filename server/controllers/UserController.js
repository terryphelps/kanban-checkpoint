import express from 'express'
import _userService from '../services/UserService';
import { Authorize } from '../middleware/authorize'


//PUBLIC
export default class AuthController {
    constructor() {
        this.router = express.Router()
            .use(Authorize.authenticated)
            .get('/', this.getUsers)
            .use(this.defaultRoute)
    }

    defaultRoute(req, res, next) {
        next({ status: 404, message: 'No Such Route' })
    }

    async getUsers(req, res, next) {
        try {
            let data = await _userService.find().select("-hash")
            return res.send(data)
        }
        catch (err) { next(err) }
    }

}



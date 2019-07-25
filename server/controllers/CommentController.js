import _commentService from '../services/CommentService'
import express from 'express'
import { Authorize } from '../middleware/authorize.js'
import socket from '../socket/index'

export default class CommentController {
  constructor() {
    this.router = express.Router()
      .use(Authorize.authenticated)
      .get('', this.getAll)
      .get('/:id', this.getById)
      .post('', this.create)
      .delete('/:id', this.delete)
      .use(this.defaultRoute)
  }

  defaultRoute(req, res, next) {
    next({ status: 404, message: 'No Such Route' })
  }

  async getAll(req, res, next) {
    try {
      let data = await _commentService.find({ authorId: req.session.uid })
      return res.send(data)
    }
    catch (err) { next(err) }
  }

  async getById(req, res, next) {
    try {
      let data = await _commentService.findOne({ _id: req.params.id, authorId: req.session.uid })

      return res.send(data)
    } catch (error) { next(error) }
  }

  async create(req, res, next) {
    try {
      req.body.authorId = req.session.uid
      let data = await _commentService.create(req.body)
      socket.notifyComment(data)
      return res.status(201).send(data)
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      // @ts-ignore
      let { boardId } = await _commentService.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
      socket.notifyDeleteComment({ _id: req.params.id, boardId })
      return res.send("Successfully deleted")
    } catch (error) { next(error) }
  }
}
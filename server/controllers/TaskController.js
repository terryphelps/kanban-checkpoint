import _taskService from '../services/TaskService'
import express from 'express'
import { Authorize } from '../middleware/authorize.js'
import _commentService from '../services/CommentService'
import socket from '../socket/index'

export default class TaskController {
  constructor() {
    this.router = express.Router()
      .use(Authorize.authenticated)
      .get('', this.getAll)
      .get('/:id', this.getById)
      .get('/:id/comments', this.getTaskComments)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
      .use(this.defaultRoute)
  }

  defaultRoute(req, res, next) {
    next({ status: 404, message: 'No Such Route' })
  }

  async getAll(req, res, next) {
    try {
      let data = await _taskService.find({ authorId: req.session.uid })
      return res.send(data)
    }
    catch (err) { next(err) }
  }

  async getById(req, res, next) {
    try {
      let data = await _taskService.findOne({ _id: req.params.id, authorId: req.session.uid })
      return res.send(data)
    } catch (error) { next(error) }
  }

  async getTaskComments(req, res, next) {
    try {
      let data = await _commentService.find({ taskId: req.params.id, authorId: req.session.uid })
      return res.send(data)
    } catch (error) { next(error) }
  }

  async create(req, res, next) {
    try {
      req.body.authorId = req.session.uid
      let data = await _taskService.create(req.body)
      socket.notifyTask(data)
      return res.status(201).send(data)
    } catch (error) { next(error) }
  }

  async edit(req, res, next) {
    try {
      let data = await _taskService.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      if (data) {
        socket.notifyTask(data)
        return res.send(data)
      }
      throw new Error("invalid id")
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      let { boardId } = await _taskService.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
      socket.notifyDeleteTask({ _id: req.params.id, boardId })
      return res.send("Successfully deleted")
    } catch (error) { next(error) }
  }
}
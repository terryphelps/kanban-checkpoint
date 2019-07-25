import _listService from '../services/ListService'
import express from 'express'
import { Authorize } from '../middleware/authorize.js'
import _taskService from '../services/TaskService'
import socket from '../socket/index'

export default class ListController {
  constructor() {
    this.router = express.Router()
      .use(Authorize.authenticated)
      .get('', this.getAll)
      .get('/:id', this.getById)
      .get('/:id/tasks', this.getListTasks)
      .post('', this.create)
      .delete('/:id', this.delete)
      .use(this.defaultRoute)
  }

  defaultRoute(req, res, next) {
    next({ status: 404, message: 'No Such Route' })
  }

  async getAll(req, res, next) {
    try {
      let data = await _listService.find({ authorId: req.session.uid })
      return res.send(data)
    }
    catch (err) { next(err) }
  }

  async getById(req, res, next) {
    try {
      let data = await _listService.findOne({ _id: req.params.id, authorId: req.session.uid })
      return res.send(data)
    } catch (error) { next(error) }
  }

  async getListTasks(req, res, next) {
    try {
      let data = await _taskService.find({ listId: req.params.id })
      return res.send(data)
    } catch (error) { next(error) }
  }

  async create(req, res, next) {
    try {
      req.body.authorId = req.session.uid
      let data = await _listService.create(req.body)
      socket.notifyList(data)
      return res.status(201).send(data)
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      let { boardId } = await _listService.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
      socket.notifyDeleteList({ _id: req.params.id, boardId })
      return res.send("Successfully deleted")
    } catch (error) { next(error) }
  }
}
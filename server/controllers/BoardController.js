import _boardService from '../services/BoardService'
import express from 'express'
import { Authorize } from '../middleware/authorize.js'
import _listService from '../services/ListService'
import _taskService from '../services/TaskService'
import _commentService from '../services/CommentService'
import socket from '../socket/index'

//PUBLIC
export default class BoardsController {
  constructor() {
    this.router = express.Router()
      .use(Authorize.authenticated)
      .get('', this.getAll)
      .get('/:id', this.getById)
      .get('/:id/lists', this.getBoardLists)
      .get('/:id/tasks', this.getBoardTasks)
      .get('/:id/comments', this.getBoardComments)
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
      //only gets boards by user who is logged in
      let data = await _boardService.find({ $or: [{ authorId: req.session.uid }, { collaborators: req.session.uid }] })
      return res.send(data)
    }
    catch (err) { next(err) }
  }

  async getById(req, res, next) {
    try {
      let data = await _boardService.findOne({ _id: req.params.id, $or: [{ authorId: req.session.uid }, { collaborators: req.session.uid }] })
      return res.send(data)
    } catch (error) { next(error) }
  }

  async getBoardLists(req, res, next) {
    try {
      let data = await _listService.find({ boardId: req.params.id })
      return res.send(data)
    } catch (error) { next(error) }
  }
  async getBoardTasks(req, res, next) {
    try {
      let data = await _taskService.find({ boardId: req.params.id })
      return res.send(data)
    } catch (error) { next(error) }
  }
  async getBoardComments(req, res, next) {
    try {
      let data = await _commentService.find({ boardId: req.params.id })
      return res.send(data)
    } catch (error) { next(error) }
  }

  async create(req, res, next) {
    try {
      req.body.authorId = req.session.uid
      let data = await _boardService.create(req.body)
      return res.status(201).send(data)
    } catch (error) { next(error) }
  }

  async edit(req, res, next) {
    try {
      let data = await _boardService.findOneAndUpdate({ _id: req.params.id, authorId: req.session.uid }, req.body, { new: true })
      let x = 1
      if (data) {
        socket.notifyChangeCollabs(data)
        return res.send(data)
      }


      throw new Error("invalid id")
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      let data = await _boardService.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
      socket.notifyDeleteBoard(data)
      return res.send("Successfully deleted")
    } catch (error) { next(error) }
  }
}



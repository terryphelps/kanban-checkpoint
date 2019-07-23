import mongoose from "mongoose"
import _listService from './ListService'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

// let _listRepo = new ListService().repository

let _schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  authorId: { type: ObjectId, ref: 'User', required: true }
}, { timestamps: true })

//CASCADE ON DELETE
_schema.pre('findOneAndRemove', function (next) {
  //lets find all the lists and remove them
  Promise.all([
    _listService.deleteMany({ boardId: this._conditions._id })
    _
  ])
    .then(() => next())
    .catch(err => next(err))
})

export default mongoose.model('Board', _schema)
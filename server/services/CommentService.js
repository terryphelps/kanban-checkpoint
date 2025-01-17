import mongoose from "mongoose"
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let _schema = new Schema({
  content: { type: String, required: true },
  taskId: { type: ObjectId, ref: 'Task', required: true },
  listId: { type: ObjectId, ref: 'List', required: true },
  authorId: { type: ObjectId, ref: 'User', required: true },
  boardId: { type: ObjectId, ref: 'Board', required: true }
}, { timestamps: true })

// //CASCADE ON DELETE
// _schema.pre('deleteMany', function (next) {
//   //lets find all the lists and remove them
//   Promise.all([
//     //_commentService.deleteMany({ taskId: this._conditions_id }),
//   ])
//     .then(() => next())
//     .catch(err => next(err))
// })

// //CASCADE ON DELETE
// _schema.pre('findOneAndRemove', function (next) {
//   //lets find all the lists and remove them
//   Promise.all([])
//     .then(() => next())
//     .catch(err => next(err))
// })

export default mongoose.model('Comment', _schema)
// const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   text: {
//     type: String,
//     required: [true, 'Comment text is required'],
//     trim: true,
//     maxlength: [500, 'Comment cannot be more than 500 characters']
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const issueSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   title: {
//     type: String,
//     required: [true, 'Please provide a title'],
//     trim: true,
//     maxlength: [100, 'Title cannot be more than 100 characters']
//   },
//   description: {
//     type: String,
//     required: [true, 'Please provide a description'],
//     trim: true,
//     maxlength: [2000, 'Description cannot be more than 2000 characters']
//   },
//   category: {
//     type: String,
//     required: [true, 'Please select a category'],
//     enum: {
//       values: ['Garbage', 'Water Leakage', 'Road Damage', 'Street Light', 'Other'],
//       message: '{VALUE} is not a valid category'
//     }
//   },
//   image: {
//     type: String,
//     required: [true, 'Please upload an image']
//   },
//   location: {
//     type: {
//       type: String,
//       enum: ['Point'],
//       default: 'Point'
//     },
//     coordinates: {
//       type: [Number],
//       required: [true, 'Please provide coordinates'],
//       validate: {
//         validator: function(value) {
//           return value.length === 2 && 
//                  value[0] >= -180 && value[0] <= 180 && 
//                  value[1] >= -90 && value[1] <= 90;
//         },
//         message: 'Invalid coordinates'
//       }
//     }
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'in_progress', 'resolved', 'rejected'],
//     default: 'pending'
//   },
//   resolvedImage: {
//     type: String
//   },
//   upvotes: {
//     type: Number,
//     default: 0
//   },
//   upvotedBy: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   comments: [commentSchema]
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Create indexes
// issueSchema.index({ location: '2dsphere' });
// issueSchema.index({ title: 'text', description: 'text' });
// issueSchema.index({ category: 1, status: 1, createdAt: -1 });

// // Prevent duplicate issues within 50 meters
// issueSchema.index({ 
//   location: '2dsphere',
//   title: 1,
//   createdAt: 1 
// });

// // Virtual for formatted address (can be implemented with reverse geocoding)
// issueSchema.virtual('address').get(function() {
//   return null; // Would require reverse geocoding service
// });

// module.exports = mongoose.model('Issue', issueSchema);


const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  likes: {
  type: Number,
  default: 0
},
likedBy: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const issueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: ['Garbage', 'Water Leakage', 'Road Damage', 'Street Light', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  },
  image: {
    type: String,
    required: [true, 'Please upload an image']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Please provide coordinates'],
      validate: {
        validator: function(value) {
          return value.length === 2 && 
                 value[0] >= -180 && value[0] <= 180 && 
                 value[1] >= -90 && value[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  statusNote: {
    type: String,
    trim: true,
    maxlength: [500, 'Note cannot be more than 500 characters']
  },
  resolvedImage: {
    type: String
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
issueSchema.index({ location: '2dsphere' });
issueSchema.index({ title: 'text', description: 'text' });
issueSchema.index({ category: 1, status: 1, createdAt: -1 });

// Prevent duplicate issues within 50 meters
issueSchema.index({ 
  location: '2dsphere',
  title: 1,
  createdAt: 1 
});

// Virtual for formatted address (can be implemented with reverse geocoding)
issueSchema.virtual('address').get(function() {
  return null; // Would require reverse geocoding service
});

module.exports = mongoose.model('Issue', issueSchema);
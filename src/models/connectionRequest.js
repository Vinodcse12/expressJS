const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not supported'
        }
    }
}, {
    timestamps: true,
});

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection to yourself");
    }

})

connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1

})

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequestModel;

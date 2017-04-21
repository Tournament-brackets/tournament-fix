let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create a model class
let sixteenPlayerModelSchema = new Schema ({
    playerName: String,
    Wins: Number,
    Losses: Number
})
let sixteenPlayerSchema = new Schema({
    rounds: [{
        round1: [{
            pair1: [sixteenPlayerModelSchema],
            pair2: [sixteenPlayerModelSchema],
            pair3: [sixteenPlayerModelSchema],
            pair4: [sixteenPlayerModelSchema],
            pair5: [sixteenPlayerModelSchema],
            pair6: [sixteenPlayerModelSchema],
            pair7: [sixteenPlayerModelSchema],
            pair8: [sixteenPlayerModelSchema]
        }],
        round2: [{
            pair9: [sixteenPlayerModelSchema],
            pair10: [sixteenPlayerModelSchema],
            pair11: [sixteenPlayerModelSchema],
            pair12: [sixteenPlayerModelSchema]
        }],
        round3: [{
            pair13: [sixteenPlayerModelSchema],
            pair14: [sixteenPlayerModelSchema]
        }],
        round4: [{
            pair15: [sixteenPlayerModelSchema]
        }],

        winner1: String, winner2: String, loser1: String
    }],
    userID: String
},
{
    collection: "tourney16"
});

module.exports = mongoose.model('tourney16', sixteenPlayerSchema);
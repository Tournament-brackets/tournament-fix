let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User

let tournament = require('../models/eightPlayer');

//check if authenticated
function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }
    next();
}

router.get('/', (req, res, next) => {
    res.render('content/eightPlayerBracket', {
        title: 'Tournament Bracket',
        username: req.user ? req.user.username : '',
        Tourney: newTourney   
    });
})

/* GET tourney page. */
router.get('/tournamentlist', requireAuth, (req, res, next) => {
    res.render('content/tournamentlist', {
        title: 'Tournament List',
        username: req.user ? req.user.username : ''
    });
});

/* GET tourney page. */
router.get('/eightPlayer', requireAuth, (req, res, next) => {
    res.render('content/eightPlayer', {
        title: '8 player Tournament',
        username: req.user ? req.user.username : ''
    });
});

/* POST Tourney Page - Process the tourney page */
router.post('/eightPlayer', requireAuth, (req, res, next) => {
    let object = {
        'rounds': [{
            'round1': [{
                'pair1': [
                    {
                        'playerName': req.body.player1, Wins: 0, Losses: 0
                    },
                    {
                        'playerName': req.body.player2, Wins: 0, Losses: 0
                    }
                ],
                'pair2': [
                    {
                        'playerName': req.body.player3, Wins: 0, Losses: 0
                    },
                    {
                        'playerName': req.body.player4, Wins: 0, Losses: 0
                    }
                ],
                'pair3': [
                    {
                        'playerName': req.body.player5, Wins: 0, Losses: 0
                    },
                    {
                        'playerName': req.body.player6, Wins: 0, Losses: 0
                    }
                ],   
                'pair4': [
                    {
                        'playerName': req.body.player7, Wins: 0, Losses: 0
                    },
                    {
                        'playerName': req.body.player8, Wins: 0, Losses: 0
                    }
                ]
            }],
            'round2': [{
                'pair5': [
                    {
                        'playerName': req.body.player9, Wins: 0, Losses: 0
                    },
                    {
                        'playerName': req.body.player10, Wins: 0, Losses: 0
                    }
                ],
                'pair6': [
                    {
                        'playerName': req.body.player11, Wins: 0, Losses: 0
                    },
                    {
                        'playerName': req.body.player12, Wins: 0, Losses: 0
                    }
                ]
            }],
            'round3': [{
                'pair7': [
                    {
                        'playerName': req.body.player13, Wins: 0, Losses: 0
                    },
                    {
                        'playerName': req.body.player14, Wins: 0, Losses: 0
                    }
                ]
            }],
            //'winner1': req.body.player1, 'status': req.body.status, 'title': req.body.eightManTitle
        }],
        userID: String
    }
    
    // new tournament
    let newtournament = tournament(object)
    

    tournament.create(newtournament, (err, tournament) => {
        console.log(JSON.stringify(tournament));
        if (err) {
            res.end(err);
        } else {
            res.redirect('/eightPlayerBracket/' + tournament._id);
        }
    })
});

/* GET bracket page. */
router.get('/:id', requireAuth, (req, res, next) => {

    console.log("before try");
    try {
        // get a reference to the id from the url
        let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

        // find one game by its id
        console.log("before find");
        tournament.findById(id, (err, newtournament) => {
            console.log("Inside if");
            if (err) {
                console.log(err);
                res.end(error);
            } else {
                // show the game details view
                res.render('content/eightPlayerBracket', {
                    title: 'Tournament Bracket',
                    username: req.user ? req.user.username : '',
                    tournament: newtournament,
                    TourneyString: JSON.stringify(newtournament)
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.redirect('/errors/404');
    }
});

router.post('/:id', requireAuth, (req, res, next) => {
    try {
        console.log(req.params.id);
        let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

        tournament.findById(id, (err, newtournament) => {
            if (err){
                res.end(error);
            } else {
                newtournament.rounds[0].round2[0].pair5[0].playerName= req.body.round2name1;
                newtournament.rounds[0].round2[0].pair5[1].playerName= req.body.round2name2;
                newtournament.rounds[0].round2[1].pair6[0].playerName= req.body.round2name3;
                newtournament.rounds[0].round2[1].pair6[1].playerName= req.body.round2name4;
                newtournament.rounds[0].round3[0].pair7[0].playerName= req.body.round3name1;
                newtournament.rounds[0].round3[0].pair7[1].playerName= req.body.round3name2;
                newtournament.rounds[0].winner1= req.body.winner;
                tournament.update({_id:id}, newTourney, function (err) {
                    if (err) {
                        res.end(err);
                    }
                    else{
                        res.redirect('/eightPlayerBracket/'+ newtournament._id);
                    }
                })   
            }
            })

            } catch (err) {
                console.log(err);
                res.redirect('/errors/404');
            }
});


module.exports = router;
const question = require('../controllers/question.server.controllers')
const auth = require('../lib/authentication')

module.exports = function (app) {

    app.route('/item/:item_id/question')
        .get(question.getQuestions)
        .post(auth.isAuthenticated, question.askQuestion);

    app.route('/question/:question_id')
        .post(auth.isAuthenticated, question.answerQuestion);
        
};
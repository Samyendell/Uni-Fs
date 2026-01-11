const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./db.sqlite');

const getQuestions = (itemId, done) => {
  const sql = `SELECT question_id, question, answer FROM questions WHERE item_id=? ORDER BY question_id DESC`;
  
  db.all(sql, [itemId], (err, rows) => {
    if (err) return done(err);
    done(false, rows);
  });
}

const getItemIdFromQuestion = (questionId, done) => {
  const sql = 'SELECT item_id FROM questions WHERE question_id=?';

  db.get(sql, [questionId], (err, row) => {
    if (err) return done(err);
    if (!row) return done(404);
    return done(false, row.item_id);
  })
}

const addAnswer = (answerData, done) => {
  const sql = 'UPDATE questions SET answer=? WHERE question_id=?';
  const values = [answerData.answerText, answerData.questionId];
  
  db.run(sql, values, (err) => {
    if (err) return done(err);
    return done(false);
  })
}

const addQuestion = (questionData, done) => {
  const sql = `INSERT INTO questions (item_id, asked_by, question) VALUES (?, ?, ?)`;
  const values = [questionData.itemId, questionData.askedBy, questionData.questionText];
  
  db.run(sql, values, function (err) {
    if (err) return done(err);
    return done(false);
  });
};

module.exports = {
  getQuestions,
  getItemIdFromQuestion,
  addQuestion,
  addAnswer,
};

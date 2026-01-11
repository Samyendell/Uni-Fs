const getQuestions = (itemId) => {
    return fetch(`http://localhost:3333/item/${itemId}/question`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        }
    })
    .then((response) => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 400 || response.status === 404 || response.status === 500) {
            return response.json().then(data => {
                throw data.error_message
            })
        } else {
            throw 'Failed to load questions'
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const askQuestion = (itemId, questionData) => {
    return fetch(`http://localhost:3333/item/${itemId}/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        },
        body: JSON.stringify(questionData)
    })
    .then((response) => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404 || response.status === 500) {
            return response.json().then(data => {
                throw data.error_message
            })
        } else {
            throw 'Failed to ask question'
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const answerQuestion = (questionId, answerData) => {
    return fetch(`http://localhost:3333/question/${questionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        },
        body: JSON.stringify(answerData)
    })
    .then((response) => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404 || response.status === 500) {
            return response.json().then(data => {
                throw data.error_message
            })
        } else {
            throw 'Failed to answer question'
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

export const questionService = { 
    getQuestions, 
    askQuestion, 
    answerQuestion 
}
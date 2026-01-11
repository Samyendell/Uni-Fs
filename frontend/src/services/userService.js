const login = (email, password) => {
    return fetch("http://localhost:3333/login", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 400 || response.status === 500) {
                return response.json().then(data => {
                    throw data.error_message
                })
            } else {
                throw 'Login failed'
            }
        })
        .then((resJson) => {
            localStorage.setItem("user_id", resJson.user_id)
            localStorage.setItem("session_token", resJson.session_token)
            return resJson
        })
        .catch((err) => {
            console.log("Err", err)
            return Promise.reject(err)
        })
}

const register = (first_name, last_name, email, password) => {
    return fetch("http://localhost:3333/users", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, password })
    })
        .then((response) => {
            if (response.status === 201) {
                return response.json()
            } else if (response.status === 400 || response.status === 500) {
                return response.json().then(data => {
                    let errorMessage = data.error_message

                    if (errorMessage.includes('fails to match the required pattern')) {
                        errorMessage = 'Password must contain at least one lowercase letter, uppercase letter, number, and special character'
                    }

                    throw errorMessage
                })
            } else {
                throw 'Registration failed'
            }
        })
        .catch((err) => {
            console.log("Err", err)
            return Promise.reject(err)
        })
}

const logout = () => {
    return fetch("http://localhost:3333/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
        .then((response) => {
            if (response.status === 200) {
                localStorage.removeItem("user_id")
                localStorage.removeItem("session_token")
                return
            } else if (response.status === 401 || response.status === 500) {
                return response.json().then(data => {
                    throw data.error_message
                })
            } else {
                throw "Logout failed"
            }
        })
        .catch((error) => {
            console.log("Err", error)
            return Promise.reject(error)
        })
}

const getUserProfile = (userId) => {
    return fetch(`http://localhost:3333/users/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 400 || response.status === 404 || response.status === 500) {
                return response.json().then(data => {
                    throw data.error_message
                })
            } else {
                throw "Failed to load profile"
            }
        })
        .catch((error) => {
            console.log("Err", error)
            return Promise.reject(error)
        })
}

export const userService = { login, register, logout, getUserProfile }
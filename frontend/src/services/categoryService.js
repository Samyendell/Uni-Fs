const getCategories = () => {
    return fetch("http://localhost:3333/categories")
        .then((response) => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 500) {
                return response.json().then(data => {
                    throw data.error_message
                })
            } else {
                throw 'Failed to load categories'
            }
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

export const categoryService = { getCategories }
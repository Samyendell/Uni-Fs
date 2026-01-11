const searchItems = (params = {}) => {
    const searchParams = new URLSearchParams()
    
    if (params.q) {
        searchParams.append('q', params.q)
    }
    
    if (params.status) {
        searchParams.append('status', params.status)
    }
    
    if (params.limit) {
        searchParams.append('limit', params.limit)
    }
    
    if (params.offset) {
        searchParams.append('offset', params.offset)
    }
    
    const url = searchParams.toString() 
        ? `http://localhost:3333/search?${searchParams.toString()}`
        : "http://localhost:3333/search"
    
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        }
    })
    .then((response) => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 400 || response.status === 401 || response.status === 500) {
            return response.json().then(data => {
                throw data.error_message
            })
        } else {
            throw 'Search failed'
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const getAllItems = () => {
    return fetch("http://localhost:3333/search")
    .then((response) => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 400 || response.status === 500) {
            return response.json().then(data => {
                throw data.error_message
            })
        } else {
            throw 'Failed to load items'
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const getSingleItem = (id) => {
    return fetch(`http://localhost:3333/item/${id}`)
    .then((response) => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 400 || response.status === 404 || response.status === 500) {
            return response.json().then(data => {
                throw data.error_message
            })
        } else {
            throw 'Failed to load item'
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const createItem = (itemData) => {
    return fetch("http://localhost:3333/item", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        },
        body: JSON.stringify(itemData)
    })
    .then((response) => {
        if (response.status === 201) {
            return response.json()
        } else if (response.status === 400 || response.status === 401 || response.status === 500) {
            return response.json().then(data => {
                throw data.error_message
            })
        } else {
            throw 'Failed to create item'
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const placeBid = (itemId, bidData) => {
    return fetch(`http://localhost:3333/item/${itemId}/bid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        },
        body: JSON.stringify(bidData)
    })
    .then((response) => {
        if (response.status === 201) {
            return response.json()
        } else if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404 || response.status === 500) {
            return response.json().then(data => {
                throw data.error_message
            })
        } else {
            throw 'Failed to place bid'
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const getBidHistory = (itemId) => {
    return fetch(`http://localhost:3333/item/${itemId}/bid`)
    .then((response) => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 400 || response.status === 404 || response.status === 500) {
            return response.json().then(data => {
                throw data.error_message
            })
        } else {
            throw 'Failed to load bid history'
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

export const coreService = { 
    searchItems, 
    getAllItems,
    getSingleItem, 
    createItem, 
    placeBid, 
    getBidHistory 
}
export const createRepo = (req, res) => {
    res.send('Create repo controller called');
}

export const getAllRepos = (req, res) => {
    res.send('Get all repos controller called');
}

export const fetchRepoById = (req, res) => {
    res.send('Fetch repo by ID controller called');
}

export const fetchRepoByName = (req, res) => {
    res.send('Fetch repo by name controller called');
}

export const getRepo = (req, res) => {
    res.send('Get repo controller called');
}

export const updateRepoById = (req, res) => {
    res.send('Update repo by ID controller called');
}

export const toggleVisById = (req, res) => {
    res.send('Toggle visibility by ID controller called');
}

export const deleteRepoById = (req, res) => {
    res.send('Delete repo by ID controller called');
}
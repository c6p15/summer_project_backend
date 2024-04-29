
const validateEmail = (email) => {
    return email.includes('@')
}

const validateUsername = (username) => {
    return username.length >= 4 && username.length <= 20
}

const validatePassword = (password) => {
    return password.length >= 8 && password.length <= 20
}

module.exports = { validateEmail, validateUsername, validatePassword }

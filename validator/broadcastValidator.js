const validateBName = (BName) => {

    if (!BName.trim()) {
        return "Template's name is required."
    }

    if (BName.length < 4) {
        return "Template's name must be at least 4 characters long."
    }
    if (BName.length > 20) {
        return "Template's name cannot exceed 20 characters."
    }

    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/
    if (!alphanumericRegex.test(BName)) {
        return "Template's name can only contain letters and numbers."
    }

    return true
}

module.exports = {
    validateBName,
}
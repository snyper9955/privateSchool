/**
 * Utility functions for validation
 */
exports.validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

exports.validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
};

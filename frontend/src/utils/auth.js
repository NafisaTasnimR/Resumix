export const getAuthToken = () =>
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('token') ||
    '';

export const clearAuthTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('token');
};

export const authHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isAuthError = (errorOrStatus) => {
    const status =
        typeof errorOrStatus === 'number'
            ? errorOrStatus
            : errorOrStatus?.response?.status;
    return status === 400 || status === 401 || status === 403;
};

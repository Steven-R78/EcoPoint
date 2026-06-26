function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

function isLoggedIn() {
    return Boolean(getToken());
}

async function apiRequest(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    const token = getToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data.error || data.message || 'Error en la solicitud';
        throw new Error(message);
    }

    return data;
}

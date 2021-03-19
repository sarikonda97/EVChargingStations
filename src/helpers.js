function RESTCaller(url, headers) {
    return fetch(url, { headers })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
            return data;
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('There was an error:', error);
        });
}

export default RESTCaller;

export async function saveGoogleKeepNote(data, token) {
    // const token = TokenService.getToken();

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    return fetch(`https://keep.googleapis.com/v1/notes`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .then((isSuccess) => {
        return Promise.resolve(isSuccess);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };
export const getLiveData = () => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'x-api-key': '54fe8ebf3480606c5539f1a5f91b7a4452e7677c',
    },
  };
  return fetch('https://iaq-api.brgr.rocks/live', requestOptions).then(
    (response) => response.json(),
  );
};

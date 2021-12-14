export const validateToken = async () => {
  const token = localStorage.token;
  if (!token) return false;
  const response: Response = await fetch('/api/auth/validate', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (data.success) {
    return true;
  } else {
    delete localStorage.token;
    delete localStorage.user;
    return false;
  }
};

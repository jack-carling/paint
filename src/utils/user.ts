export const validateToken = async () => {
  const token = localStorage.token;
  if (!token) return false;
  const response: Response = await fetch('/api/auth/validate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
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

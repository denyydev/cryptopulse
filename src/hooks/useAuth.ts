export const loginFake = (username: string, password: string) => {
  const users: Record<string, string> = { demo: "demo", alice: "123456" };
  if (users[username] === password) {
    localStorage.setItem("token", btoa(`${username}:${password}`));
    localStorage.setItem("username", username);
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
};

export const isAuthenticated = () => !!localStorage.getItem("token");
export const getUsername = () => localStorage.getItem("username") ?? "guest";

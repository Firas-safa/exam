export async function loginUser(credentials: { userName: string; password: string }) {
  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok && data.status === 200 && data.data.token) {
      const { token, user } = data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role.map((r: any) => r.roleName).join(","));
      localStorage.setItem("fullName", user.fullName); 
    }

    return data; 
  } catch (error) {
    return { status: 500, message: "Login failed. Please try again." };
  }
}
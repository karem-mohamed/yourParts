import { Hono, Context } from "hono";
import { registerUser, loginUser } from "../services/authService";

const authRouter = new Hono();

authRouter.post("/register", async (c: Context) => {
  const { username, email, password } = await c.req.json();
  const user = await registerUser(username, email, password);
  return c.json({ message: "User registered successfully", user });
});

authRouter.post("/login", async (c: Context) => {
  const { identifier, password } = await c.req.json();
  const token = await loginUser(identifier, password);
  return c.json({ message: "Login successful", token });
});

export default authRouter;

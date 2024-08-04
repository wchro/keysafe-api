import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export default userSchema;

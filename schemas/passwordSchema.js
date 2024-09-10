import { z } from "zod";

const passwordSchema = z.object({
  name: z.string(),
  account: z.string(),
  password: z.string(),
  site: z.string(),
});

export default passwordSchema;

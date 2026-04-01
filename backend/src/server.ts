import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, env.host, () => {
  console.log(`Backend running on http://${env.host}:${env.port}`);
});

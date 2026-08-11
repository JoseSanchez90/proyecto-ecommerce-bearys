import { createClient } from "@neondatabase/neon-js";

const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

export const neonData = createClient({
  auth: {
    url: import.meta.env.VITE_NEON_AUTH_URL,
    allowAnonymous: true,
  },
  dataApi: {
    url: dataApiUrl,
  },
});

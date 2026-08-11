import { useEffect, useState } from "react";
import {
  defaultSiteSettings,
  getSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getSiteSettings()
      .then((data) => {
        if (active) setSettings(data);
      })
      .catch((cause) => {
        console.warn("No se pudo cargar la configuracion del sitio", cause);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { settings, loading, setSettings };
}

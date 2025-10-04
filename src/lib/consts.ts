import { name, version } from "package";

export const INFO = {
  id: name,
  version,
  name: {
    ja: "シス研シンプルレジ",
    en: "Sysken Simple Register",
  },
  word: {
  },
  config: {
    localStorageVersion: 1,
  },
} as const;

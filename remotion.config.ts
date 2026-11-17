// Las dependencias viven fuera de Google Drive (Drive no admite enlaces ni sincroniza bien miles de archivos).
// Si existe la carpeta local, webpack busca ahí los módulos. En un clon normal (con node_modules propio) no cambia nada.
import { Config } from "@remotion/cli/config";
import fs from "fs";
import os from "os";
import path from "path";

const DEPS = path.join(os.homedir(), "leoelpasado-deps", "node_modules");

if (fs.existsSync(DEPS)) {
  Config.overrideWebpackConfig((c) => ({
    ...c,
    resolve: { ...c.resolve, modules: [...(c.resolve?.modules ?? ["node_modules"]), DEPS] },
    resolveLoader: { ...c.resolveLoader, modules: [...(c.resolveLoader?.modules ?? ["node_modules"]), DEPS] },
  }));
}

# Skills de video para agentes

Herramientas de terceros que usa este proyecto, guardadas aquí para instalarlas en cualquier equipo. No son parte de la plantilla de @leoelpasado: la plantilla sigue en `src/` y `scripts/`.

| Carpeta | Qué es | Origen | Commit de origen | Licencia |
|---|---|---|---|---|
| `bang-motion/` | Motion graphics en HTML + GSAP (opener, explainer, bumper) | github.com/bangtutorial/bang-motion (v1.19.0) | c1aa65e | MIT (`bang-motion/LICENSE`) |
| `reelmimic/` | 36 skills de ReelMimic (`video-clone` es la entrada; el resto son motores de producción) | github.com/edenfunf/reelmimic (`.claude/skills`) | 0eab75a | MIT (`licencias/reelmimic/`) |
| Remotion | Skills oficiales de Remotion | github.com/remotion-dev/skills | 6f55706 | **No se copian aquí**: ese repositorio no declara licencia y este es público. Se instalan desde el origen (ver abajo). |

## Instalar en Claude Code (Windows)

```powershell
$dst = "$env:USERPROFILE\.claude\skills"
Copy-Item .\skills\bang-motion -Destination $dst -Recurse -Force
Get-ChildItem .\skills\reelmimic -Directory | ForEach-Object { Copy-Item $_.FullName -Destination $dst -Recurse -Force }
git clone --depth 1 https://github.com/remotion-dev/skills $env:TEMP\remotion-skills
Copy-Item $env:TEMP\remotion-skills\skills\remotion-best-practices -Destination $dst -Recurse -Force
```

## Notas

- Varias skills de ReelMimic asumen el proyecto ReelMimic completo (`app/`, `.claude/harness/`). Sin él sirven como referencia de técnica.
- Sin `node_modules` ni `.git`. Para actualizar, volver a copiar desde el origen y anotar el commit nuevo en esta tabla.

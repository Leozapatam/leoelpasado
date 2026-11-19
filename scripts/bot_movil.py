#!/usr/bin/env python3
"""
Bot móvil de Telegram para @leoelpasado.
Permite interactuar con la fábrica de videos desde el celular:
- Recibe audios/notas de voz y los transcribe con Whisper localmente.
- Valida episodios (validar.py).
- Genera hojas de contacto y envía los fotogramas al chat de Telegram.
- Registra notas e ideas de investigación directo en el proyecto.
"""

import os
import sys
import time
import json
import subprocess
from pathlib import Path
import requests

RAIZ = Path(__file__).resolve().parent.parent
CONFIG_PATH = RAIZ / "bot_config.json"

def cargar_config():
    if not CONFIG_PATH.exists():
        plantilla = {
            "bot_token": "PEGA_AQUI_TU_TOKEN_DE_BOTFATHER",
            "allowed_user_ids": [1257335492],
            "episodio_activo": "capitulo-0"
        }
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(plantilla, f, indent=2, ensure_ascii=False)
        return plantilla

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def guardar_config(config):
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)

class LeoBot:
    def __init__(self, token, allowed_ids):
        self.token = token
        self.allowed_ids = allowed_ids
        self.base_url = f"https://api.telegram.org/bot{self.token}"
        self.config = cargar_config()
        self.slug = self.config.get("episodio_activo", "capitulo-0")

    def enviar_mensaje(self, chat_id, texto, reply_markup=None):
        url = f"{self.base_url}/sendMessage"
        # Telegram max length is 4096 chars
        partes = [texto[i:i+4000] for i in range(0, len(texto), 4000)]
        for parte in partes:
            payload = {
                "chat_id": chat_id,
                "text": parte,
                "parse_mode": "Markdown"
            }
            if reply_markup:
                payload["reply_markup"] = reply_markup
            try:
                res = requests.post(url, json=payload, timeout=10)
                if not res.ok:
                    # Retry without markdown if markdown parsing failed
                    payload.pop("parse_mode", None)
                    requests.post(url, json=payload, timeout=10)
            except Exception as e:
                print(f"[Error enviando mensaje]: {e}")

    def enviar_foto(self, chat_id, ruta_imagen, caption=""):
        url = f"{self.base_url}/sendPhoto"
        try:
            with open(ruta_imagen, "rb") as f:
                requests.post(
                    url,
                    data={"chat_id": chat_id, "caption": caption[:1024]},
                    files={"photo": f},
                    timeout=30
                )
        except Exception as e:
            print(f"[Error enviando foto]: {e}")

    def descargar_archivo(self, file_id, destino):
        res_info = requests.get(f"{self.base_url}/getFile?file_id={file_id}", timeout=10).json()
        if not res_info.get("ok"):
            return False
        file_path = res_info["result"]["file_path"]
        download_url = f"https://api.telegram.org/file/bot{self.token}/{file_path}"
        
        destino.parent.mkdir(parents=True, exist_ok=True)
        r = requests.get(download_url, stream=True, timeout=60)
        with open(destino, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        return True

    def procesar_comando(self, chat_id, texto):
        partes = texto.strip().split()
        cmd = partes[0].lower()
        args = partes[1:]

        if cmd in ["/start", "/ayuda"]:
            msg = (
                "👋 *Fábrica de Videos @leoelpasado*\n\n"
                f"📌 *Episodio activo:* `{self.slug}`\n\n"
                "🛠 *Comandos disponibles:*\n"
                "• `/episodio <slug>` — Cambia el episodio activo\n"
                "• `/estado` — Ver estado del episodio y archivos\n"
                "• `/validar [slug]` — Corre el validador estricto\n"
                "• `/hoja [slug] [segundos]` — Genera y envía fotogramas al móvil\n"
                "• `/guion [slug]` — Ver guion del episodio\n\n"
                "🎙 *Notas de voz / Audios:* Envíame cualquier audio y lo transcribiré localmente.\n"
                "📝 *Notas de texto:* Cualquier texto normal se guarda como nota de investigación."
            )
            self.enviar_mensaje(chat_id, msg)

        elif cmd == "/episodio":
            if not args:
                self.enviar_mensaje(chat_id, f"Episodio actual: `{self.slug}`\nUso: `/episodio <nuevo-slug>`")
            else:
                self.slug = args[0]
                self.config["episodio_activo"] = self.slug
                guardar_config(self.config)
                self.enviar_mensaje(chat_id, f"✅ Episodio activo cambiado a: `{self.slug}`")

        elif cmd == "/estado":
            dir_ep = RAIZ / "public" / "episodios" / self.slug
            if not dir_ep.exists():
                self.enviar_mensaje(chat_id, f"⚠️ El episodio `{self.slug}` no tiene carpeta en `public/episodios/`")
                return
            archivos = [f.name for f in dir_ep.iterdir()]
            msg = f"📂 *Estado de `{self.slug}`:*\n"
            msg += "\n".join([f"• `{a}`" for a in sorted(archivos)])
            self.enviar_mensaje(chat_id, msg)

        elif cmd == "/validar":
            target = args[0] if args else self.slug
            self.enviar_mensaje(chat_id, f"🔍 Validando `{target}`...")
            cmd_exec = [sys.executable, str(RAIZ / "scripts" / "validar.py"), target]
            res = subprocess.run(cmd_exec, capture_output=True, text=True, cwd=str(RAIZ))
            salida = res.stdout if res.stdout else res.stderr
            if res.returncode == 0:
                self.enviar_mensaje(chat_id, f"✅ *Validación exitosa:*\n```\n{salida.strip()}\n```")
            else:
                self.enviar_mensaje(chat_id, f"❌ *Errores encontrados:*\n```\n{salida.strip()}\n```")

        elif cmd == "/hoja":
            target = args[0] if args else self.slug
            segundos = args[1] if len(args) > 1 else "3,30,60,100"
            self.enviar_mensaje(chat_id, f"📸 Generando fotogramas de `{target}` en segundos: {segundos}...")
            
            cmd_exec = ["node", str(RAIZ / "scripts" / "hoja.js"), target, segundos, "--guias"]
            res = subprocess.run(cmd_exec, capture_output=True, text=True, cwd=str(RAIZ), shell=True)
            
            hoja_dir = RAIZ / "out" / f"hoja-{target}"
            if hoja_dir.exists():
                imagenes = sorted(hoja_dir.glob("*.png"))
                if imagenes:
                    for img in imagenes:
                        self.enviar_foto(chat_id, img, caption=f"{target} · {img.name}")
                    return
            
            self.enviar_mensaje(chat_id, f"Resultado:\n```\n{res.stdout or res.stderr}\n```")

        elif cmd == "/guion":
            target = args[0] if args else self.slug
            guion_path = RAIZ / "guion.md"
            if guion_path.exists():
                texto_guion = guion_path.read_text(encoding="utf-8")
                self.enviar_mensaje(chat_id, f"📜 *Guion actual:*\n\n{texto_guion}")
            else:
                self.enviar_mensaje(chat_id, "⚠️ No se encontró `guion.md` en la raíz.")

        else:
            self.enviar_mensaje(chat_id, f"Comando no reconocido: `{cmd}`. Usa `/ayuda`.")

    def procesar_audio(self, chat_id, file_id, ext="wav"):
        self.enviar_mensaje(chat_id, "⏳ Descargando audio en la PC...")
        nombre_archivo = f"voz_movil_{int(time.time())}.{ext}"
        destino = RAIZ / "grabaciones" / nombre_archivo
        
        if not self.descargar_archivo(file_id, destino):
            self.enviar_mensaje(chat_id, "❌ Error al descargar el archivo.")
            return

        self.enviar_mensaje(chat_id, f"🎙 Transcribiendo `{nombre_archivo}` con Whisper local...")
        try:
            from faster_whisper import WhisperModel
            # Modelo base o small para respuesta ágil al celular
            modelo = WhisperModel("base", device="cpu", compute_type="int8")
            segments, info = modelo.transcribe(str(destino), language="es")
            texto = " ".join([seg.text.strip() for seg in segments])
            duracion = round(info.duration, 1)

            resp = (
                f"✅ *Audio procesado* ({duracion}s):\n\n"
                f"📝 *Transcripción:*\n«{texto}»\n\n"
                f"Guardado en: `grabaciones/{nombre_archivo}`"
            )
            self.enviar_mensaje(chat_id, resp)
        except Exception as e:
            self.enviar_mensaje(chat_id, f"⚠️ Audio guardado en `grabaciones/{nombre_archivo}`, pero falló la transcripción: {e}")

    def procesar_con_antigravity(self, chat_id, texto_usuario):
        conv_id = self.config.get("conversation_id", "467aba25-03f7-4f22-b440-c9e1a7e531ef")
        transcript_path = RAIZ.parent / "brain" / conv_id / ".system_generated" / "logs" / "transcript.jsonl"
        
        # Guardar la cantidad de líneas actuales del transcript
        lineas_iniciales = 0
        if transcript_path.exists():
            with open(transcript_path, "r", encoding="utf-8") as f:
                lineas_iniciales = sum(1 for _ in f)

        self.enviar_mensaje(chat_id, "🧠 *Antigravity pensando...*")
        
        # Enviar mensaje al agente
        cmd_send = ["agentapi", "send-message", conv_id, f"[Leo desde Telegram]: {texto_usuario}"]
        res = subprocess.run(cmd_send, capture_output=True, text=True, shell=True)
        if res.returncode != 0:
            self.enviar_mensaje(chat_id, f"⚠️ Error al conectar con Antigravity: {res.stderr}")
            return

        # Esperar respuesta en transcript.jsonl (hasta 120 segundos)
        t_inicio = time.time()
        ultimo_texto = None
        while time.time() - t_inicio < 120:
            time.sleep(2)
            if not transcript_path.exists():
                continue
            with open(transcript_path, "r", encoding="utf-8") as f:
                lineas = [l.strip() for l in f if l.strip()]
            
            if len(lineas) > lineas_iniciales:
                # Revisar las nuevas líneas desde lineas_iniciales
                nuevas = lineas[lineas_iniciales:]
                for linea in reversed(nuevas):
                    try:
                        obj = json.loads(linea)
                        # Buscamos un PLANNER_RESPONSE con contenido de texto final (sin llamadas a herramientas pendientes)
                        if obj.get("source") == "MODEL" and obj.get("type") == "PLANNER_RESPONSE" and obj.get("status") == "DONE":
                            tool_calls = obj.get("tool_calls", [])
                            content = obj.get("content", "").strip()
                            if content and not tool_calls:
                                ultimo_texto = content
                                break
                    except Exception:
                        pass
                if ultimo_texto:
                    break

        if ultimo_texto:
            self.enviar_mensaje(chat_id, ultimo_texto)
        else:
            self.enviar_mensaje(chat_id, "⏳ Antigravity recibió tu mensaje y está ejecutando herramientas en segundo plano en tu PC.")

    def iniciar(self):
        print(f"🤖 Bot de @leoelpasado activo. Escuchando en Telegram...")
        offset = None
        while True:
            try:
                url = f"{self.base_url}/getUpdates?timeout=30"
                if offset:
                    url += f"&offset={offset}"
                res = requests.get(url, timeout=40).json()
                if not res.get("ok"):
                    time.sleep(5)
                    continue

                for update in res.get("result", []):
                    offset = update["update_id"] + 1
                    msg = update.get("message")
                    if not msg:
                        continue

                    user_id = msg.get("from", {}).get("id")
                    chat_id = msg.get("chat", {}).get("id")

                    if self.allowed_ids and user_id not in self.allowed_ids:
                        print(f"[Intento no autorizado de ID {user_id}]")
                        self.enviar_mensaje(chat_id, "⛔ Acceso no autorizado.")
                        continue

                    if "text" in msg:
                        texto = msg["text"]
                        if texto.startswith("/"):
                            self.procesar_comando(chat_id, texto)
                        else:
                            self.procesar_con_antigravity(chat_id, texto)

                    elif "voice" in msg:
                        file_id = msg["voice"]["file_id"]
                        self.procesar_audio(chat_id, file_id, ext="ogg")

                    elif "audio" in msg:
                        file_id = msg["audio"]["file_id"]
                        ext = msg["audio"].get("file_name", "audio.mp3").split(".")[-1]
                        self.procesar_audio(chat_id, file_id, ext=ext)

            except requests.exceptions.RequestException:
                time.sleep(5)
            except Exception as e:
                print(f"[Error loop]: {e}")
                time.sleep(3)

if __name__ == "__main__":
    cfg = cargar_config()
    token = cfg.get("bot_token")
    if not token or token == "PEGA_AQUI_TU_TOKEN_DE_BOTFATHER":
        print("ERROR: Por favor coloca tu bot_token en bot_config.json")
        sys.exit(1)

    bot = LeoBot(token=token, allowed_ids=cfg.get("allowed_user_ids", []))
    bot.iniciar()

# Guía de Contribución — RD Job Visualizer

> Challenge de 7 Días | Sanba Development | Entrega: Viernes 27 de Marzo 2026

---

## Cómo contribuir

### 1. Elige una tarea del backlog

Abre `BACKLOG.md` y busca tareas con `[ ]` (pendientes). Elige una que se alinee con tus habilidades.

### 2. Crea tu branch

```bash
git checkout master
git pull origin master
git checkout -b feat/tu-descripcion-corta
```

**Convención de nombres:**
- `feat/nombre-de-la-tarea` — para nuevas funcionalidades
- `fix/descripcion-del-bug` — para correcciones
- `data/descripcion` — para trabajo de datos/procesamiento

### 3. Trabaja en tu tarea

- Lee `CLAUDE.md` y `ORCHESTRATOR.md` para entender el proyecto
- Solo modifica los archivos relevantes a tu tarea
- Sigue las convenciones del proyecto (ver abajo)

### 4. Commit y push

```bash
git add archivos-modificados
git commit -m "Descripción clara del cambio"
git push -u origin feat/tu-descripcion-corta
```

### 5. Crea un Pull Request

```bash
gh pr create --title "Título corto del PR" --body "Descripción de lo que hiciste"
```

O desde GitHub directamente.

### 6. Espera review

Se necesita **al menos 1 aprobación** para mergear a master. Cualquier miembro del equipo puede revisar.

---

## Reglas importantes

### Lo que NO puedes hacer
- **NO hagas push directo a master** — master está protegido, requiere PR + review
- **NO modifiques archivos de otros PRs abiertos** — coordina si hay overlap
- **NO borres datos** de `data/raw/` o `data/participants.json`
- **NO cambies `CLAUDE.md` o `ORCHESTRATOR.md`** sin hablar con Erick primero

### Lo que SÍ debes hacer
- **Actualiza `BACKLOG.md`** cuando completes una tarea (cambia `[ ]` a `[x]` y agrega nota)
- **Prueba antes de hacer PR** — `npx serve .` y verifica en el navegador
- **PRs pequeños y enfocados** — un PR por tarea, no mezcles cambios
- **Describe tu PR** — qué hiciste, qué archivos tocaste, cómo probarlo

---

## Convenciones del proyecto

| Aspecto | Convención |
|---------|-----------|
| **UI** | Todo en español |
| **Código** | Variables en inglés, strings UI en español |
| **Archivos** | kebab-case (`mi-archivo.js`) |
| **Commits** | Inglés o español, descriptivos |
| **CSS** | Tailwind via CDN (no instalar nada) |
| **JS** | Inline en el HTML (no módulos externos por ahora) |
| **Datos** | JSON para output, CSV/XLSX en raw |

## Stack (CDN, no instalar nada)

- Tailwind CSS, Lucide Icons, Plus Jakarta Sans, Marked.js, PapaParse
- Todo corre como HTML estático — `npx serve .` para desarrollo local

## Archivos clave

| Archivo | Qué es | ¿Puedo editarlo? |
|---------|--------|-------------------|
| `index.html` | Landing principal | Si, con cuidado |
| `explorer.html` | Data Explorer | Si |
| `BACKLOG.md` | Tareas pendientes | Si — marcar completadas |
| `CLAUDE.md` | Guía para Claude Code | Solo Erick |
| `ORCHESTRATOR.md` | Resumen de arquitectura | Solo Erick |
| `data/participants.json` | Base de datos del equipo | Solo via `/participant-intake` |
| `data/raw/*` | Datos crudos descargados | No borrar, si agregar |
| `data/schemas/*` | Schema normalizado | Si, con review |

## Usando Claude Code

Si usas Claude Code en este repo, él leerá `CLAUDE.md` automáticamente y entenderá el proyecto. Puedes pedirle:

- "Muéstrame las tareas pendientes del backlog"
- "Quiero trabajar en la tarea 2.3"
- "Crea un branch y haz PR cuando termines"

Claude creará el branch, trabajará en la tarea, y te ayudará con el PR.

---

## ¿Preguntas?

Escríbele a Erick por WhatsApp o abre un Issue en GitHub.

# Participant Intake

Registrar o actualizar un participante del challenge RD Job Visualizer.

## Instrucciones

1. **Lee `data/participants.json`** para cargar el registro actual de participantes.

2. **Analiza la información proporcionada por el usuario en `$ARGUMENTS`**. Puede ser:
   - Un nombre y datos sueltos (ej: "Juan Pérez, frontend dev, GitHub: juanp")
   - Una URL de LinkedIn (ej: "https://linkedin.com/in/juanperez") — intenta fetch para extraer datos
   - Texto copiado de un perfil o mensaje (ej: lo que alguien escribió en WhatsApp)
   - Una combinación de todo lo anterior

3. **Extrae y normaliza** los siguientes campos (deja `null` los que no estén disponibles):
   - `id`: slug único generado del nombre (ej: "erick-santana")
   - `name`: Nombre completo
   - `headline`: Título profesional / headline
   - `current_role`: Puesto actual
   - `current_company`: Empresa actual
   - `location`: Ciudad/país
   - `bio`: Breve descripción (1-2 oraciones)
   - `challenge_role`: Rol asignado en el challenge (de PROJECT_PLAN.md: Ing. Datos, Frontend, Analytics, UX/UI, Investigación, Contenido, Gestión)
   - `status`: "confirmed" | "interested" | "pending"
   - `skills`: Array de habilidades relevantes
   - `socials`: Objeto con `linkedin`, `github`, `twitter`, `website`, `email`
   - `photo_url`: URL de foto de perfil (o `null`)
   - `joined_at`: Fecha ISO de registro
   - `updated_at`: Fecha ISO de última actualización

4. **Si el participante ya existe** (match por `id` o `name`), **actualiza** solo los campos que tengan nueva información. No sobreescribir datos existentes con `null`.

5. **Si es nuevo**, agrégalo al array.

6. **Escribe el JSON actualizado** en `data/participants.json` con formato legible (2-space indent).

7. **Actualiza `BACKLOG.md`**: si el participante es nuevo, agrégalo a la lista de participantes conocidos bajo la tarea X.1.

8. **Muestra un resumen** de lo que se registró/actualizó, indicando campos que quedaron como `null` o TBD para completar después.

/*:
 * @plugindesc Injects notetags into RPG Maker MV database entries from a JSON object.
 * @author Gemini
 * @help
 * ============================================================================
 * What this plugin does:
 * ============================================================================
 * This plugin reads a JSON string from its parameters and injects the
 * specified notetags into the notes of various database entries, including
 * Actors, Classes, Skills, Items, Weapons, Armors, Enemies, and States.
 *
 * This allows you to manage all custom notetags for a large project from a
 * single, easy-to-edit location, rather than manually editing each entry
 * in the RPG Maker MV database editor.
 *
 * ============================================================================
 * Instructions:
 * ============================================================================
 * 1. Place this plugin at the very top of your plugin list in the Plugin Manager.
 * This ensures the notetags are injected before any other plugins try to read them.
 *
 * 2. Edit the JSON data directly inside the plugin file using an IDE.
 *
 * 3. The JSON should be an array of objects. Each object must have three properties:
 * - "category": A string specifying the database category.
 * Valid values are: "actor", "class", "skill", "item", "weapon", "armor", "enemy", "state"
 * - "id": The ID number of the database entry (e.g., the Actor ID, Skill ID, etc.).
 * - "note": The custom text to be appended to the entry's notes.
 *
 * 4. The plugin will automatically append the custom note to the existing notes of
 * the database entry, separated by a newline.
 *
 * ============================================================================
 * Notetag Data: Edit this section
 * ============================================================================
 *
 * Please check for syntax errors when editing the JSON data.
 *
 * Example JSON:
 * [
 * {
 * "category": "actor",
 * "id": 1,
 * "note": `
 * <customTag_actor1>
 * <otherTag: 123>
 * `
 * },
 * {
 * "category": "skill",
 * "id": 5,
 * "note": "<skill_special_effect>"
 * },
 * {
 * "category": "enemy",
 * "id": 3,
 * "note": "<drops_rare_item>"
 * }
 * ]
 *
 */

(function () {
  /**
   * @constant {Array<Object>}
   * @description Notetag data to be injected into the database.
   * Edit this JSON array to add your custom notetags.
   */
  const notesToAppend = [
    // Example entries:
    {
      category: "actor",
      id: 1,
      note: `<Observe Description>
      This \\C[2]dangerous\\C[0] enemy has high defense.
      \\I[64] Weak to fire magic.
      </Observe Description>`,
    },
  ];

  // Helper function to get the correct database based on the category string
  function getDatabase(category) {
    switch (category.toLowerCase()) {
      case "actor":
      case "actors":
        return $dataActors;
      case "class":
      case "classes":
        return $dataClasses;
      case "skill":
      case "skills":
        return $dataSkills;
      case "item":
      case "items":
        return $dataItems;
      case "weapon":
      case "weapons":
        return $dataWeapons;
      case "armor":
      case "armors":
        return $dataArmors;
      case "enemy":
      case "enemies":
        return $dataEnemies;
      case "state":
      case "states":
        return $dataStates;
      default:
        return null;
    }
  }

  // Overwrite the DataManager.isDatabaseLoaded function
  var _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function () {
    // Call the original function first to ensure the database is loaded
    if (!_DataManager_isDatabaseLoaded.call(this)) return false;

    try {
      // Loop through each entry in the JSON array
      notesToAppend.forEach(function (entry) {
        var category = entry.category;
        var id = entry.id;
        var note = entry.note;

        // Validate that the entry has the required properties
        if (category && id && note) {
          var database = getDatabase(category);

          // Check if the database and the specific entry exist
          if (database && database[id]) {
            // Clean up the note string by removing extra whitespace and newlines
            var cleanedNote = note.replace(/\s+/g, " ").trim();

            // Append the new note, ensuring a newline separator
            var currentNote = database[id].note;
            if (currentNote.length > 0) {
              database[id].note = currentNote + "\n" + cleanedNote;
            } else {
              database[id].note = cleanedNote;
            }
          } else {
            // Log a warning if the entry is not found
            console.warn(
              "HAUNTER_NotetagInjector: Could not find " +
                category +
                " with ID " +
                id +
                ". Check your JSON data."
            );
          }
        } else {
          // Log a warning if the JSON entry is malformed
          console.warn(
            "HAUNTER_NotetagInjector: Malformed JSON entry. Each entry must have 'category', 'id', and 'note'.",
            entry
          );
        }
      });

      console.log("HAUNTER_NotetagInjector: Notetags successfully injected.");
    } catch (e) {
      // Log a detailed error if the JSON is invalid
      console.error(
        "HAUNTER_NotetagInjector: Failed to process notetag data. Please check for syntax errors in your JSON.",
        e
      );
    }

    // Return true to signal that the database is loaded and ready
    return true;
  };
})();

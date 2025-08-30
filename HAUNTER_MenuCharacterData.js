/*:
 * @plugindesc Holds character portrait and dialogue data for HAUNTER_OverlayCommandWindow.js.
 * @author: Haunter
 *
 * @help
 * This plugin does not contain executable code itself.
 * It is solely used to store data for the HAUNTER_OverlayCommandWindow.js plugin.
 *
 * Ensure this plugin is placed *above* HAUNTER_OverlayCommandWindow.js
 * in the Plugin Manager list.
 *
 * You can edit the 'HAUNTER_MenuCharacterData' array below to add, remove,
 * or modify character entries and their dialogue phrases.
 *
 * Each entry should be an object with the following properties:
 * - actorId: The database ID of the actor (e.g., 1 for Actor1).
 * - imageName: The filename of the portrait image (e.g., "Actor1_Menu").
 * Place these images in your 'img/pictures/' folder (or the folder
 * specified in the main plugin's parameters).
 * - phrases: An array of strings, where each string is a possible
 * dialogue line for this character.
 *
 * Example Structure:
 * HAUNTER_MenuCharacterData = [
 * {
 * "actorId": 1,
 * "imageName": "Actor1_Menu",
 * "phrases": [
 * "Welcome, commander!",
 * "Ready for adventure!",
 * "What's our next move?"
 * ]
 * },
 * {
 * "actorId": 2,
 * "imageName": "Actor2_Menu",
 * "phrases": [
 * "Hmph, let's get this over with.",
 * "Another day, another battle.",
 * "Don't get in my way."
 * ]
 * }
 * ];
 */

// ===========================================================================
// *** IMPORTANT ***
// Place this plugin *above* HAUNTER_OverlayCommandWindow.js in the Plugin Manager.
// ===========================================================================

// Define the global array that will hold your character data.
// You can edit this array directly using any text editor (like Notepad, VS Code).
// --- EXAMPLE CHARACTER 1 ---
var HAUNTER_MenuCharacterData = [
  {
    actorId: 2, // Actor ID corresponding to the character
    imageName: "MenuVincent", // Image in img/pictures/
    phrases: [
      {
        text: "I have to show my new \ntrick to Will... Just in case.",
        voicelineFile: "VincentTrick", // This phrase has a voiceline
        weight: 20, // 60% chance for this specific phrase to be chosen
      },
      {
        text: "I’ve been told I hum in my \nsleep. Well... Just don’t tell\nanyone.",
        voicelineFile: "VincentHumming", // This phrase also has a voiceline
        weight: 30, // 30% chance for this phrase
      },
      {
        text: "Camila's voice never fails to\nimpress... If only I could\nsing...",
        voicelineFile: "VincentVoice", // No 'voicelineFile' property, so no voiceline will play for this phrase.
        weight: 10, // 10% chance for this phrase
      },
      {
        text: "If I fall before you, don’t look\nback. Some burdens are mine\nalone.",
        voicelineFile: "VincentDontLookBack",
        weight: 30, // Another phrase, adjust weights so they total 100 or relative
      },
      {
        text: "If you see me smiling, it’s not\na trick. I promise.",
        voicelineFile: "VincentSmile",
        weight: 10, // Another phrase, adjust weights so they total 100 or relative
      },
    ],
  },
  {
    actorId: 3, // Actor ID corresponding to the character
    imageName: "MenuCamila", // Image in img/pictures/
    phrases: [
      {
        text: "I sdsd to show my new \ntrick to Will... Just in case.",
        voicelineFile: "VincentTrick", // This phrase has a voiceline
        weight: 100, // 60% chance for this specific phrase to be chosen
      },
      {
        text: "I’ve been told I hum in my \nsleep. Well... Just don’t tell\nanyone.",
        voicelineFile: "VincentHumming", // This phrase also has a voiceline
        weight: 0, // 30% chance for this phrase
      },
      {
        text: "Camila's voice never fails to\nimpress... If only I could\nsing...",
        voicelineFile: "VincentVoice", // No 'voicelineFile' property, so no voiceline will play for this phrase.
        weight: 0, // 10% chance for this phrase
      },
      {
        text: "If I fall before you, don’t look\nback. Some burdens are mine\nalone.",
        voicelineFile: "VincentDontLookBack",
        weight: 0, // Another phrase, adjust weights so they total 100 or relative
      },
      {
        text: "If you see me smiling, it’s not\na trick. I promise.",
        voicelineFile: "VincentSmile",
        weight: 0, // Another phrase, adjust weights so they total 100 or relative
      },
    ],
  },
  // Add more characters as needed
];

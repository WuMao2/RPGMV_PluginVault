/*:
 * @target MZ MV
 * @plugindesc Moves a specific skill into the Actor Command Window (removes it from the Skill List in battle).
 * @author Haunter
 *
 * @param Skill ID
 * @type skill
 * @desc The skill ID to move from the skill list to the actor command window.
 * @default 1
 *
 * @help
 * This plugin moves a skill out of the Skill menu and into the actor
 * command window in battle.
 *
 * Example: If you set Skill ID = 10, then "Fire" will show directly as a
 * command next to Attack/Guard, and will NOT be listed inside the skill menu.
 *
 * Works in both RPG Maker MV and MZ.
 */

(() => {
  const parameters = PluginManager.parameters("HAUNTER_SkillCommand");
  const skillId = Number(parameters["Skill ID"] || 1);

  // Add custom command
  const _Window_ActorCommand_makeCommandList =
    Window_ActorCommand.prototype.makeCommandList;
  Window_ActorCommand.prototype.makeCommandList = function () {
    _Window_ActorCommand_makeCommandList.call(this);
    if (this._actor && this._actor.hasSkill(skillId)) {
      const skill = $dataSkills[skillId];
      if (skill) {
        this.addCommand(skill.name, "specialSkill", true, skillId);
      }
    }
  };

  // Command handling
  const _Scene_Battle_createActorCommandWindow =
    Scene_Battle.prototype.createActorCommandWindow;
  Scene_Battle.prototype.createActorCommandWindow = function () {
    _Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler(
      "specialSkill",
      this.commandSpecialSkill.bind(this)
    );
  };

  Scene_Battle.prototype.commandSpecialSkill = function () {
    const skill = $dataSkills[skillId];
    const action = BattleManager.inputtingAction();
    action.setSkill(skillId);
    BattleManager.actor().setLastBattleSkill(skill);

    // Standard flow (just like picking a skill)
    this.onSelectAction();
  };

  // Prevent the skill from showing in the normal Skill list
  const _Window_BattleSkill_includes = Window_BattleSkill.prototype.includes;
  Window_BattleSkill.prototype.includes = function (item) {
    if (item && item.id === skillId) {
      return false; // hide from skill list
    }
    return _Window_BattleSkill_includes.call(this, item);
  };
})();

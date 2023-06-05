"use strict";

//***********************//
// Variable Declarations //
//***********************//

// Define settings
var settings = defaultSettings;

// Find the battlefield DOM element
var battleArea = document.getElementById("battleArea");
var enemiesContainer = document.getElementById("enemies");

// Helper object for creating HTML elements
var DomHelper = {
  elements: {}
};


/////////////////////////////////
/////////////////////////////////
/////////////////////////////////
/////////////////////////////////



// Constructor for Unit objects - player and enemies
function Unit(type, xPos = 10, yPos = 10) {

  Unit.count++; // Counter for created units
  Unit.aliveEnemies; // Counter for alive enemies
  Unit.enemies; // Array of enemies
  Unit.player; // Player object
  Unit.types; // Set of object types
  Unit.active; // Active element
  Unit.activeId; // ID of active element

  this.isPlayer = type.isPlayer;
  this.unitClass = type.unitClass;
  this.hp = 100;
  this.attackPower = type.attackPower;
  this.defensePower = type.defensePower;
  this.additionalDefense = 0;
  this.criticalAttackChance = 0.2;
  this.criticalAttackBoost = 20;
  this.state = "idle";

  this.x = xPos;
  this.y = yPos;

  this.htmlReference = DomHelper.elements.createUnit(this.unitClass, this.isPlayer);
  this.addListeners();
}



///////////////////////
// Prototype Methods ///
///////////////////////

// Attack method
Unit.prototype.attack = function(enemy) {
  // Check for death
  if (enemy.state === "dead") {
    enemy.showMessage(enemy.unitClass + " is dead", "say", 2);
    return false;
  }

  if (this === enemy && !settings.canSuicide) {
    this.showMessage("No suicide please", "say", 2);
    return false;
  }
  var additionalPower = 0;

  // Check critical attack chance
  if (Math.random() < this.criticalAttackChance) {
    additionalPower += this.attackPower * this.criticalAttackBoost / 100;
    console.log('additionalPower', 'additionalPower:', additionalPower)
    this.showMessage("Critical!", "critical", settings.gameSpeed);
  }

  // Calculate fight values (attack and defense)
  var defenseValue = enemy.defensePower + enemy.additionalDefense;
  if (defenseValue > 100) {
    defenseValue = 100;
  }

  var attackValue = this.attackPower + additionalPower;

  var hitValue = attackValue * (1 - defenseValue / 100);

  // Attack enemy
  this.startAnimation("attack");
  enemy.startAnimation("blink");
  enemy.hp -= +hitValue.toFixed(2);
  enemy.hp = enemy.hp.toFixed(1);
  enemy.showMessage("-" + hitValue.toFixed(2) + " HP", "hit", settings.gameSpeed);

  console.log('enemy.hp:', enemy.hp);

  // Kill enemy if HP < 0
  if (enemy.hp <= 0) {
    enemy.setState("dead");
    console.log(enemy.unitClass + " killed by " + this.unitClass);
    enemy.updateHP();
    return "died";
  }

  // Update HP display
  enemy.updateHP();
  return true;
}

// Unit defense method
Unit.prototype.shield = function() {
  this.additionalDefense = +(1.25 * this.defensePower).toFixed(1);
  console.log('this.additional...nse', this.additionalDefense);
}

// Update HP information of characters
Unit.prototype.updateHP = function() {
  // Find the HP bar element
  var hp

#include <iostream>
#include <string>

class Character;

class Action {
public:
  explicit Action(const std::string &n) : name(n) {}
  virtual void execute(Character &character) const = 0;
  std::string getName() const { return name; }
  virtual ~Action() {}

private:
  std::string name;
};

class Character {
public:
  explicit Character(const std::string &n, int h)
      : name(n), health(h), isCasting(false), castingTimeLeft(0),
        postInterruptCooldown(0) {}

  void performAction(const Action &action, Character &target) {
    if (postInterruptCooldown == 0) {
      std::cout << name << " is using "
                << "'" << action.getName() << "'"
                << " action on "
                << "'" << target.name << "'"
                << "!" << std::endl;
      action.execute(target);
    } else {
      std::cout << name << "'s "
                << "'" << action.getName() << "'"
                << " action cannot be executed, because of a recent interrupt!"
                << std::endl;
    }
  }

  // Updates and applies effects per game tick/cycle
  void update() {
    if (castingTimeLeft > 0) {
      castingTimeLeft--;
      if (castingTimeLeft == 0 && isCasting) {
        completeCasting();
      }
    }
    if (postInterruptCooldown > 0) {
      postInterruptCooldown--;
    }
  }

  void changeHealth(int amount) {
    health += amount;
    std::cout << name << " now has health: " << health << std::endl;
  }

  void startCasting(int timeRequired) {
    if (postInterruptCooldown == 0 && castingTimeLeft == 0) {
      isCasting = true;
      castingTimeLeft = timeRequired;
      std::cout << name << " starts casting a spell... it will take "
                << timeRequired << " ticks." << std::endl;
    } else {
      std::cout << name
                << " cannot cast due to recent interruption or ongoing casting."
                << std::endl;
    }
  }

  void completeCasting() {
    isCasting = false;
    std::cout << name << " completes casting." << std::endl;
    // Apply the effect of the casting action, e.g., heal
    changeHealth(30); // Assuming the healing power value is known
  }

  void interruptCasting(int cooldown) {
    if (isCasting) {
      std::cout << name << "'s casting is interrupted!" << std::endl;
      isCasting = false;
      castingTimeLeft = 0;
      postInterruptCooldown = cooldown;
    }
  }

  virtual ~Character() {}

private: // could be protected if derived classes need access
  std::string name;
  int health;
  bool isCasting;
  int castingTimeLeft; // Time left to finish casting
  int postInterruptCooldown;
};

class AttackAction : public Action {
public:
  explicit AttackAction(int dmg) : Action("Attack"), damage(dmg) {}

  virtual void execute(Character &character) const override {
    character.changeHealth(-damage);
  }

private:
  int damage;
};

class HealAction : public Action {
public:
  int castingTime;

  explicit HealAction(int castTime) : Action("Heal"), castingTime(castTime) {}

  virtual void execute(Character &character) const override {
    character.startCasting(castingTime);
  }
};

class InterruptAction : public Action {
public:
  explicit InterruptAction(int duration)
      : Action("Interrupt"), interruptDuration(duration) {}

  void execute(Character &character) const override {
    character.interruptCasting(interruptDuration);
  }

private:
  int interruptDuration;
};

int main() {
  Character mage("Mage", 100);
  Character warrior("Warrior", 120);
  AttackAction swordSlash(20);
  HealAction magicHeal(2);           // Requires 2 ticks to complete casting
  InterruptAction surpriseAttack(5); // interrupts for 5 ticks

  warrior.performAction(swordSlash, mage);
  mage.performAction(magicHeal, mage); // Mage starts healing
  warrior.update(); // Instead of manual update calls, there would be a
                    // simulation loop that calls update() on each character
  mage.update();

  warrior.performAction(surpriseAttack, mage); // Warrior interrupts immediately
  mage.performAction(
      magicHeal,
      mage); // Mage wants to start healing, but is interrupt cooldown
  warrior.update();
  mage.update();
}

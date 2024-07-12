#include <atomic>
#include <iostream>
#include <string>
#include <thread>
#include <vector>

class Updatable {
public:
  virtual void update() = 0;
  //virtual ~Updatable() {
  //} // Virtual destructor for proper cleanup of derived classes
};

class Action {
public:
  explicit Action(const std::string &n) : name(n) {}
  virtual void execute(class Character &character) const = 0;
  std::string getName() const { return name; }
  virtual ~Action() {}

private:
  std::string name;
};

class Character : public Updatable {
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

  void update() override {
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
    isCasting = true;
    castingTimeLeft = timeRequired;
    std::cout << name << " starts casting a spell... it will take "
              << timeRequired << " ticks." << std::endl;
  }

  void completeCasting() {
    isCasting = false;
    std::cout << name << " completes casting." << std::endl;
    changeHealth(30); // Assuming fixed healing power
  }

  void interruptCasting(int cooldown) {
    isCasting = false;
    castingTimeLeft = 0;
    postInterruptCooldown = cooldown;
    std::cout << name << "'s casting is interrupted!" << std::endl;
  }

  virtual ~Character() {}

private:
  std::string name;
  int health;
  bool isCasting;
  int castingTimeLeft;
  int postInterruptCooldown;
};

// Action classes remain unchanged
class AttackAction : public Action {
public:
  explicit AttackAction(int dmg) : Action("Attack"), damage(dmg) {}
  void execute(Character &character) const override {
    character.changeHealth(-damage);
  }

private:
  int damage;
};

class HealAction : public Action {
public:
  int castingTime;
  explicit HealAction(int castTime) : Action("Heal"), castingTime(castTime) {}
  void execute(Character &character) const override {
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
  HealAction magicHeal(2);
  InterruptAction surpriseAttack(5);


  std::vector<Updatable *> entities;
  entities.push_back(&warrior);
  entities.push_back(&mage);

  std::atomic<bool> isOver { false };

  std::cout << "press q to quit\n";
  std::thread quit_thread {[&isOver](){
    while (!isOver) {
      char input;
      std::cin >> input;
      if (input == 'q') {
        isOver = true;
      }
    }
  }};

  mage.performAction(magicHeal, mage);
  warrior.performAction(surpriseAttack, mage);
  mage.performAction(magicHeal, mage);

  while (isOver) {
    for (auto entity : entities) {
      entity->update();
    }
  }

  quit_thread.join();
}

#include <iostream>
#include <string>

class Updatable {
public:
    virtual void update() = 0;
    virtual ~Updatable() {}
};

// Managing states specific to cooldowns and casting durations
class CooldownManager : public Updatable {
public:
    CooldownManager() : isCasting(false), castingTimeLeft(0), postInterruptCooldown(0) {}

    void update() override {
        if (castingTimeLeft > 0) {
            castingTimeLeft--;
        }
        if (postInterruptCooldown > 0) {
            postInterruptCooldown--;
        }
    }

    void startCasting(int timeRequired) {
        isCasting = true;
        castingTimeLeft = timeRequired;
    }

    void stopCasting() {
        isCasting = false;
        castingTimeLeft = 0;
    }

    void setInterruptCooldown(int cooldown) {
        postInterruptCooldown = cooldown;
    }

    bool canCast() const {
        return postInterruptCooldown == 0 && castingTimeLeft == 0;
    }

    bool isCurrentlyCasting() const {
        return isCasting && castingTimeLeft > 0;
    }

    bool canPerformAction() const {
        return postInterruptCooldown == 0;
    }

private:
    bool isCasting;
    int castingTimeLeft;
    int postInterruptCooldown;
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

class Character {
public:
    explicit Character(const std::string &n, int h)
        : name(n), health(h), cooldownManager(new CooldownManager()) {}

    ~Character() {
        delete cooldownManager;
    }

    void performAction(const Action& action, Character& target) {
        if (cooldownManager->canPerformAction()) {
            std::cout << name << " is using '" << action.getName() << "' action on '" << target.name << "'!" << std::endl;
            action.execute(target);
        } else {
            std::cout << name << "'s '" << action.getName() << "' action cannot be executed due to recent interrupt!" << std::endl;
        }
    }

    void update() {
        cooldownManager->update();
    }

    void changeHealth(int amount) {
        health += amount;
        std::cout << name << " now has health: " << health << std::endl;
    }

    void startCasting(int timeRequired) {
        if (cooldownManager->canCast()) {
            cooldownManager->startCasting(timeRequired);
            std::cout << name << " starts casting a spell... it will take " << timeRequired << " ticks." << std::endl;
        } else {
            std::cout << name << " cannot cast due to recent interruption or ongoing casting." << std::endl;
        }
    }

    void completeCasting() {
        cooldownManager->stopCasting();
        std::cout << name << " completes casting." << std::endl;
        changeHealth(30); // Assuming the healing power value is fixed
    }

    void interruptCasting(int cooldown) {
        cooldownManager->stopCasting();
        cooldownManager->setInterruptCooldown(cooldown);
        std::cout << name << "'s casting is interrupted!" << std::endl;
    }

private:
    std::string name;
    int health;
    CooldownManager* cooldownManager;
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
    explicit InterruptAction(int duration) : Action("Interrupt"), interruptDuration(duration) {}
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

    warrior.performAction(swordSlash, mage);
    mage.performAction(magicHeal, mage);
    warrior.update();
    mage.update();

    warrior.performAction(surpriseAttack, mage);
    mage.performAction(magicHeal, mage);
    warrior.update();
    mage.update();
}

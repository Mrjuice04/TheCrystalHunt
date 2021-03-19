import { Scene } from "phaser";
import { animationFrameScheduler } from "rxjs";
import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { character_sword_charge } from 'src/app/modules/characters/character_holyknight/character_holyknight_charge'
import { character_sword_shield } from 'src/app/modules/characters/character_holyknight/character_holyknight_shield'
import { character_sword_slash } from 'src/app/modules/characters/character_holyknight/character_holyknight_slash'
import { monsterControl } from "../../monsters/monsterControl";
import { game_interface } from 'src/app/modules/interface';
import { character_sword_blast } from 'src/app/modules/characters/character_holyknight/character_holyknight_blast'



export class character_swordsman {
    public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    //import classes
    private gameScene: Phaser.Scene;
    private interface: game_interface;
    private collision: collision;
    private monsterControl!: monsterControl;

    //character attributes
    private healthPoint: number = 150;
    private maxHealthPoint: number = 150;
    private energyPoint: number = 0;
    private maxEnergyPoint: number = 100;
    private speed: number = 100;
    private isInvulnerable: boolean = false;
    private isUnstoppable: boolean = false;
    private isDead: boolean = false;

    //attack levels
    private slashLevel: number = 1;
    private chargeLevel: number = 1;
    private shieldLevel: number = 1;
    private blastLevel: number = 1;

    //attack attributes
    private slashCoolDown: number = 1000;
    private slashEmpowerRate: number = 10000;
    //

    private chargeEnergy: number = 25;
    //

    private shieldEnergy: number = 40;

    //
    private blastDamage: number = 15;
    private blastEnergy: number = 60;

    //tick
    private lastSlashTick!: number;
    private slashCounter: integer = 1;
    //
    private lastChargeTick!: number;
    //
    private lastShieldTick!: number;
    private shieldEnergyTick!: number;
    //
    private lastBlastTick!: number;
    private blastChargingTime!: number;
    private blastEnergyTick!: number
    private blastCreateTick!: number;
    private blastCount: number = 0;
    //
    private lastJumpTick!: number;
    private initHeight!: number;
    //
    private lastStunTick!: number;
    private stunnedDuration!: number;
    //
    private lastDogeTick!: number;

    //keys
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keySPACE!: Phaser.Input.Keyboard.Key;

    //state
    private spriteStateValue: string = "idle";
    private slashStateValue: string = "idle";
    private shieldStateValue: string = "idle";
    private chargeStateValue: string = "idle";
    private blastStateValue: string = "idle";
    private dogeStateValue: string = "idle";

    //effects
    private slashEffect!: character_sword_slash;
    private shieldEffect!: character_sword_shield;
    private chargeEffect!: character_sword_charge;
    private blastEffect!: character_sword_blast;
    private blastEffectArray: Array<character_sword_blast> = [];


    //character 
    constructor(aScene: Phaser.Scene, aCollision: collision, aInterface: game_interface) {
        //import classes
        this.collision = aCollision;
        this.gameScene = aScene;
        this.interface = aInterface;

        //audio load
        this.gameScene.load.audio('ability_dash', './assets/audio/metal_015.wav');
        this.gameScene.load.audio('ability_shield', './assets/audio/magic_063.wav');
        this.gameScene.load.audio('ability_slash', './assets/audio/hit-deep_034.wav');
        this.gameScene.load.audio('ability_slash_2', './assets/audio/metal_016.wav');
        this.gameScene.load.audio('character_damage', './assets/audio/hurt_007.wav');
        this.gameScene.load.audio('character_dead', './assets/audio/hurt_022.wav');

        //character sprite
        this.gameScene.load.spritesheet("character_holyknight", "./assets/characters/character_holyknight/character_holyknight.png", { frameWidth: 30, frameHeight: 36 });

        //effects sprite
        this.gameScene.load.spritesheet("charge_effect", "./assets/characters/character_holyknight/charge_effect.png", { frameWidth: 24, frameHeight: 11 });
        this.gameScene.load.spritesheet("slash_effect", "./assets/characters/character_holyknight/slash_effect.png", { frameWidth: 31, frameHeight: 24 });
        this.gameScene.load.spritesheet("shield_effect", "./assets/characters/character_holyknight/shield_effect.png", { frameWidth: 64, frameHeight: 64 });
        this.gameScene.load.spritesheet("blast_effect", "./assets/characters/character_holyknight/blast_effect.png", { frameWidth: 104, frameHeight: 23 });

        //icons image
        this.gameScene.load.image('basicAttack', './assets/characters/character_holyknight/slash_icon.png');
        this.gameScene.load.image('ability1', './assets/characters/character_holyknight/charge_icon.png');
        this.gameScene.load.image("ability2", "./assets/characters/character_holyknight/shield_icon.png");
        this.gameScene.load.image("ultimate", "./assets/characters/character_holyknight/blast_icon.png");

        //keys create
        this.keySPACE = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors = this.gameScene.input.keyboard.createCursorKeys();
    }

    public addMonsterControl(aMonsterControl: monsterControl) {
        this.monsterControl = aMonsterControl;

    }

    //General Methods
    public create() {
        this.sprite = this.gameScene.physics.add.sprite(50, 500, "character_holyknight").setScale(0.7, 0.7).setDepth(1);
        this.createAnims();
        this.sprite.setCollideWorldBounds(true);
        this.collision.addPlayer(this);
        this.gameScene.sound.add('character_damage');
        this.gameScene.sound.add('character_dead');
        this.interface.changeMaxHealth(this.maxHealthPoint);
        this.interface.changeMaxEnergy(this.maxEnergyPoint);
        this.interface.addAbilityEnergy(this.chargeEnergy, this.shieldEnergy, this.blastEnergy);
    }

    public update(aHealth: number) {
        if (!this.isDead) {
            this.slashMachine();
            this.chargeMachine();
            this.shieldMachine();
            this.spriteMachine();
            this.blastMachine();
            this.dogeMachine();
        }
        if (aHealth > 0) {
            this.isHealed(aHealth);
        }
    }

    public isDamaged(aDamage: number) {
        if (!this.isInvulnerable && this.healthPoint > 0) {
            this.healthPoint -= aDamage;
            this.interface.changeHealthBar(this.healthPoint);
            this.sprite.setTint(0xF86161);
            setTimeout(() => {
                if (this.sprite.tintTopLeft == 0xF86161) {
                    this.sprite.clearTint();
                }
            }, 200)
            if (this.healthPoint <= 0) {
                this.gameScene.sound.play('character_dead');
                this.isDead = true;
                this.sprite.anims.play("character_holyknight_die", true);
                this.sprite.setPushable(false);
            }
            else {
                setTimeout(() => {
                    this.gameScene.sound.play('character_damage');
                }, 200)
            }
        }
    }

    public isHealed(aHeal: number) {
        this.healthPoint += aHeal;
        if (this.healthPoint > this.maxHealthPoint) {
            this.healthPoint = this.maxHealthPoint;
        }
        this.interface.changeHealthBar(this.healthPoint);
        this.sprite.setTint(0xBCF5A9);
        setTimeout(() => {
            if (this.sprite.tintTopLeft == 0xBCF5A9) {
                this.sprite.clearTint();
            }
        }, 200)
    }

    public isSlowed(slowPercent: number, duration: number) {
        if (!this.isUnstoppable){
            let newspeed = this.speed * (1 - slowPercent);
            this.speed = newspeed;
            setTimeout(() => { 
                this.speed = this.speed / (1 - slowPercent);
            }, duration)
        }
    }

    public isDisplaced(aPosX: number, aPosY: number) {
        this.sprite.setPosition(aPosX, aPosY);
    }

    public getUnstoppable() {
        return this.isUnstoppable;
    }

    public getInvulnerable() {
        return this.isInvulnerable;
    }

    public isStunned(aTime: number) {
        if (!this.isUnstoppable && !this.isDead) {
            this.sprite.setAccelerationX(0);
            this.sprite.setVelocityX(0);
            this.lastStunTick = utils.getTick();
            this.stunnedDuration = aTime;
            this.spriteStateValue = "stunned"
            this.chargeStateValue = "idle";
            this.blastStateValue = "playing";
        }
    }

    public isKnockbacked(aVelocityX: number, aVelocityY: number, aTime: number, aStun: boolean, aStunTime: number) {
        if (!this.isUnstoppable && !this.isDead) {
            this.spriteStateValue = "stunned";
            this.sprite.setAccelerationX(0);
            this.sprite.setVelocity(aVelocityX, aVelocityY);
            this.lastStunTick = utils.getTick();
            this.stunnedDuration = aTime;
            if (aStun) {
                setTimeout(() => {
                    if (this.sprite.active) {
                        this.isStunned(aStunTime);
                    }
                }, aTime)
            }
        }
    }

    public incMaxHealth(aHealthPoint: number) {
        this.maxHealthPoint += aHealthPoint;
        this.interface.changeMaxHealth(this.maxHealthPoint);
        this.interface.changeHealthBar(this.healthPoint);
        console.log(this.maxHealthPoint);
    }

    public decMaxHealth(aHealthPoint: number) {
        this.maxHealthPoint -= aHealthPoint;
        this.interface.changeMaxHealth(this.maxHealthPoint);
        this.interface.changeHealthBar(this.healthPoint);
    }

    public incEnergy(aEnergyPoint: number) {
        this.energyPoint += aEnergyPoint;
        if (this.energyPoint >= this.maxEnergyPoint) {
            this.energyPoint = this.maxEnergyPoint;
        }

        this.interface.changeEnergyBar(this.energyPoint);
    }

    public decEnergy(aEnergyPoint: number) {
        if (this.energyPoint >= aEnergyPoint) {
            this.energyPoint -= aEnergyPoint;
        } else {
            this.energyPoint = 0;
        }
        this.interface.changeEnergyBar(this.energyPoint);
    }

    public incMaxEnergy(aEnergyPoint: number) {
        this.maxEnergyPoint += aEnergyPoint;
        console.log(this.maxEnergyPoint);
        this.interface.changeMaxEnergy(this.maxEnergyPoint);
        this.interface.changeEnergyBar(this.energyPoint);
    }

    public decMaxEnergy(aEnergyPoint: number) {
        this.maxEnergyPoint -= aEnergyPoint;
        this.interface.changeMaxEnergy(this.maxEnergyPoint);
        this.interface.changeEnergyBar(this.energyPoint);
    }

    public checkDeath() {
        return this.isDead;
    }

    private isStunEnd() {
        if (utils.tickElapsed(this.lastStunTick) >= this.stunnedDuration) {
            return true;
        }
        return false;
    }

    private spriteMachine() {
        switch (this.spriteStateValue) {
            case "idle": {
                if (this.checkWalking()) {
                    this.spriteStateValue = "walking";
                } else if (this.checkJump()) {
                    this.doJump();
                    this.spriteStateValue = "jumping";
                } else if (this.checkSlash()) {
                    this.spriteStateValue = "attacking";
                    this.slashStateValue = "start";
                } else if (this.checkCharge()) {
                    this.spriteStateValue = "attacking";
                    this.chargeStateValue = "start";
                } else if (this.checkShield()) {
                    this.spriteStateValue = "attacking";
                    this.shieldStateValue = "start";
                } else if (this.checkBlast()) {
                    this.spriteStateValue = "attacking";
                    this.blastStateValue = "start";
                } else if (this.checkDoge()) {
                    this.spriteStateValue = "dodging";
                    this.dogeStateValue = "start";
                } else {
                    this.isIdle();
                }
                break;
            }
            case "walking": {
                if (this.checkJump()) {
                    this.doJump();
                    this.spriteStateValue = "jumping";
                } else if (this.checkSlash()) {
                    this.spriteStateValue = "attacking";
                    this.slashStateValue = "start";
                } else if (this.checkCharge()) {
                    this.spriteStateValue = "attacking";
                    this.chargeStateValue = "start";
                } else if (this.checkShield()) {
                    this.spriteStateValue = "attacking";
                    this.shieldStateValue = "start";
                } else if (this.checkBlast()) {
                    this.spriteStateValue = "attacking";
                    this.blastStateValue = "start";
                } else if (this.checkDoge()) {
                    this.spriteStateValue = "dodging";
                    this.dogeStateValue = "start";
                } else if (!this.doWalking()) {
                    this.spriteStateValue = "idle";
                } else if (this.checkSlash()) {
                    this.spriteStateValue = "attacking";
                    this.slashStateValue = "start";
                }
                break;
            }
            case "jumping": {
                this.doWalking();
                if (this.checkDoubleJump()) {
                    this.doDoubleJump();
                    this.spriteStateValue = "doubleJumping";
                } else if (this.isJumpEnd()) {
                    this.spriteStateValue = "idle"
                } else if (this.checkDoge()) {
                    this.spriteStateValue = "dodging";
                    this.dogeStateValue = "start";
                } else if (this.checkSlash()) {
                    this.spriteStateValue = "attacking";
                    this.slashStateValue = "start";
                }
                break;
            }
            case "doubleJumping": {
                this.doWalking();
                if (this.isJumpEnd()) {
                    this.spriteStateValue = "idle"
                } else if (this.checkDoge()) {
                    this.spriteStateValue = "dodging";
                    this.dogeStateValue = "start";
                } else if (this.checkSlash()) {
                    this.spriteStateValue = "attacking";
                    this.slashStateValue = "start";
                }
                break;
            }
            case "dodging": {
                if (this.dogeStateValue == "idle") {
                    this.spriteStateValue = "idle";
                }
                break;
            }
            case "stunned": {
                if (this.isStunEnd()) {
                    this.spriteStateValue = "idle";
                }
                break;
            }
            case "attacking": {
                if (this.slashStateValue == "idle" && (this.shieldStateValue == "idle" || this.shieldStateValue == "playing") && this.chargeStateValue == "idle" && (this.blastStateValue == "playing" || this.blastStateValue == "idle")) {
                    this.spriteStateValue = "idle";
                }
                break;
            }
            default: {
                this.spriteStateValue = "idle"
                break;
            }
        }
    }

    private dogeMachine() {
        switch (this.dogeStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.doDoge();
                this.dogeStateValue = "playing";
                break;
            }
            case "playing": {
                if (this.cursors.left.isDown) {
                    this.sprite.setVelocityX(this.speed * -1.5);
                    this.sprite.flipX = true;
                } else if (this.cursors.right.isDown) {
                    this.sprite.setVelocityX(this.speed * 1.5);
                    this.sprite.flipX = false;
                }
                if (this.checkDogeEnd()) {
                    this.dogeStateValue = "idle"
                };
                break;
            }
            default: {
                this.dogeStateValue = "idle"
                break;
            }
        }
    }

    private slashMachine() {
        switch (this.slashStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.doSlash();
                this.createSlashEffect();
                this.slashStateValue = "playing";
                break;
            }
            case "playing": {
                this.updateSlashEffect();
                if (this.checkSlashEnd()) {
                    this.slashStateValue = "idle";
                    console.log("hit")
                }
                break;
            }
            default: {
                this.slashStateValue = "idle"
                break;
            }
        }
    }


    private chargeMachine() {
        switch (this.chargeStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.sprite.setVelocityX(0);
                this.createChargeEffect();
                this.chargeStateValue = "playing";
                break;
            }
            case "playing": {
                this.doCharge();
                this.updateChargeEffect();
                if (this.chargeLevel >= 6 && this.checkChargeJump()) {
                    this.doChargeJump();
                }
                if (this.checkChargeEnd()) {
                    if (this.chargeLevel >= 3) {
                        this.createChargeWave();
                    }
                    this.chargeStateValue = "idle";
                }
                break;
            }
        }
    }

    private shieldMachine() {
        switch (this.shieldStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.createShieldEffect();
                this.shieldStateValue = "sprite_animation";

                break;
            }
            case "sprite_animation": {
                this.useShield();
                if (this.checkPlayerShieldAnimEnd()) {
                    this.shieldStateValue = "effect_animation";
                }
                break;
            }
            case "effect_animation": {
                this.updateShieldEffect();
                if (this.shieldEffect.getCanAttack()) {
                    if (this.checkSlash()) {
                        this.slashStateValue = "start";
                    }
                }
                if (this.checkShieldEnd()) {
                    this.shieldStateValue = "idle";
                }
                break;
            }
            default: {
                this.slashStateValue = "idle"
                break;
            }
        }
    }

    private blastMachine() {
        switch (this.blastStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                if (this.blastCreateTick == undefined || utils.tickElapsed(this.blastCreateTick) >= 300) {
                    this.createBlastEffect();
                    this.blastCreateTick = utils.getTick();
                    this.blastCount++;
                }
                if (this.blastCount > this.blastEffect.getBlastCount()) {
                    this.spriteStateValue = "idle";
                    this.blastStateValue = "playing";
                }
                this.checkBlastHeal();
                if (this.cursors.left.isDown) {
                    if (!this.sprite.flipX) {
                        this.sprite.setVelocityX(-50);
                    } else {
                        this.sprite.setVelocityX(-100);
                    }
                    this.sprite.anims.play("character_holyknight_move", true);
                } else if (this.cursors.right.isDown) {
                    if (this.sprite.flipX) {
                        this.sprite.setVelocityX(50);
                    } else {
                        this.sprite.setVelocityX(100);
                    }
                    this.sprite.anims.play("character_holyknight_move", true);
                } else {
                    this.sprite.setVelocityX(0);
                    this.sprite.anims.play("character_holyknight_idle", true);
                }
                break;
            }
            case "playing": {
                this.checkBlastHeal();
                if (this.checkBlastEnd()) {
                    this.blastCount = 0;
                    this.blastStateValue = "idle";
                }
                break;
            }
            default: {
                this.blastStateValue = "idle"
                break;
            }
        }
    }

    private createAnims() {
        this.gameScene.anims.create({
            key: "character_holyknight_move", frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 14, end: 17 }), frameRate: 10, repeat: -1,
        });

        this.gameScene.anims.create({
            key: "character_holyknight_idle", frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 7, end: 10 }), frameRate: 10, repeat: -1,
        });

        this.gameScene.anims.create({
            key: "character_holyknight_die", frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 0, end: 4 }), frameRate: 10,
        });

        this.gameScene.anims.create({
            key: "character_holyknight_attack", frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 21, end: 25 }), frameRate: 10,
        });

        this.gameScene.anims.create({
            key: "character_holyknight_doge", frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 28, end: 33 }), frameRate: 10,
        });

        this.gameScene.anims.create({
            key: "slash_effect", frames: this.gameScene.anims.generateFrameNumbers("slash_effect", { start: 0, end: 5 }), frameRate: 20,
        });

        this.gameScene.anims.create({
            key: "charge_effect", frames: this.gameScene.anims.generateFrameNumbers("charge_effect", { start: 0, end: 4 }), frameRate: 20,
        });

        this.gameScene.anims.create({
            key: "charge_effect_1", frames: this.gameScene.anims.generateFrameNumbers("charge_effect", { start: 6, end: 7 }), frameRate: 5, repeat: -1
        });

        this.gameScene.anims.create({
            key: "shield_effect", frames: this.gameScene.anims.generateFrameNumbers("shield_effect", { start: 0, end: 8 }), frameRate: 10,
        });

        this.gameScene.anims.create({
            key: "shield_effect_1", frames: this.gameScene.anims.generateFrameNumbers("shield_effect", { start: 9, end: 11 }), frameRate: 10,
        });

        this.gameScene.anims.create({
            key: "blast_effect", frames: this.gameScene.anims.generateFrameNumbers("blast_effect", { start: 0, end: 3 }), frameRate: 10,
        });
    }

    private isIdle() {
        this.sprite.setVelocityX(0);
        this.sprite.body.setAllowGravity(true);
        if (this.slashStateValue == "idle" && this.shieldStateValue == "idle" && this.chargeStateValue == "idle") {
            this.sprite.anims.play("character_holyknight_idle", true);
        }
    }

    private checkWalking() {
        if ((this.cursors.left.isDown || this.cursors.right.isDown)) {
            return true;
        }
        return false;
    }

    private doWalking() {
        if (this.cursors.left.isDown) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-1 * this.speed);
            if (this.slashStateValue == "idle" && this.shieldStateValue == "idle" && this.chargeStateValue == "idle") {
                this.sprite.anims.play("character_holyknight_move", true);
            }
            return true;
        } else if (this.cursors.right.isDown) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(this.speed);
            if (this.slashStateValue == "idle" && this.shieldStateValue == "idle" && this.chargeStateValue == "idle") {
                this.sprite.anims.play("character_holyknight_move", true);
            }
            return true;
        } else {
            this.sprite.setVelocityX(0);
            return false;
        }
    }

    private checkJump(): boolean {
        if (this.sprite.body.touching.down && this.cursors.up.isDown) {
            return true;
        }
        return false;
    }

    private doJump() {
        this.initHeight = this.sprite.getCenter().y;
        this.sprite.setVelocityY(-230);
        this.lastJumpTick = utils.getTick();
    }

    private checkDoubleJump(): boolean {
        let curr_height = this.sprite.getCenter().y;
        if ((((curr_height - this.initHeight) <= -40) || (utils.tickElapsed(this.lastJumpTick) >= 400) || this.lastJumpTick == undefined) && this.cursors.up.isDown) {
            return true;
        }
        return false;
    }

    private doDoubleJump() {
        this.sprite.setVelocityY(-150);
    }

    private isJumpEnd() {
        if (this.sprite.body.touching.down) {
            return true;
        }
        return false;
    }

    private checkDoge() {
        if (this.cursors.down.isDown && (utils.tickElapsed(this.lastDogeTick) >= 800 || this.lastDogeTick == undefined)) {
            this.lastDogeTick = utils.getTick();
            return true;
        }
        return false;
    }

    private doDoge() {
        if (!this.sprite.flipX) {
            this.sprite.setVelocityX(this.speed * 1.5);
            this.sprite.body.velocity.y *= 1.2;

        } else {
            this.sprite.setVelocityX(this.speed * -1.5);
            this.sprite.body.velocity.y *= 1.2;
        }
        this.isInvulnerable = true;
        this.isUnstoppable = true;
        this.sprite.setPushable(false);
        this.sprite.anims.play("character_holyknight_doge", true);
    }

    private checkDogeEnd() {
        if (utils.tickElapsed(this.lastDogeTick) >= 600) {
            this.isInvulnerable = false;
            this.isUnstoppable = false;
            this.sprite.setPushable(true);
            return true;
        }
        return false;
    }



    //Character Specific Method
    //basic Attack
    private checkSlash() {
        if (((this.lastSlashTick == undefined) || (utils.tickElapsed(this.lastSlashTick) >= this.slashCoolDown)) && this.keyA.isDown) {
            this.lastSlashTick = utils.getTick();
            return true;
        }
        return false;
    }

    private doSlash() {
        if (!this.sprite.flipX) {
            this.sprite.setVelocityX(50);
        } else {
            this.sprite.setVelocityX(-50);
        }
        this.sprite.anims.play("character_holyknight_attack", true);
    }

    private createSlashEffect() {
        this.slashEffect = new character_sword_slash(this.gameScene, this.collision, this.monsterControl, this.slashLevel);
        let pos = this.sprite.getCenter();
        if (!this.sprite.flipX) {
            pos.x += 15;
        } else {
            pos.x -= 15;
        }
        this.slashEffect.create(pos.x, pos.y);

        if (this.slashCounter % 2 == 0) {
            this.slashEffect.sprite.flipX = true;
        }

        if (this.slashCounter % this.slashEmpowerRate == 0) {
            this.slashEffect.empowerHit();
        }
        this.slashCounter++;
        this.slashEffect.playAnims();
        this.slashCoolDown = this.slashEffect.getCoolDown();
        this.slashEmpowerRate = this.slashEffect.getEmpowerRate();
    }

    private updateSlashEffect() {
        let pos = this.sprite.getCenter();
        if (!this.sprite.flipX) {
            this.slashEffect.sprite.setPosition(pos.x + 10, pos.y)
        } else {
            this.slashEffect.sprite.setPosition(pos.x - 10, pos.y)
        }
        this.incEnergy(this.slashEffect.getEnergy());
    }

    private checkSlashEnd(): boolean {
        if (utils.tickElapsed(this.lastSlashTick) >= 300) {
            this.slashEffect.destroy();
            return true;
        }
        return false;
    }

    //ability 1
    private checkCharge() {
        if (this.sprite.body.touching.down && ((this.lastChargeTick == undefined) || (utils.tickElapsed(this.lastChargeTick) >= 800)) && this.keyS.isDown && this.energyPoint >= this.chargeEnergy) {
            this.lastChargeTick = utils.getTick();
            this.isUnstoppable = true;
            this.decEnergy(this.chargeEnergy);
            return true;
        }
        return false;
    }

    private doCharge() {
        if ((utils.tickElapsed(this.lastChargeTick) >= 410)) {
            this.sprite.setPushable(false);
            if (!this.sprite.flipX) {
                this.sprite.setVelocityX(360);
            } else {
                this.sprite.setVelocityX(-360);
            }
        }
    }

    private createChargeEffect() {
        this.chargeEffect = new character_sword_charge(this.gameScene, this.collision, this.monsterControl, this.chargeLevel);
        let pos;
        if (!this.sprite.flipX) {
            pos = this.sprite.getRightCenter();
            this.chargeEffect.create(pos.x + 10, pos.y + 3)
        } else {
            pos = this.sprite.getLeftCenter();
            this.chargeEffect.create(pos.x - 10, pos.y + 3)
            this.chargeEffect.sprite.flipX = true;
        }
        this.chargeEffect.playAnims();
        this.sprite.anims.play("character_holyknight_attack", true);
    }

    private updateChargeEffect() {
        let pos = this.sprite.getCenter();
        if (!this.sprite.flipX) {
            this.chargeEffect.sprite.setPosition(pos.x + 10, pos.y + 3)
        } else {
            this.chargeEffect.sprite.setPosition(pos.x - 10, pos.y + 3)
        }
    }

    private checkChargeJump() {
        if (this.sprite.body.touching.down && this.cursors.up.isDown && this.chargeEffect.useChargeJump() >= 1) {
            this.lastChargeTick = utils.getTick();
            return true;
        }
        return false;
    }

    private doChargeJump() {
        this.sprite.setVelocity(0, -250)
        if (utils.tickElapsed(this.lastChargeTick) >= 250) {
            return true;
        }
        return false;
    }

    private checkChargeEnd() {
        if ((utils.tickElapsed(this.lastChargeTick) >= this.chargeEffect.getDuration() - 200)) {
            if (!this.chargeEffect.isDestroyed() && this.chargeLevel < 3) {
                this.chargeEffect.destroy();
            }
        }
        if ((utils.tickElapsed(this.lastChargeTick) >= this.chargeEffect.getDuration())) {
            this.sprite.setPushable(true);
            this.isUnstoppable = false;
            return true;
        }
        return false;
    }

    private createChargeWave() {
        this.chargeEffect.chargeWave();
    }



    //ability 2
    private checkShield() {
        if ((this.lastShieldTick == undefined || (utils.tickElapsed(this.lastShieldTick) >= 1000)) && this.keyD.isDown && this.energyPoint >= this.shieldEnergy) {
            this.lastShieldTick = utils.getTick();
            this.decEnergy(this.shieldEnergy);
            return true;
        }
        return false;
    }

    private useShield() {
        this.sprite.setVelocityX(0);
        this.sprite.setPushable(false);
    }

    private checkPlayerShieldAnimEnd() {
        this.updateShieldEffect();
        if ((utils.tickElapsed(this.lastShieldTick) >= 1000)) {
            return true;
        }
        return false;
    }

    private createShieldEffect() {
        this.shieldEffect = new character_sword_shield(this.gameScene, this.collision, this.monsterControl, this.shieldLevel);
        let pos = this.sprite.getCenter();
        this.shieldEffect.create(pos.x, pos.y);
        this.shieldEnergyTick = utils.getTick();
        this.isInvulnerable = true;
    }

    private updateShieldEffect() {
        let pos = this.sprite.getCenter();
        this.shieldEffect.sprite.setPosition(pos.x, pos.y);
        // if (utils.tickElapsed(this.shieldEnergyTick) >= 250) {
        //     this.shieldEnergyTick = utils.getTick();
        //     this.decEnergy(3.25);
        // }
        if (this.cursors.left.isDown) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-50);
            this.sprite.anims.play("character_holyknight_move", true);
        } else if (this.cursors.right.isDown) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(50);
            this.sprite.anims.play("character_holyknight_move", true);
        } else {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play("character_holyknight_idle", true);
        }
    }


    private checkShieldEnd() {
        if (((utils.tickElapsed(this.lastShieldTick) >= 1200) && this.keyD.isDown) || (utils.tickElapsed(this.lastShieldTick) >= this.shieldEffect.getShieldDuration())) {
            this.sprite.setPushable(true);
            this.shieldEffect.destroy();
            this.isInvulnerable = false;
            this.lastShieldTick = utils.getTick();

            return true;
        }
        return false;
    }

    //ultimate ability
    private checkBlast() {
        if (this.sprite.body.touching.down && (this.lastBlastTick == undefined || (utils.tickElapsed(this.lastBlastTick) >= 1000)) && this.keySPACE.isDown && this.energyPoint >= this.blastEnergy) {
            this.lastBlastTick = utils.getTick();
            this.blastEnergyTick = utils.getTick();
            this.decEnergy(this.blastEnergy);
            return true;
        }
        return false;
    }

    private createBlastEffect() {
        this.blastEffect = new character_sword_blast(this.gameScene, this.collision, this.monsterControl, this.blastLevel);
        let pos = this.sprite.getCenter();
        let randomY = Phaser.Math.FloatBetween(-10, 10)
        this.blastEffect.create(pos.x, pos.y + randomY, this.blastChargingTime);

        if (!this.sprite.flipX) {
            this.blastEffect.sprite.setVelocityX(300);
        } else {
            this.blastEffect.sprite.flipX = true;
            this.blastEffect.sprite.setVelocityX(-300);
        }
        this.blastEffect.playAnims();
        this.sprite.anims.play("character_holyknight_attack", true);

        this.blastEffectArray.push(this.blastEffect);

    }

    private checkBlastHeal() {
        for (let i = 0; i < this.blastEffectArray.length; i++) {
            let heal = this.blastEffectArray[i].getHealthGained();
            if (heal > 0) {
                this.isHealed(heal);
            }
        }
    }

    private checkBlastEnd() {
        if ((utils.tickElapsed(this.lastBlastTick) >= 5000)) {
            // for (let i = 0; i < 10; i++) {
            //     this.blastEffectArray[i].destroy();
            // }
            return true;
        }
        return false;
    }

    public attackLevelUp(aAttack: number) {
        if (aAttack == 0) {
            this.slashLevel++;
            if (this.slashLevel > 15) {
                this.slashLevel = 15;
            }
        } else if (aAttack == 1) {
            this.chargeLevel++;
            if (this.chargeLevel > 15) {
                this.chargeLevel = 15;
            }
        } else if (aAttack == 2) {
            this.shieldLevel++
            if (this.shieldLevel > 15) {
                this.shieldLevel = 15;
            }
        } else {
            this.blastLevel++;
            if (this.blastLevel > 15) {
                this.blastLevel = 15;
            }
        }
        this.interface.changeAbilityLevel(this.slashLevel, this.chargeLevel, this.shieldLevel, this.blastLevel);
    }

    public getAttackLevel(aAttack: number) {
        if (aAttack == 0) {
            return this.slashLevel;
        } else if (aAttack == 1) {
            return this.chargeLevel;
        } else if (aAttack == 2) {
            return this.shieldLevel;
        } else {
            return this.blastLevel;
        }
    }

}
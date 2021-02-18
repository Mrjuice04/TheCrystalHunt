import { Scene } from "phaser";
import { animationFrameScheduler } from "rxjs";
import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { character_sword_dash } from 'src/app/modules/characters/character_holyknight/character_holyknight_dash'
import { character_sword_shield } from 'src/app/modules/characters/character_holyknight/character_holyknight_shield'
import { character_sword_slash } from 'src/app/modules/characters/character_holyknight/character_holyknight_slash'
import { monsterControl } from "../../monsters/monster_control";
import { game_interface } from 'src/app/modules/interface';
import { character_sword_blast } from 'src/app/modules/characters/character_holyknight/character_holyknight_blast'



export class character_swordsman {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    collision: collision;
    inAnims: boolean = false;
    monsterControl!: monsterControl;
    healthPoint: number = 100;
    energyPoint: number = 0;
    canAttack: boolean = true;
    canMove: boolean = true;
    isDead: boolean = false;

    private attackCounter: integer = 0;
    gameScene: Phaser.Scene;
    interface: game_interface;


    //tick
    private lastDashTick!: number;
    private lastShieldTick!: number;
    private lastSlashTick!: number;
    private lastBlastTick!: number;
    private blastChargingTime!: number;
    private initHeight!: number;
    private lastStunTick!: number;
    private lastJumpTick!: number;
    private stunnedTime!: number;

    //keys
    private keyZ!: Phaser.Input.Keyboard.Key;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyQ!: Phaser.Input.Keyboard.Key;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    //state
    private spriteStateValue: string = "idle";
    private slashStateValue: string = "idle";
    private shieldStateValue: string = "idle";
    private chargeStateValue: string = "idle";
    private blastStateValue: string = "idle";

    //effects
    private slashEffect!: character_sword_slash;
    private shieldEffect!: character_sword_shield;
    private chargeEffect!: character_sword_dash;
    private blastEffect!: character_sword_blast;

    //character 
    constructor(aScene: Phaser.Scene, aCollision: collision, aInterface: game_interface) {
        this.collision = aCollision;
        this.gameScene = aScene;
        this.interface = aInterface;

        this.gameScene.load.spritesheet("character_holyknight", "./assets/character_swordsman_test.png", { frameWidth: 30, frameHeight: 36 });
        this.gameScene.load.spritesheet("ability_dash", "./assets/sword_effect.png", { frameWidth: 24, frameHeight: 11 });
        this.gameScene.load.spritesheet("ability_slash", "./assets/sword_effect_2.png", { frameWidth: 31, frameHeight: 24 });
        this.gameScene.load.spritesheet("ability_shield", "./assets/shield_effect.png", { frameWidth: 64, frameHeight: 64 });
        this.gameScene.load.spritesheet("ability_blast", "./assets/blast_effect.png", { frameWidth: 104, frameHeight: 23 });
        this.gameScene.load.audio('ability_dash', './assets/audio/metal_015.wav');
        this.gameScene.load.audio('ability_shield', './assets/audio/249819__spookymodem__magic-smite.wav');
        this.gameScene.load.audio('ability_shield_2', './assets/audio/magic_063.wav');
        this.gameScene.load.audio('ability_slash', './assets/audio/hit-deep_034.wav');
        this.gameScene.load.audio('ability_slash_2', './assets/audio/metal_016.wav');
        this.gameScene.load.audio('character_damage', './assets/audio/hurt_007.wav');
        this.gameScene.load.audio('character_dead', './assets/audio/hurt_022.wav');

        //icons
        this.gameScene.load.image('basicAttack', './assets/slashIcon.png');
        this.gameScene.load.image('ability1', './assets/chargeIcon.png');
        this.gameScene.load.image("ability2", "./assets/shieldIcon1.png");

        //keys
        this.keyZ = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyA = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyQ = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.cursors = this.gameScene.input.keyboard.createCursorKeys();
    }

    public addMonsterControl(aMonsterControl: monsterControl) {
        this.monsterControl = aMonsterControl;
    }

    public create() {
        this.sprite = this.gameScene.physics.add.sprite(50, 500, "character_holyknight").setScale(0.7, 0.7);
        this.sprite.setCollideWorldBounds(true);
        this.collision.addPlayer(this);
        this.gameScene.sound.add('character_damage');
        this.gameScene.sound.add('character_dead');
    }


    public update() {
        if (!this.isDead) {
            this.slashMachine();
            this.chargeMachine();
            this.shieldMachine();
            this.spriteMachine();
            this.blastMachine();
            this.limitValues();
        }
    }

    public checkDeath() {
        return this.isDead;
    }

    public createAnims() {
        this.gameScene.anims.create({
            key: "move",
            frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1,
        });

        this.gameScene.anims.create({
            key: "idle",
            frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 7, end: 10 }),
            frameRate: 10,
            repeat: -1,
        });

        this.gameScene.anims.create({
            key: "die",
            frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 0, end: 4 }),
            frameRate: 10,
        })

        this.gameScene.anims.create({
            key: "attack",
            frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 21, end: 25 }),
            frameRate: 10,
        });

        this.gameScene.anims.create({
            key: "ability_dash",
            frames: this.gameScene.anims.generateFrameNumbers("ability_dash", { start: 0, end: 4 }),
            frameRate: 20,
        })

        this.gameScene.anims.create({
            key: "ability_slash",
            frames: this.gameScene.anims.generateFrameNumbers("ability_slash", { start: 0, end: 5 }),
            frameRate: 20,
        })

        this.gameScene.anims.create({
            key: "shield_effect",
            frames: this.gameScene.anims.generateFrameNumbers("ability_shield", { start: 0, end: 4 }),
            frameRate: 10,
        })

        this.gameScene.anims.create({
            key: "blast_effect",
            frames: this.gameScene.anims.generateFrameNumbers("ability_blast", { start: 0, end: 3 }),
            frameRate: 10,
        })
    }

    public isStunned(aTime: number) {
        this.sprite.setAccelerationX(0);
        this.sprite.setVelocityX(0);
        this.lastStunTick = utils.getTick();
        this.stunnedTime = aTime;
        this.spriteStateValue = "stunned"
    }

    public isDamaged(aDamage: number) {
        this.healthPoint -= aDamage;
        this.interface.changeHealthBar(this.healthPoint);
        this.sprite.setTint(0xF86161);
        setTimeout(() => {
            this.sprite.clearTint();
        }, 200)
        if (this.healthPoint <= 0) {
            this.gameScene.sound.play('character_dead');
        }
        else {
            setTimeout(() => {
                this.gameScene.sound.play('character_damage');
            }, 200)
        }
    }


    private isStunEnd() {
        if (utils.tickElapsed(this.lastStunTick) >= this.stunnedTime) {
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
                } else {
                    this.isIdle();
                }
                break;
            }
            case "walking": {
                if (!this.canMove) {
                    this.spriteStateValue = "idle";
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
                } else if (!this.doWalking()) {
                    this.spriteStateValue = "idle";
                }
                break;
            }
            case "jumping": {
                this.doWalking();
                if (this.check_doubleJump()) {
                    this.do_doubleJump();
                    this.spriteStateValue = "doubleJumping";
                } else if (this.is_jump_end()) {
                    this.spriteStateValue = "idle"
                } else if (this.checkShield()) {
                    this.spriteStateValue = "attacking_spin_1";
                }
                break;
            }
            case "doubleJumping": {
                this.doWalking();
                if (this.is_jump_end()) {
                    this.spriteStateValue = "idle"
                }
                break;
            }
            case "stunned": {
                if (this.isStunEnd()) {
                    console.log("stunned");
                    this.spriteStateValue = "idle";
                }
                break;
            }
            case "attacking": {
                if (this.slashStateValue == "idle" && (this.shieldStateValue == "idle" || this.shieldStateValue == "playing") && this.chargeStateValue == "idle" && this.blastStateValue == "idle") {
                    this.spriteStateValue = "idle";
                }
                break;
            }
            case "dying": {
                this.sprite.anims.play("die", true);
                this.spriteStateValue = "dead";
                break;
            }
            case "dead": {
                this.isDead = true;
                break;
            }
            default: {
                this.spriteStateValue = "idle"
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
                this.sprite.setVelocityX(0);
                this.doSlash();
                this.createSlashEffect();
                this.spriteStateValue = "idle";
                this.slashStateValue = "playing";
                break;
            }
            case "playing": {
                this.updateSlashEffect();
                if (this.checkSlashEnd()) {
                    this.slashStateValue = "idle";
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
                if (this.checkChargeEnd()) {
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
                this.shieldStateValue = "playing1";

                break;
            }
            case "playing1": {
                this.useShield();
                if (this.checkPlayerShieldAnimEnd()) {
                    this.spriteStateValue = "idle";
                    this.shieldStateValue = "playing2";
                }
                break;
            }
            case "playing2": {
                this.updateShieldEffect();
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
                if (this.doBlast()){
                    this.createBlastEffect();
                    this.blastStateValue = "playing";
                    this.spriteStateValue = "idle";
                };
                break;
            }
            case "playing": {
                if (this.checkBlastEnd()) {
                    // this.spriteStateValue = "idle";
                    this.blastStateValue = "idle";
                }
                break;
            }
        }
    } 

    private isIdle() {
        this.sprite.setVelocityX(0);
        this.sprite.body.setAllowGravity(true);
        if (this.slashStateValue == "idle" && (this.shieldStateValue == "idle" || this.shieldStateValue == "playing") && this.chargeStateValue == "idle") {
            this.sprite.anims.play("idle", true);
        }
    }

    private checkWalking() {
        if ((this.cursors.left.isDown || this.cursors.right.isDown) && this.sprite.body.touching.down) {
            this.lastSlashTick = utils.getTick();
            return true;
        }
        return false;
    }

    private doWalking() {
        if (this.cursors.left.isDown) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-100);
            if (this.slashStateValue == "idle" && (this.shieldStateValue == "idle" || this.shieldStateValue == "playing") && this.chargeStateValue == "idle") {
                this.sprite.anims.play("move", true);
            }
            return true;
        } else if (this.cursors.right.isDown) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(100);
            if (this.slashStateValue == "idle" && (this.shieldStateValue == "idle" || this.shieldStateValue == "playing") && this.chargeStateValue == "idle") {
                this.sprite.anims.play("move", true);
            }
            return true;
        } else {
            this.sprite.setVelocityX(0);
            return false;
        }
    }

    private checkJump(): boolean {
        if (this.canMove && this.sprite.body.touching.down && this.cursors.up.isDown) {
            return true;
        }
        return false;
    }

    private doJump() {
        this.initHeight = this.sprite.getCenter().y;
        this.sprite.setVelocityY(-200);
        this.lastJumpTick = utils.getTick();
    }

    private check_doubleJump(): boolean {
        let curr_height = this.sprite.getCenter().y;
        if (this.canMove && (((curr_height - this.initHeight) <= -40) || (utils.tickElapsed(this.lastJumpTick) >= 400) || this.lastJumpTick == undefined) && this.cursors.up.isDown) {
            return true;
        }
        return false;
    }

    private do_doubleJump() {
        this.sprite.setVelocityY(-150);
    }

    private is_jump_end() {
        if (this.sprite.body.touching.down) {
            return true;
        }
        return false;
    }


    //basic Attack
    private checkSlash() {
        if (((this.lastSlashTick == undefined) || (utils.tickElapsed(this.lastSlashTick) >= 500)) && this.keyA.isDown) {
            this.lastSlashTick = utils.getTick();
            return true;
        }
        return false;
    }

    private doSlash() {
        this.sprite.anims.play("attack", true);
    }

    private createSlashEffect() {
        this.slashEffect = new character_sword_slash(this.gameScene, this.collision, this.monsterControl);
        let pos = this.sprite.getCenter();
        if (!this.sprite.flipX) {
            pos.x += 15;
        } else {
            pos.x -= 15;
        }
        this.slashEffect.create(pos.x, pos.y);

        if (this.attackCounter % 2 == 0) {
            this.slashEffect.sprite.flipX = true;
        }

        this.attackCounter++;
        this.slashEffect.playAnims();
    }

    private updateSlashEffect() {
        let pos = this.sprite.getCenter();
        if (!this.sprite.flipX) {
            this.slashEffect.sprite.setPosition(pos.x + 10, pos.y)
        } else {
            this.slashEffect.sprite.setPosition(pos.x - 10, pos.y)
        }
        this.energyPoint += this.slashEffect.getEnergy();
        this.interface.changeEnergyBar(this.energyPoint);
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
        if (this.sprite.body.touching.down && ((this.lastDashTick == undefined) || (utils.tickElapsed(this.lastDashTick) >= 800)) && this.keyS.isDown && this.energyPoint >= 25) {
            this.lastDashTick = utils.getTick();
            this.energyPoint -= 25;
            this.interface.changeEnergyBar(this.energyPoint);
            return true;
        }
        return false;
    }

    private doCharge() {
        if ((utils.tickElapsed(this.lastDashTick) >= 410)) {
            if (!this.sprite.flipX) {
                this.sprite.setVelocityX(300);
            } else {
                this.sprite.setVelocityX(-300);
            }
        }
    }

    private createChargeEffect() {
        this.chargeEffect = new character_sword_dash(this.gameScene, this.collision, this.monsterControl);
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
        this.sprite.anims.play("attack", true);
    }

    private updateChargeEffect() {
        let pos = this.sprite.getCenter();
        if (!this.sprite.flipX) {
            this.chargeEffect.sprite.setPosition(pos.x + 10, pos.y + 3)
        } else {
            this.chargeEffect.sprite.setPosition(pos.x - 10, pos.y + 3)
        }
    }

    private checkChargeEnd() {
        if ((utils.tickElapsed(this.lastDashTick) >= 1500)) {
            this.chargeEffect.destroy();
            return true;
        }
        return false;
    }

    //ability 2
    private checkShield() {
        if ((this.lastShieldTick == undefined || (utils.tickElapsed(this.lastShieldTick) >= 3300)) && this.keyD.isDown && this.energyPoint >= 50) {
            this.lastShieldTick = utils.getTick();
            this.energyPoint -= 50;
            this.interface.changeEnergyBar(this.energyPoint);
            return true;
        }
        return false;
    }

    private useShield() {
        this.sprite.setVelocityX(0);
    }

    private checkPlayerShieldAnimEnd() {
        this.updateShieldEffect();
        if ((utils.tickElapsed(this.lastShieldTick) >= 900)) {
            return true;
        }
        return false;
    }

    private createShieldEffect() {
        this.shieldEffect = new character_sword_shield(this.gameScene, this.collision, this.monsterControl);
        let pos = this.sprite.getCenter();
        this.shieldEffect.create(pos.x, pos.y);
    }

    private updateShieldEffect() {
        let pos = this.sprite.getCenter();
        this.shieldEffect.sprite.setPosition(pos.x, pos.y);
    }


    private checkShieldEnd() {
        if ((utils.tickElapsed(this.lastShieldTick) >= 5000)) {
            this.shieldEffect.destroy();
            return true;
        }
        return false;
    }

    //ultimate ability
    private checkBlast() {
        if (this.sprite.body.touching.down && (this.lastBlastTick == undefined || (utils.tickElapsed(this.lastBlastTick) >= 1000)) && this.keyQ.isDown && this.energyPoint >= 100) {
            this.lastBlastTick = utils.getTick();
            this.energyPoint -= 100;
            this.interface.changeEnergyBar(this.energyPoint);
            return true;
        }
        return false;
    }

    private doBlast() {
        this.sprite.setVelocityX(0);
        if (this.keyQ.isUp) {
            this.blastChargingTime = this.keyQ.duration;
            this.lastBlastTick = utils.getTick();
            return true;
        } else if (this.keyQ.getDuration() >= 2000) {
            this.blastChargingTime = 2000;
            this.lastBlastTick = utils.getTick();
            return true;
        }
        return false;
    }

    private createBlastEffect() {
        this.blastEffect = new character_sword_blast(this.gameScene, this.collision, this.monsterControl);
        let pos = this.sprite.getBottomCenter();
        this.blastEffect.create(pos.x, pos.y - 11, this.blastChargingTime);

        if (!this.sprite.flipX) {
            this.blastEffect.sprite.setVelocityX(this.blastChargingTime / 2 + 50);
        } else {
            this.blastEffect.sprite.flipX = true;
            this.blastEffect.sprite.setVelocityX(-1 * this.blastChargingTime / 2 - 50);
        }


        this.blastEffect.playAnims();
        this.sprite.anims.play("attack", true);
    }

    private checkBlastEnd() {
        if ((utils.tickElapsed(this.lastBlastTick) >= 2000)) {
            this.blastEffect.destroy();
            return true;
        }
        return false;
    }

    private limitValues() {
        if (this.energyPoint <= 0) {
            this.energyPoint = 0;
        } else if (this.energyPoint >= 100) {
            this.energyPoint = 100;
        }

        if (this.healthPoint >= 100) {
            this.healthPoint = 100;
        } else if (this.healthPoint <= 0) {
            if (this.spriteStateValue != "dying" && this.spriteStateValue != "dead") {
                this.spriteStateValue = "dying";
                this.sprite.setPushable(false);
            }
        }
    }


}
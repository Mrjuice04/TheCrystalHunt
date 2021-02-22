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
    isInvulnerable: boolean = false;

    private attackCounter: integer = 0;
    gameScene: Phaser.Scene;
    interface: game_interface;


    //tick
    private lastDashTick!: number;
    private lastShieldTick!: number;
    private shieldEnergyTick!: number;
    private lastSlashTick!: number;
    private lastBlastTick!: number;
    private blastChargingTime!: number;
    private blastEnergyTick!: number
    private initHeight!: number;
    private lastJumpTick!: number;
    private lastStunTick!: number;
    private stunnedTime!: number;
    private lastDogeTick!: number;

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
    private dogeStateValue: string = "idle";

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

        this.gameScene.load.audio('ability_dash', './assets/audio/metal_015.wav');
        this.gameScene.load.audio('ability_shield', './assets/audio/249819__spookymodem__magic-smite.wav');
        this.gameScene.load.audio('ability_shield_2', './assets/audio/magic_063.wav');
        this.gameScene.load.audio('ability_slash', './assets/audio/hit-deep_034.wav');
        this.gameScene.load.audio('ability_slash_2', './assets/audio/metal_016.wav');
        this.gameScene.load.audio('character_damage', './assets/audio/hurt_007.wav');
        this.gameScene.load.audio('character_dead', './assets/audio/hurt_022.wav');

        //character sprite
        this.gameScene.load.spritesheet("character_holyknight", "./assets/characters/character_holyknight/character_holyknight.png", { frameWidth: 30, frameHeight: 36 });

        //skill effects
        this.gameScene.load.spritesheet("ability_dash", "./assets/characters/character_holyknight/charge_effect.png", { frameWidth: 24, frameHeight: 11 });
        this.gameScene.load.spritesheet("ability_slash", "./assets/characters/character_holyknight/slash_effect.png", { frameWidth: 31, frameHeight: 24 });
        this.gameScene.load.spritesheet("ability_shield", "./assets/characters/character_holyknight/shield_effect.png", { frameWidth: 64, frameHeight: 64 });
        this.gameScene.load.spritesheet("ability_blast", "./assets/characters/character_holyknight/blast_effect.png", { frameWidth: 104, frameHeight: 23 });

        //icons
        this.gameScene.load.image('basicAttack', './assets/characters/character_holyknight/slash_icon.png');
        this.gameScene.load.image('ability1', './assets/characters/character_holyknight/charge_icon.png');
        this.gameScene.load.image("ability2", "./assets/characters/character_holyknight/shield_icon.png");
        this.gameScene.load.image("ultimate", "./assets/characters/character_holyknight/blast_icon.png");


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
            this.dogeMachine();
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
            key: "doge",
            frames: this.gameScene.anims.generateFrameNumbers("character_holyknight", { start: 28, end: 33 }),
            frameRate: 10,
        })

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
        if (!this.isInvulnerable) {
            this.sprite.setAccelerationX(0);
            this.sprite.setVelocityX(0);
            this.lastStunTick = utils.getTick();
            this.stunnedTime = aTime;
            this.spriteStateValue = "stunned"
            this.chargeStateValue = "idle";
        }
    }

    public isDamaged(aDamage: number) {
        if (!this.isInvulnerable) {
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
                } else if (this.checkShield()) {
                    this.spriteStateValue = "attacking_spin_1";
                }
                break;
            }
            case "doubleJumping": {
                this.doWalking();
                if (this.isJumpEnd()) {
                    this.spriteStateValue = "idle"
                }
                break;
            }
            case "dodging":{
                if (this.dogeStateValue == "idle"){
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
                if (this.checkDogeEnd()){
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
                if (this.doBlast()) {
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
        if (this.sprite.body.touching.down && this.cursors.up.isDown) {
            return true;
        }
        return false;
    }

    private doJump() {
        this.initHeight = this.sprite.getCenter().y;
        this.sprite.setVelocityY(-200);
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
        if (this.sprite.body.touching.down && this.cursors.down.isDown && (utils.tickElapsed(this.lastDogeTick) >= 1000 || this.lastDogeTick == undefined)) {
            this.lastDogeTick = utils.getTick();
            return true;
        }
        return false;
    }

    private doDoge() {
        if (!this.sprite.flipX) {
            this.sprite.setVelocityX(125);
        } else {
            this.sprite.setVelocityX(-125);
        }
        this.isInvulnerable = true;
        this.sprite.setPushable(false);
        this.sprite.anims.play("doge");
    }

    private checkDogeEnd() {
        if(utils.tickElapsed(this.lastDogeTick) >= 500){
            this.isInvulnerable = false;
            this.sprite.setPushable(true);

            return true;
        }
        return false;

    }

    //character specific
    //basic Attack
    private checkSlash() {
        if (((this.lastSlashTick == undefined) || (utils.tickElapsed(this.lastSlashTick) >= 600)) && this.keyA.isDown) {
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
        if (this.sprite.body.touching.down && ((this.lastDashTick == undefined) || (utils.tickElapsed(this.lastDashTick) >= 800)) && this.keyS.isDown && this.energyPoint >= 25) {
            this.lastDashTick = utils.getTick();
            this.decEnergy(25);
            return true;
        }
        return false;
    }

    private doCharge() {
        if ((utils.tickElapsed(this.lastDashTick) >= 410)) {
            if (!this.sprite.flipX) {
                this.sprite.setVelocityX(360);
            } else {
                this.sprite.setVelocityX(-360);
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
        if ((utils.tickElapsed(this.lastDashTick) >= 1250)) {
            this.chargeEffect.destroy();
            return true;
        }
        return false;
    }

    //ability 2
    private checkShield() {
        if ((this.lastShieldTick == undefined || (utils.tickElapsed(this.lastShieldTick) >= 3300)) && this.keyD.isDown && this.energyPoint >= 50) {
            this.lastShieldTick = utils.getTick();
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
        this.shieldEffect = new character_sword_shield(this.gameScene, this.collision, this.monsterControl);
        let pos = this.sprite.getCenter();
        this.shieldEffect.create(pos.x, pos.y);
        this.shieldEnergyTick = utils.getTick();
    }

    private updateShieldEffect() {
        let pos = this.sprite.getCenter();
        this.shieldEffect.sprite.setPosition(pos.x, pos.y);
        if (utils.tickElapsed(this.shieldEnergyTick) >= 250) {
            this.shieldEnergyTick = utils.getTick();
            this.decEnergy(3.25);
        }
        if (this.cursors.left.isDown) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-50);
            this.sprite.anims.play("move", true);
        } else if (this.cursors.right.isDown) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(50);
            this.sprite.anims.play("move", true);
        } else {
            this.sprite.setVelocityX(0);
        }
    }


    private checkShieldEnd() {
        if ((this.energyPoint <= 0) || ((utils.tickElapsed(this.lastShieldTick) >= 1500) && this.keyD.isDown) || (utils.tickElapsed(this.lastShieldTick) >= 5000)) {
            this.sprite.setPushable(true);
            this.shieldEffect.destroy();
            return true;
        }
        return false;
    }

    //ultimate ability
    private checkBlast() {
        if (this.sprite.body.touching.down && (this.lastBlastTick == undefined || (utils.tickElapsed(this.lastBlastTick) >= 1000)) && this.keyQ.isDown && this.energyPoint >= 75) {
            this.lastBlastTick = utils.getTick();
            this.blastEnergyTick = utils.getTick();
            this.decEnergy(10);
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
        } else if (this.spriteStateValue == "stunned") {
            this.blastChargingTime = this.keyQ.getDuration();
            this.lastBlastTick = utils.getTick();
        }
        if (utils.tickElapsed(this.blastEnergyTick) >= 250) {
            this.blastEnergyTick = utils.getTick();
            this.decEnergy(6.25);
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

    private decEnergy(aNumber: number) {
        if (this.energyPoint >= aNumber) {
            this.energyPoint -= aNumber;
        } else {
            this.energyPoint = 0;
        }
        this.interface.changeEnergyBar(this.energyPoint);
    }

    private incEnergy(aNumber: number) {
        this.energyPoint += aNumber;
        if (this.energyPoint >= 100) {
            this.energyPoint = 100;
        }
        this.interface.changeEnergyBar(this.energyPoint);
    }

    private limitValues() {

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
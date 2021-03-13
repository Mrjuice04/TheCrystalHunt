import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { collision } from 'src/app/modules/collision';
import { monster_hog_charge } from 'src/app/modules/monsters/monster_hog/monster_hog_charge';
import { utils } from 'src/app/modules/utils';
import { character_swordsman } from '../../characters/character_holyknight/character_holyknight';

export class monster_hog {
    name: string = "zombie";
    collision: collision;
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    monsterToPlayerX!: number;
    monsterToPlayerY!: number;
    healthPoint: number = 500;
    maxHealthPoint: number = 500;
    canSpawnMonster: boolean = false;
    gridArray: integer[][];
    state_value: string = "walking";
    jump_target!: number;
    maxVelocityX: number = Math.round(Phaser.Math.Between(75, 95));
    destoryed: boolean = false;
    targetPlayer!: character_swordsman;

    public itemDropChance: number = 0.4;


    // ticks
    private lastAttackTick!: number;
    private lastJumpTick!: number;
    private lastDashTick!: number;
    private lastChargeTick!: number;
    private lastStunTick!: number;
    private lastSearchTick!: number
    private stunnedTime!: number;

    private jumpStateValue: string = "idle";
    private jumpEndTick!: number;

    private dashStateValue: string = "idle";

    private chargeStateValue: string = "idle";
    private chargeEffect!: monster_hog_charge;

    constructor(aScene: Phaser.Scene, aCollision: collision, aGridArray: integer[][]) {
        this.collision = aCollision;
        this.gameScene = aScene;
        this.gridArray = aGridArray;
    }

    static loadSprite(aScene: Phaser.Scene) {
        aScene.load.spritesheet("monster_hog", "./assets/monsters/monster_hog/monster_hog.png", { frameWidth: 56, frameHeight: 80 });
        aScene.load.spritesheet("monster_hog_charge_effect", "./assets/monsters/monster_hog/monster_hog_charge.png", { frameWidth: 98, frameHeight: 80 });
        aScene.load.audio('monster_hog_damage', './assets/audio/hurt_222.wav');
        aScene.load.audio('monster_hog_dead', './assets/audio/hurt_251.wav');
        aScene.load.audio('monster_hog_attack', './assets/audio/CCA_116.wav');
    }

    //General Public Function
    public create(aScene: Phaser.Scene, pos_x: number, pos_y: number) {
        this.sprite = aScene.physics.add.sprite(pos_x, pos_y, "monster_hog").setScale(0.45, 0.45);
        this.sprite.setCollideWorldBounds(true);
        let directionRoll = Math.random();
        if (directionRoll > 0.5){
            this.sprite.setVelocityX(-100);
        } else {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(100);
        }
        this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
        this.sprite.setPushable(false);
        this.sprite.anims.play("monster_hog_move");

        this.gameScene.sound.add('monster_hog_damage');
        this.gameScene.sound.add('monster_hog_dead');
        this.gameScene.sound.add('monster_hog_attack');
        this.collision.addMonster(this);
    }

    public update() {
        this.machine();
        this.jumpMachine();
        this.dashMachine();
        this.chargeMachine();
    }

    public getPostision(aPlayerPosition: Phaser.Math.Vector2) {
        let monsterposition = this.sprite.getCenter();
        this.monsterToPlayerX = monsterposition.x - aPlayerPosition.x
        this.monsterToPlayerY = monsterposition.y - aPlayerPosition.y
    }

    public isDamaged(aDamage: number) {
        this.healthPoint -= aDamage;
        this.sprite.setTint(0xF86161);
        setTimeout(() => {
            if (this.sprite.tintTopLeft == 0xF86161) {
                this.sprite.clearTint();
            }
        }, 200)
        if (this.healthPoint <= 0) {
            this.gameScene.sound.play('monster_hog_dead');
        }
        else {
            let rand_sound = Math.floor(Math.random() * 3) + 1;
            this.gameScene.sound.play(`monster_hog_damage`);
        }
    }

    public isHealed(aHeal: number) {
        this.healthPoint += aHeal;
        if (this.healthPoint > this.maxHealthPoint) {
            this.healthPoint = this.maxHealthPoint;
        }
        this.sprite.setTint(0xBCF5A9);
        setTimeout(() => {
            if (this.sprite.tintTopLeft == 0xBCF5A9) {
                this.sprite.clearTint();
            }
        }, 200)
    }

    public getMaxHealth(){
        return this.maxHealthPoint;
    }

    public getCurrHealth() {
        return this.healthPoint;
    }

    public isSlowed(slowPercent: number) {
        let velocityX = this.sprite.body.velocity.x * slowPercent;
        this.sprite.setVelocityX(velocityX);
    }

    public isStunned(aTime: number) {
        if (this.destoryed) {
            return;
        }
        this.sprite.setAccelerationX(0);
        this.sprite.setVelocityX(0);
        this.sprite.setPushable(true);
        this.lastStunTick = utils.getTick();
        this.stunnedTime = aTime;
        this.state_value = "stunned";
        this.chargeStateValue = "idle";
        if (this.chargeEffect !== undefined){
            this.chargeEffect.destroy();
        }
    }

    public isKnockbacked(aVelocityX: number, aVelocityY: number, aTime: number, aStun: boolean, aStunTime: number) {
        if (this.destoryed) {
            return;
        }
        this.sprite.setAccelerationX(0);
        this.sprite.setMaxVelocity(aVelocityX, 10000);
        this.sprite.setVelocity(aVelocityX, aVelocityY);
        this.sprite.setPushable(true);
        this.lastStunTick = utils.getTick();
        this.stunnedTime = aTime;
        this.state_value = "stunned";
        this.chargeStateValue = "idle";
        if (this.chargeEffect !== undefined){
            this.chargeEffect.destroy();
        }
        if (aStun) {
            setTimeout(() => {
                if (this.sprite) {
                    this.isStunned(aStunTime);
                }
            }, aTime)
        }
    }

    public createAnims(aScene: Phaser.Scene) {
        this.gameScene.anims.create({
            key: "monster_hog_move",
            frames: this.gameScene.anims.generateFrameNumbers("monster_hog", { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1,
        });

        this.gameScene.anims.create({
            key: "monster_hog_die",
            frames: this.gameScene.anims.generateFrameNumbers("monster_hog", { start: 0, end: 4 }),
            frameRate: 10,
        })

        this.gameScene.anims.create({
            key: "monster_hog_idle",
            frames: this.gameScene.anims.generateFrameNumbers("monster_hog", { start: 7, end: 10 }),
            frameRate: 10,
            repeat: -1,
        });

        this.gameScene.anims.create({
            key: "monster_hog_charge_effect",
            frames: this.gameScene.anims.generateFrameNumbers("monster_hog_charge_effect", { start: 0, end: 5 }),
            frameRate: 10,
        });
    }




    //Character Functions
    private machine() {
        switch (this.state_value) {
            case "idle": {

                break;
            }
            case "walking": {
                if (this.checkJump()) {
                    this.state_value = "jumping";
                    this.jumpStateValue = "start";
                } else if (this.checkCharge()) {
                    this.gameScene.sound.play("monster_hog_attack")
                    this.chargeStateValue = "start";
                    this.state_value = "charging";
                } else if (this.checkDash()) {
                    this.state_value = "dashing";
                    this.dashStateValue = "start";
                } else {
                    this.sprite.setMaxVelocity(this.maxVelocityX, 10000)
                    this.walking();
                }
                break;
            }
            case "jumping": {
                if (this.jumpStateValue == "idle") {
                    this.state_value = "walking";
                }
                break;
            }
            case "charging": {
                if (this.chargeStateValue == "idle") {
                    this.state_value = "walking";
                }
                break;
            }
            case "dashing": {
                if (this.dashStateValue == "idle") {
                    this.state_value = "walking";
                }
                break;
            }
            case "stunned": {
                this.sprite.setVelocityX(0);
                if (this.isStunEnd()) {
                    this.sprite.setPushable(false);
                    this.state_value = "walking";
                }
                break;
            }
            default: {
                this.state_value = "walking";
                break;
            }
        }
    }


    private walking() {
        if (this.monsterToPlayerY <= 10 && this.monsterToPlayerY >= -10) {
            if (this.sprite.flipX) {
                if (this.monsterToPlayerX <= 0) {
                    this.sprite.flipX = false;
                    this.sprite.setAccelerationX(100);
                } else {
                    this.sprite.setAccelerationX(-100);
                }
            } else {
                if (this.monsterToPlayerX >= 0) {
                    this.sprite.flipX = true;
                    this.sprite.setAccelerationX(-100);
                } else {
                    this.sprite.setAccelerationX(100);
                }
            }
        } else {
            if (((this.lastSearchTick == undefined) || (utils.tickElapsed(this.lastSearchTick) >= 5000))) {
                this.lastSearchTick = utils.getTick();
            }
            if (!this.sprite.flipX) {
                this.sprite.setAccelerationX(100);
            } else {
                this.sprite.setAccelerationX(-100);
            }
            if (this.sprite.getCenter().x <= 40) {
                this.sprite.setAccelerationX(100);
                this.sprite.flipX = false;
            }
            else if (this.sprite.getCenter().x >= 760) {
                this.sprite.setAccelerationX(-100);
                this.sprite.flipX = true;
            }
        }
    }

    private jumpMachine() {
        switch (this.jumpStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.sprite.setVelocityX(0);
                if ((utils.tickElapsed(this.lastJumpTick) >= 500)) {
                    this.doJump();
                    this.jumpStateValue = "jumping";
                }
                break;
            }
            case "jumping": {
                if (this.checkJumpHeight()) {
                    console.log("move")
                    this.jumpStateValue = "jump_end";
                    this.jumpEndTick = utils.getTick();
                    this.moveAfterJump();

                } else if (this.sprite.body.velocity.y > 0 && !this.checkJumpHeight()) {
                    this.jumpStateValue = "idle";
                }
                break;
            }
            case "jump_end": {
                if (this.sprite.body.velocity.y) {
                    this.jumpStateValue = "idle";
                }
                break;
            }
            default: {
                this.jumpStateValue = "idle";
                break;
            }
        }
    }

    private dashMachine() {
        switch (this.dashStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.sprite.setVelocityX(0);
                if (utils.tickElapsed(this.lastDashTick) >= 500) {
                    this.doDash();
                    this.dashStateValue = "dashing";
                }
                // this.sprite.setBodySize(40, 40);
                break;
            }
            case "dashing": {
                if (this.sprite.body.touching.down) {
                    this.dashStateValue = "idle";
                    // this.sprite.setBodySize(56, 80);
                    this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
                }
                break;
            }
            default: {
                this.dashStateValue = "idle";
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
                if (utils.tickElapsed(this.lastChargeTick) >= 750) {
                    this.doCharge();
                    this.createChargeEffect();
                    this.chargeStateValue = "charging";
                }
                break;
            }
            case "charging": {
                this.updateChargeEffect();
                if (this.checkChargeEnd()) {
                    this.chargeStateValue = "idle";
                    this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
                }
                break;
            }
            default: {
                this.chargeStateValue = "idle";
                break;
            }
        }
    }

    private checkJump(): boolean {
        if (((this.lastJumpTick == undefined) || (utils.tickElapsed(this.lastJumpTick) >= 1500))) {
            if (this.sprite.body.touching.down && this.monsterToPlayerY >= 50) {
                let curr_col;
                if (!this.sprite.flipX) {
                    curr_col = Math.round((this.sprite.getCenter().x - 25) / 25);
                } else {
                    curr_col = Math.round((this.sprite.getCenter().x) / 25);
                }
                let curr_row = Math.round((this.sprite.getCenter().y + 10) / 25);
                let above_value = this.gridArray[curr_row - 3][curr_col];
                let next_above_value_1;
                if (!this.sprite.flipX) {
                    next_above_value_1 = this.gridArray[curr_row - 3][curr_col + 1]
                } else {
                    next_above_value_1 = this.gridArray[curr_row - 3][curr_col - 1]
                }
                let next_above_value_2;
                if (!this.sprite.flipX) {
                    next_above_value_2 = this.gridArray[curr_row - 3][curr_col + 2]
                } else {
                    next_above_value_2 = this.gridArray[curr_row - 3][curr_col - 2]
                }

                if (above_value == 0 && (next_above_value_1 == 1 || next_above_value_2 == 1)) {
                    this.jump_target = (curr_row - 3) * 25
                    console.log(this.jump_target);
                    this.lastJumpTick = utils.getTick();
                    return true;
                }
            }
        }
        return false;
    }

    private doJump() {
        this.sprite.setAccelerationX(0);
        this.sprite.setVelocityX(0);
        this.sprite.setVelocityY(-300);
    }

    private checkJumpHeight(): boolean {
        let curr_height = this.sprite.getCenter().y
        if (curr_height <= this.jump_target) {
            return true;
        }
        return false;
    }

    private moveAfterJump() {
        if (!this.sprite.flipX) {
            this.sprite.setAccelerationX(100);
            this.sprite.setMaxVelocity(200, 100000);
            this.sprite.setVelocityX(100);
        } else {
            this.sprite.setAccelerationX(-100);
            this.sprite.setMaxVelocity(200, 100000);
            this.sprite.setVelocityX(-100);
        }
    }

    private checkDash() {
        if (((this.lastDashTick == undefined) || (utils.tickElapsed(this.lastDashTick) >= 900))) {
            if (this.sprite.body.touching.down && this.monsterToPlayerY >= 0) {
                let curr_col;
                if (!this.sprite.flipX) {
                    curr_col = Math.round((this.sprite.getCenter().x - 25) / 25);
                } else {
                    curr_col = Math.round((this.sprite.getCenter().x) / 25);
                }
                let curr_row = Math.round((this.sprite.getCenter().y + 10) / 25);
                console.log(curr_row)
                let next_col_value;
                if (!this.sprite.flipX) {
                    next_col_value = this.gridArray[curr_row][curr_col + 1];
                } else {
                    next_col_value = this.gridArray[curr_row][curr_col - 1];
                }

                if (next_col_value == 0) {
                    this.lastDashTick = utils.getTick();
                    return true;
                }
            }
        }
        return false;
    }

    private doDash() {
        if (this.sprite.flipX == false) {
            this.sprite.setMaxVelocity(200, 10000);
            this.sprite.setVelocity(200, -60);
        } else if (this.sprite.flipX == true) {
            this.sprite.setMaxVelocity(200, 10000);
            this.sprite.setVelocity(-200, -60);
        }
    }


    private checkCharge(): boolean {
        if (this.monsterToPlayerY <= 10 && this.monsterToPlayerY >= -10) {
            if ((this.sprite.flipX && this.monsterToPlayerX >= 0 && this.monsterToPlayerX <= 400) || (!this.sprite.flipX && this.monsterToPlayerX <= 0 && this.monsterToPlayerX >= -400)) {
                if (this.sprite.body.touching.down) {
                    if (((this.lastChargeTick == undefined) || (utils.tickElapsed(this.lastChargeTick) >= 5000))) {
                        this.lastChargeTick = utils.getTick();
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private doCharge() {
        if (!this.sprite.flipX) {
            this.sprite.setMaxVelocity(360, 10000);
            this.sprite.setVelocityX(360);
        } else {
            this.sprite.setMaxVelocity(360, 10000);
            this.sprite.setVelocityX(-360);
        }
    }

    private createChargeEffect() {
        this.chargeEffect = new monster_hog_charge(this.gameScene, this.collision);
        let pos = this.sprite.getCenter();
        this.chargeEffect.create(pos.x, pos.y);
        if (this.sprite.flipX) {
            this.chargeEffect.sprite.flipX = true;
        }
        this.chargeEffect.playAnims();
        setTimeout(() => {
            this.collision.addMonsterAttack(this.chargeEffect);
        }, 100)
    }

    private updateChargeEffect() {
        let pos = this.sprite.getCenter();
        if (!this.sprite.flipX) {
            this.chargeEffect.sprite.setPosition(pos.x + 5, pos.y)
        } else {
            this.chargeEffect.sprite.setPosition(pos.x - 5, pos.y)
        }
        this.targetPlayer = this.chargeEffect.getTargetPlayer();
    }

    private checkChargeEnd() {
        if (utils.tickElapsed(this.lastChargeTick) >= 1600) {
            this.chargeEffect.destroy();
            return true;
        }
        if (!this.sprite.flipX && this.sprite.body.touching.right && utils.tickElapsed(this.lastChargeTick) >= 1600){
            console.log(this.targetPlayer);
            if (this.targetPlayer != undefined){
                console.log("oofed");
                return false;
            }
            this.isStunned(500);
            this.chargeEffect.destroy();
            return true;
        } else if (this.sprite.flipX && this.sprite.body.touching.left && utils.tickElapsed(this.lastChargeTick) >= 1600 ){
            console.log(this.targetPlayer);
            if (this.targetPlayer != undefined){
                console.log("oofed");
                return false;
            }
            this.isStunned(500);
            this.chargeEffect.destroy();
            return true;
        }
        return false;
    }

    private isStunEnd() {
        if (utils.tickElapsed(this.lastStunTick) >= this.stunnedTime) {
            this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
            this.sprite.setVelocityX(1);
            return true;
        }
        return false;
    }



    private findPlayer() {
        if (this.sprite.flipX == true) {
            if (this.monsterToPlayerX <= 0) {
                this.sprite.flipX = false;
            }
        } else if (this.sprite.flipX == false) {
            if (this.monsterToPlayerX >= 0) {
                this.sprite.flipX = true;
            }
        }
    }

    public destroy() {
        this.sprite.play("monster_hog_die", true)
        this.destoryed = true;
        setTimeout(() => {
            this.sprite.destroy();
        }, 500)
    }


}

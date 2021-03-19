import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { collision } from 'src/app/modules/collision';
import { monster_mummy_bandage } from 'src/app/modules/monsters/monster_mummy/monster_mummy_bandage';
import { utils } from 'src/app/modules/utils';

export class monster_mummy {
    name: string = "zombie";
    collision: collision;
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    monsterToPlayerX!: number;
    monsterToPlayerY!: number;
    healthPoint: number = 300;
    maxHealthPoint: number = 300;
    canSpawnMonster: boolean = false;
    gridArray: integer[][];
    stateValue: string = "walking";
    jump_target!: number;
    maxVelocityX: number = Math.round(Phaser.Math.Between(90, 125));
    destoryed: boolean = false;

    public itemDropChance: number = 0.4;
    

    // ticks
    private lastJumpTick!: number;
    private lastDashTick!: number;
    private lastStunTick!: number;
    private lastSearchTick!: number
    private stunnedTime!: number;

    private jumpStateValue: string = "idle";
    private dashStateValue: string = "idle";
    private jumpEndTick!: number;

    private lastBandageTick!: number;
    private bandageStateValue: string = "idle";
    private bandageEffect!: monster_mummy_bandage;
    private lastBandageLength!: number;

    constructor(aScene: Phaser.Scene, aCollision: collision, aGridArray: integer[][]) {
        this.collision = aCollision;
        this.gameScene = aScene;
        this.gridArray = aGridArray;
    }

    static loadSprite(aScene: Phaser.Scene) {
        aScene.load.spritesheet("monster_mummy", "./assets/monsters/monster_mummy/monster_mummy.png", { frameWidth: 26, frameHeight: 32 });
        aScene.load.image("monster_mummy_bandage", "./assets/monsters/monster_mummy/monster_mummy_bandage.png");
        aScene.load.audio('monster_mummy_damaged', './assets/audio/hurt_222.wav');
        aScene.load.audio('monster_mummy_dead', './assets/audio/hurt_251.wav');
        aScene.load.audio('monster_mummy_attack', './assets/audio/CCA_014.wav');
    }

    //General Public Function
    public create(aScene: Phaser.Scene, pos_x: number, pos_y: number) {
        this.sprite = aScene.physics.add.sprite(pos_x, pos_y, "monster_mummy").setScale(0.75, 0.75);

        this.sprite.setCollideWorldBounds(true);
        let directionRoll = Math.random();
        if (directionRoll > 0.5) {
            this.sprite.setVelocityX(-100);
        } else {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(100);
        }
        this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
        this.sprite.setPushable(false);

        this.sprite.anims.play("monster_mummy_move");
        this.gameScene.sound.add('monster_mummy_damaged');
        this.gameScene.sound.add('monster_mummy_dead');
        this.gameScene.sound.add('monster_mummy_attack');
        this.collision.addMonster(this);
    }

    public update() {
        this.machine();
        this.jumpMachine();
        this.dashMachine();
        this.bandageMachine();
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
            this.gameScene.sound.play('monster_mummy_dead');
        }
        else {
            let rand_sound = Math.floor(Math.random() * 3) + 1;
            this.gameScene.sound.play(`monster_mummy_damaged`);
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

    public isSlowed(slowPercent: number) {
        let velocityX = this.sprite.body.velocity.x * slowPercent;
        this.sprite.setVelocityX(velocityX);
    }

    public isStunned(aTime: number) {
        if (this.destoryed) {
            return;
        }
        this.sprite.setAccelerationX(0);
        this.lastStunTick = utils.getTick();
        this.sprite.setPushable(true);
        this.stunnedTime = aTime;
        this.stateValue = "stunned";
    }

    public isKnockbacked(aVelocityX: number, aVelocityY: number, aTime: number, aStun: boolean, aStunTime: number) {
        if (this.destoryed) {
            return;
        }
        this.sprite.setAccelerationX(0);
        this.sprite.setMaxVelocity(200, 10000);
        this.sprite.setPushable(true);
        this.sprite.setVelocity(aVelocityX, aVelocityY);
        this.lastStunTick = utils.getTick();
        this.stunnedTime = aTime;
        this.stateValue = "stunned";
        if (aStun) {
            setTimeout(() => {
                if (this.sprite) {
                    this.isStunned(aStunTime);
                }
            }, aTime)
        }
    }

    public getMaxHealth(){
        return this.maxHealthPoint;
    }

    public getCurrHealth() {
        return this.healthPoint;
    }

    public createAnims(aScene: Phaser.Scene) {
        this.gameScene.anims.create({
            key: "monster_mummy_move",
            frames: this.gameScene.anims.generateFrameNumbers("monster_mummy", { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1,
        });

        this.gameScene.anims.create({
            key: "monster_mummy_die",
            frames: this.gameScene.anims.generateFrameNumbers("monster_mummy", { start: 0, end: 4 }),
            frameRate: 10,
        })

        this.gameScene.anims.create({
            key: "monster_mummy_idle",
            frames: this.gameScene.anims.generateFrameNumbers("monster_mummy", { start: 7, end: 10 }),
            frameRate: 10,
            repeat: -1,
        });

    }




    //Character Functions


    private machine() {
        switch (this.stateValue) {
            case "idle": {

                break;
            }
            case "walking": {
                if (this.checkJump()) {
                    this.stateValue = "jumping";
                    this.jumpStateValue = "start";
                } else if (this.checkBandage()) {
                    this.stateValue = "attacking";
                    this.bandageStateValue = "start";
                } else if (this.checkDash()) {
                    this.stateValue = "dashing";
                    this.dashStateValue = "start";
                } else {
                    this.sprite.setMaxVelocity(this.maxVelocityX, 10000)
                    this.walking();
                }
                break;
            }
            case "jumping": {
                if (this.jumpStateValue == "idle") {
                    this.stateValue = "walking";
                }
                break;
            }
            case "attacking": {
                if (this.bandageStateValue == "idle") {
                    this.stateValue = "walking";
                }
                break;
            }
            case "dashing": {
                if (this.dashStateValue == "idle") {
                    this.stateValue = "walking";
                }
                break;
            }
            case "stunned": {
                this.sprite.setVelocityX(0);
                if (this.isStunEnd()) {
                    this.sprite.setPushable(false);
                    this.stateValue = "walking";
                }
                break;
            }
            default: {
                this.stateValue = "walking";
                break;
            }
        }
    }

    private jumpMachine() {
        switch (this.jumpStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.doJump();
                this.jumpStateValue = "jumping";
                break;
            }
            case "jumping": {
                if (this.checkJumpHeight()) {
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
                this.doDash();
                this.dashStateValue = "dashing";
                break;
            }
            case "dashing": {
                if (this.sprite.body.touching.down) {
                    this.dashStateValue = "idle";
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


    private bandageMachine() {
        switch (this.bandageStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.createBandageEffect();
                this.bandageStateValue = "extending";
                break;
            }
            case "extending": {
                this.sprite.setVelocityX(0);
                this.extendingBandage();
                if (this.bandageEffect.hasHitPlayer() || utils.tickElapsed(this.lastBandageTick) >= 500) {
                    this.lastBandageLength = utils.tickElapsed(this.lastBandageTick);
                    this.lastBandageTick = utils.getTick();
                    this.bandageStateValue = "returning";
                }
                break;
            }
            case "returning": {
                this.sprite.setVelocityX(0);
                this.pullingBandage();
                if (utils.tickElapsed(this.lastBandageTick) >= 500) {
                    this.bandageEffect.destroy();
                    this.bandageStateValue = "idle";
                    this.lastBandageTick = utils.getTick();
                }
                break;
            }
            default: {
                this.bandageStateValue = "idle";
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
                this.findPlayer();
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

    private checkJump(): boolean {
        if (((this.lastJumpTick == undefined) || (utils.tickElapsed(this.lastJumpTick) >= 800))) {
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
                    this.jump_target = (curr_row - 3) * 25 - 12.5;
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
        this.sprite.setVelocityY(-250);
    }

    private checkJumpHeight(): boolean {
        let curr_height = this.sprite.getBottomCenter().y
        if (curr_height <= this.jump_target) {
            return true;
        }
        return false;
    }

    private moveAfterJump() {
        if (!this.sprite.flipX) {
            this.sprite.setAccelerationX(100);
            this.sprite.setVelocityX(100);
        } else {
            this.sprite.setAccelerationX(-100);
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
            this.sprite.setVelocity(120, -60);
        } else if (this.sprite.flipX == true) {
            this.sprite.setMaxVelocity(200, 10000);
            this.sprite.setVelocity(-120, -60);
        }
    }


    private checkBandage(): boolean {
        if (this.monsterToPlayerY <= 10 && this.monsterToPlayerY >= -10) {
            if ((this.sprite.flipX && this.monsterToPlayerX >= 0 && this.monsterToPlayerX <= 200) || (!this.sprite.flipX && this.monsterToPlayerX <= 0 && this.monsterToPlayerX >= -200)) {
                if (this.sprite.body.touching.down) {
                    if (((this.lastBandageTick == undefined) || (utils.tickElapsed(this.lastBandageTick) >= 2500))) {
                        this.lastBandageTick = utils.getTick();
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private createBandageEffect() {
        this.bandageEffect = new monster_mummy_bandage(this.gameScene, this.collision);
        let pos = this.sprite.getCenter();
        if (!this.sprite.flipX) {
            pos = this.sprite.getRightCenter();
            this.bandageEffect.create(pos.x, pos.y, 0);
        } else {
            pos = this.sprite.getLeftCenter();
            this.bandageEffect.create(pos.x, pos.y, 1);
        }
        this.gameScene.sound.play("monster_mummy_attack");
    }

    private extendingBandage() {
        this.bandageEffect.extending(utils.tickElapsed(this.lastBandageTick));
    }

    private pullingBandage() {
        this.bandageEffect.pulling(utils.tickElapsed(this.lastBandageTick), this.lastBandageLength);
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
        this.sprite.play("monster_mummy_die", true)
        this.destoryed = true;
        if (this.bandageEffect !== undefined){
            this.bandageEffect.destroy();
        }
        setTimeout(() => {
            this.sprite.destroy();
        }, 500)
    }


}

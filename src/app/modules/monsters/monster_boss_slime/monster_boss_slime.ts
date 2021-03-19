import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { collision } from 'src/app/modules/collision';
import { monster_boss_slime_spit } from './monster_boss_slime_spit';
import { utils } from 'src/app/modules/utils';
import { character_swordsman } from '../../characters/character_holyknight/character_holyknight';
import { monster_boss_slime_splat } from './monster_boss_slime_splat';
import { monster_boss_slime_ball } from './monster_boss_slime_ball';

export class monster_boss_slime {
    name: string = "zombie";
    collision: collision;
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    monsterToPlayerX!: number;
    monsterToPlayerY!: number;
    healthPoint: number = 500;
    maxHealthPoint: number = 1000;
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
    private lastSpitTick!: number;
    private lastStunTick!: number;
    private lastSearchTick!: number
    private stunnedTime!: number;

    private jumpStateValue: string = "idle";
    private jumpEndTick!: number;

    private dashStateValue: string = "idle";

    private spitStateValue: string = "idle";
    private spitEffect!: monster_boss_slime_spit;
    private spitCount: number = 0;
    private spitLimit: number = 3;
    private spitCoolDown: number = 500;

    private splatStateValue: string = "idle";
    private splatEffect!: monster_boss_slime_splat;
    private lastSplatTick!: number;

    private lastBallTick!: number;
    private ballEffect!: monster_boss_slime_ball;
    private ballEffectArray: Array<monster_boss_slime_ball> = [];
    private ballStateValue: string = "idle";

    constructor(aScene: Phaser.Scene, aCollision: collision, aGridArray: integer[][]) {
        this.collision = aCollision;
        this.gameScene = aScene;
        this.gridArray = aGridArray;
    }

    static loadSprite(aScene: Phaser.Scene) {
        aScene.load.spritesheet("monster_boss_slime", "./assets/monsters/monster_boss_slime/monster_boss_slime.png", { frameWidth: 64, frameHeight: 76 });
        aScene.load.spritesheet("monster_boss_slime_spit_effect", "./assets/monsters/monster_boss_slime/monster_boss_slime_spit.png", { frameWidth: 27, frameHeight: 10 });
        aScene.load.spritesheet("monster_boss_slime_splat_effect", "./assets/monsters/monster_boss_slime/monster_boss_slime_splat.png", { frameWidth: 75, frameHeight: 75 });
        aScene.load.spritesheet("monster_boss_slime_ball_effect", "./assets/monsters/monster_boss_slime/monster_boss_slime_ball.png", { frameWidth: 76, frameHeight: 76 });
        aScene.load.image("monster_boss_slime_ball_explosion_effect1", "./assets/monsters/monster_boss_slime/monster_boss_slime_ball_explosion/monster_boss_slime_ball_explosion1.png");
        aScene.load.image("monster_boss_slime_ball_explosion_effect2", "./assets/monsters/monster_boss_slime/monster_boss_slime_ball_explosion/monster_boss_slime_ball_explosion2.png");
        aScene.load.image("monster_boss_slime_ball_explosion_effect3", "./assets/monsters/monster_boss_slime/monster_boss_slime_ball_explosion/monster_boss_slime_ball_explosion3.png");
        aScene.load.image("monster_boss_slime_ball_explosion_effect4", "./assets/monsters/monster_boss_slime/monster_boss_slime_ball_explosion/monster_boss_slime_ball_explosion4.png");
        aScene.load.image("monster_boss_slime_ball_explosion_effect5", "./assets/monsters/monster_boss_slime/monster_boss_slime_ball_explosion/monster_boss_slime_ball_explosion5.png");
        aScene.load.image("monster_boss_slime_ball_explosion_effect6", "./assets/monsters/monster_boss_slime/monster_boss_slime_ball_explosion/monster_boss_slime_ball_explosion6.png");
        aScene.load.image("monster_boss_slime_ball_explosion_effect7", "./assets/monsters/monster_boss_slime/monster_boss_slime_ball_explosion/monster_boss_slime_ball_explosion7.png");
        aScene.load.image("monster_boss_slime_ball_explosion_effect8", "./assets/monsters/monster_boss_slime/monster_boss_slime_ball_explosion/monster_boss_slime_ball_explosion8.png");
        aScene.load.audio('monster_boss_slime_damage', './assets/audio/hurt_222.wav');
        aScene.load.audio('monster_boss_slime_dead', './assets/audio/hurt_251.wav');
        aScene.load.audio('monster_boss_slime_attack', './assets/audio/CCA_116.wav');
    }

    //General Public Function
    public create(aScene: Phaser.Scene, pos_x: number, pos_y: number) {
        this.sprite = aScene.physics.add.sprite(pos_x, pos_y, "monster_boss_slime").setScale(0.45, 0.45);
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
        this.sprite.anims.play("monster_boss_slime_move");

        this.gameScene.sound.add('monster_boss_slime_damage');
        this.gameScene.sound.add('monster_boss_slime_dead');
        this.gameScene.sound.add('monster_boss_slime_attack');
        this.collision.addMonster(this);
    }

    public update() {
        this.machine();
        this.jumpMachine();
        this.dashMachine();
        this.spitMachine();
        this.splatMachine();
        this.ballMachine();
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
            this.gameScene.sound.play('monster_boss_slime_dead');
        }
        else {
            let rand_sound = Math.floor(Math.random() * 3) + 1;
            this.gameScene.sound.play(`monster_boss_slime_damage`);
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

    public getMaxHealth() {
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
        this.spitStateValue = "idle";
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
        this.spitStateValue = "idle";
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
            key: "monster_boss_slime_move",
            frames: this.gameScene.anims.generateFrameNumbers("monster_boss_slime", { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1,
        });

        this.gameScene.anims.create({
            key: "monster_boss_slime_die",
            frames: this.gameScene.anims.generateFrameNumbers("monster_boss_slime", { start: 0, end: 4 }),
            frameRate: 10,
        })

        this.gameScene.anims.create({
            key: "monster_boss_slime_idle",
            frames: this.gameScene.anims.generateFrameNumbers("monster_boss_slime", { start: 7, end: 10 }),
            frameRate: 10,
            repeat: -1,
        });

        this.gameScene.anims.create({
            key: "monster_boss_slime_spit_effect",
            frames: this.gameScene.anims.generateFrameNumbers("monster_boss_slime_spit_effect", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.gameScene.anims.create({
            key: "monster_boss_slime_spit_destroy",
            frames: this.gameScene.anims.generateFrameNumbers("monster_boss_slime_spit_effect", { start: 4, end: 5 }),
            frameRate: 10,
        });

        this.gameScene.anims.create({
            key: "monster_boss_slime_splat_effect",
            frames: this.gameScene.anims.generateFrameNumbers("monster_boss_slime_splat_effect", { start: 0, end: 5 }),
            frameRate: 10,
        });

        this.gameScene.anims.create({
            key: "monster_boss_slime_ball_effect",
            frames: this.gameScene.anims.generateFrameNumbers("monster_boss_slime_ball_effect", { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1,
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
                } else if (this.checkSpit()) {
                    this.gameScene.sound.play("monster_boss_slime_attack")
                    this.spitStateValue = "start";
                    this.state_value = "attacking";
                } else if (this.checkSplat()) {
                    this.gameScene.sound.play("monster_boss_slime_attack")
                    this.splatStateValue = "start";
                    this.state_value = "attacking";
                } else if (this.checkBall()) {
                    console.log("throw")
                    this.ballStateValue = "start";
                    this.state_value = "attacking";
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
            case "attacking": {
                if (this.spitStateValue == "idle") {
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

    private spitMachine() {
        switch (this.spitStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.sprite.setVelocityX(0);
                if (utils.tickElapsed(this.lastSpitTick) >= 250) {
                    this.createSpitEffect();
                    this.lastSpitTick = utils.getTick();
                    if (this.spitCount >= this.spitLimit) {
                        this.spitLimit = Math.round(Math.random() * 3) + 2;
                        this.spitCount = 0;
                        this.spitCoolDown = utils.getTick();
                        this.spitStateValue = "cooldown";
                    };
                }
                break;
            }
            case "cooldown": {
                if (!this.sprite.flipX) {
                    this.sprite.setVelocityX(25);
                } else {
                    this.sprite.setVelocityX(-25);
                }
                if (utils.tickElapsed(this.spitCoolDown) >= 500) {
                    this.spitStateValue = "idle";
                }
                break;
            }
            default: {
                this.spitStateValue = "idle";
                break;
            }
        }
    }

    private splatMachine() {
        switch (this.splatStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.sprite.setVelocityX(0);
                this.createSplatEffect();
                this.splatStateValue = "exploding";
                break;
            }
            case "exploding": {
                let pos = this.sprite.getCenter();
                this.splatEffect.sprite.setPosition(pos.x, pos.y)
                this.sprite.setVelocityX(0);
                this.splatEffect.expand(utils.tickElapsed(this.lastSplatTick));
                if (!this.splatEffect.sprite.active) {
                    this.splatStateValue = "idle";
                }
                break;
            }
            default: {
                this.splatStateValue = "idle";
                break;
            }
        }
    }

    private ballMachine() {
        switch (this.ballStateValue) {
            case "idle": {
                break;
            }
            case "start": {
                this.sprite.setVelocityX(0);
                this.throwBall();
                this.ballStateValue = "travelling";
                break;
            } case "travelling": {
                if (this.updateBallEffect()) {
                    this.ballStateValue = "idle";
                }
                break;
            }
            default: {
                this.splatStateValue = "idle";
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
        this.sprite.setVelocityY(-250);
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


    private checkSpit(): boolean {
        if (this.monsterToPlayerY <= 10 && this.monsterToPlayerY >= -10) {
            if ((this.sprite.flipX && this.monsterToPlayerX >= 125 && this.monsterToPlayerX <= 400) || (!this.sprite.flipX && this.monsterToPlayerX <= -125 && this.monsterToPlayerX >= -400)) {
                if (this.sprite.body.touching.down) {
                    if (((this.lastSpitTick == undefined) || (utils.tickElapsed(this.lastSpitTick) >= 2000))) {
                        this.lastSpitTick = utils.getTick();
                        return true;
                    }
                }
            }
        }
        return false;
    }



    private createSpitEffect() {
        this.spitEffect = new monster_boss_slime_spit(this.gameScene, this.collision);
        let pos = this.sprite.getCenter();
        this.spitEffect.create(pos.x, pos.y);
        if (!this.sprite.flipX) {
            this.spitEffect.sprite.setVelocity(200, -100)
        } else {
            this.spitEffect.sprite.flipX = true;
            this.spitEffect.sprite.setVelocity(-200, -100)
        }
        this.spitEffect.playAnims();
        this.collision.addMonsterAttack(this.spitEffect);
        this.spitCount++;
    }

    private checkSplat(): boolean {
        if (this.monsterToPlayerY <= 10 && this.monsterToPlayerY >= -10) {
            if ((this.sprite.flipX && this.monsterToPlayerX >= 0 && this.monsterToPlayerX <= 50) || (!this.sprite.flipX && this.monsterToPlayerX <= 0 && this.monsterToPlayerX >= -50)) {
                if (this.sprite.body.touching.down) {
                    if (((this.lastSplatTick == undefined) || (utils.tickElapsed(this.lastSplatTick) >= 2000))) {
                        this.lastSplatTick = utils.getTick();
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private createSplatEffect() {
        this.splatEffect = new monster_boss_slime_splat(this.gameScene, this.collision);
        let pos = this.sprite.getCenter();
        this.splatEffect.create(pos.x, pos.y);
        this.splatEffect.playAnims();
        this.collision.addMonsterAttack(this.splatEffect);
    }

    private isStunEnd() {
        if (utils.tickElapsed(this.lastStunTick) >= this.stunnedTime) {
            this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
            this.sprite.setVelocityX(1);
            return true;
        }
        return false;
    }

    private checkBall(): boolean {
        if (this.sprite.body.touching.down) {
            if (((this.lastBallTick == undefined) || (utils.tickElapsed(this.lastBallTick) >= 5000))) {
                this.lastBallTick = utils.getTick();
                return true;
            }
        }
        return false;
    }

    private throwBall() {
        console.log("throw");
        this.ballEffect = new monster_boss_slime_ball(this.gameScene, this.collision);
        let pos = this.sprite.getCenter();
        this.ballEffect.create(pos.x, pos.y);
        if (!this.sprite.flipX) {
            this.ballEffect.sprite.setVelocity(125, -100)
        } else {
            this.ballEffect.sprite.setVelocity(-125, -100)
        }
    }

    private updateBallEffect() {
        if (this.ballEffect.getGrounded()) {
            let pos = this.ballEffect.sprite.getCenter();
            for (let i = 1; i < 9; i ++){
                let explostionEffect = new monster_boss_slime_ball(this.gameScene, this.collision);
                explostionEffect.createExplosion(pos.x, pos.y, i);
            }
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
        this.sprite.play("monster_boss_slime_die", true)
        this.destoryed = true;
        setTimeout(() => {
            this.sprite.destroy();
        }, 500)
        this.ballEffect.destroy();
        for (let i = 0; i < this.ballEffectArray.length; i++){
            this.ballEffectArray[i].destroy();
        }
    }


}

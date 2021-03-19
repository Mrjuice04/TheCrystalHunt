import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { monsterControl } from "../../monsters/monsterControl";
import { monsterType, isCrystal } from 'src/app/modules/monsters/monsterType';
import { chargeLevelParam, chargeLevelData } from './character_holyknight_charge_level'


export class character_sword_charge {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterControl: monsterControl;
    damage: number = 15;
    stunTime: number = 500;
    oneTimeCollision: boolean = false;
    collisionFrequency: number = 500;
    private chargeJump: number = 0;
    private levelData: chargeLevelData = new chargeLevelData();
    private duration: number = 1000;
    private isWave: boolean = false;
    private level!: number;
    private penetratePower: number = 1;
    private destroyed: boolean = false;



    constructor(aScene: Phaser.Scene, aCollision: collision, aMonsterControl: monsterControl, aLevel: number) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.monsterControl = aMonsterControl;
        let levelAttributes = this.levelData.getParam(aLevel);
        this.damage = levelAttributes.damage;
        this.duration = levelAttributes.duration;
        this.penetratePower = levelAttributes.penetratePower;
        if (aLevel >= 3) {
            this.chargeJump++;
        }
        this.level = aLevel;
    }

    public create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "charge_effect").setDepth(2);
        this.sprite.body.setAllowGravity(false);
        this.sprite.setScale(1.2, 1.2);
        this.collision.addPlayerAttack(this);
        // setTimeout(() =>{
        //     if(this.sprite){
        //         this.destroy();
        //     }
        // }, 3000)
    }

    public playAnims() {
        this.sprite.anims.playReverse("charge_effect", true);
        this.gameScene.sound.play('ability_dash');
    }

    hitMonster(aMonster: monsterType) {
        if (!this.isWave) {
            if (isCrystal(aMonster)) {
                aMonster.isDamaged(this.damage / 3);
            } else {
                aMonster.isDamaged(this.damage);
            }
            let velocityX;
            if (!this.sprite.flipX) {
                velocityX = 200;
            } else {
                velocityX = -200;
            }
            aMonster.isKnockbacked(velocityX, 0, 1000, true, this.stunTime);
        } else {
            if (isCrystal(aMonster)) {
                aMonster.isDamaged(this.damage);
                this.sprite.setVelocityX(0);
                this.destroy();
                return;
            } else {
                aMonster.isDamaged(this.damage * 1.5);
            }
            aMonster.isStunned(this.stunTime);
            this.penetratePower--;
            if (this.penetratePower <= 0) {
                this.sprite.setVelocityX(0);
                this.destroy();
            }

        }
    }

    public destroy() {
        this.destroyed = true;
        this.sprite.anims.play("charge_effect", true);
        setTimeout(() => {
            this.sprite.destroy();
            this.collision.deleteCollider(this);
        }, 250)
    }

    public useChargeJump() {
        let chargeJump = this.chargeJump;
        if (this.chargeJump > 0) {
            this.chargeJump--;
            this.duration -= (100 + this.duration/3);
        }
        return chargeJump;
    }

    public chargeWave() {
        let pos = this.sprite.getCenter();
        let isLeft = this.sprite.flipX;
        this.sprite.destroy();
        this.collision.deleteCollider(this);
        this.sprite = this.gameScene.physics.add.sprite(pos.x, pos.y, "charge_effect").setScale(1.2, 1.2);
        this.sprite.body.setAllowGravity(false);
        this.collision.addPlayerAttack(this);
        if (!isLeft) {
            this.sprite.setVelocityX(360);
        } else {
            this.sprite.setVelocityX(-360);
            this.sprite.flipX = true;
        }
        this.isWave = true;
    }

    public getDuration() {
        return this.duration;
    }

    public isDestroyed() {
        return this.destroyed;
    }
}

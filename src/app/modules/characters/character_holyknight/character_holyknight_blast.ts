import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { monsterControl } from "../../monsters/monsterControl";
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { blastLevelParam, blastLevelData } from './character_holyknight_blast_level'



export class character_sword_blast {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterControl: monsterControl;
    damage: number = 15;
    stunTime: number = 1000;
    oneTimeCollision: boolean = true;
    collisionFrequency: number = 0;
    private levelData: blastLevelData = new blastLevelData();
    private blastCount: number = 12;
    private slowPercent: number = 0.8;
    private level: number = 1;
    private isExplosion: boolean = false;
    private heal: number = 3;
    private healthGained: number = 0;


    constructor(aScene: Phaser.Scene, aCollision: collision, aMonsterControl: monsterControl, aLevel: number) {
        let levelAttributes = this.levelData.getParam(aLevel);
        this.gameScene = aScene;
        this.collision = aCollision;
        this.monsterControl = aMonsterControl;
        this.damage = levelAttributes.damage;
        this.blastCount = levelAttributes.blastCount;
        this.heal = levelAttributes.heal;
        this.level = aLevel;
    }

    public create(aPosX: number, aPosY: number, aChargeTime: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "blast_effect").setScale(0.25, 0.25).setDepth(2);
        this.sprite.body.setAllowGravity(false);
        // this.damage *= Phaser.Math.FloorTo(aChargeTime / 100);
        this.collision.addPlayerAttack(this);
        setTimeout(() => {
            if (this.sprite) {
                this.destroy();
            }
        }, 4000)
    }

    public playAnims() {
        this.sprite.anims.play("blast_effect");
        this.gameScene.sound.play('ability_dash');
    }

    public hitMonster(aMonster: monster_zombie) {
        let damage = this.damage + aMonster.getMaxHealth() * 0.07;
        aMonster.isDamaged(damage);
        aMonster.isSlowed(1 - this.slowPercent);
        if (this.level >= 2){
            aMonster.isStunned(100);
        }
        let pos = this.sprite.getCenter();
        let posX = pos.x
        if (!this.sprite.flipX) {
            posX += 20;
        } else {
            posX -= 20;
        }

        if (!this.isExplosion) {
            this.healthGained += this.heal;
            this.destroy();
        }
        if (!this.isExplosion && this.level >= 3) {
            setTimeout(() => {
                this.sprite = this.gameScene.physics.add.sprite(posX, pos.y, "shield_effect").setScale(0.25, 0.25).setDepth(2);
                this.sprite.anims.play("shield_effect_1", true);
                this.sprite.body.setAllowGravity(false);
                this.isExplosion = true;
                this.collision.addPlayerAttack(this);
                setTimeout(() => {
                    this.sprite.destroy();
                }, 300)
            }, 100)
        }
    }

    public destroy() {
        let pos = this.sprite.getCenter();
        this.sprite.destroy();
    }

    public getBlastCount() {
        return this.blastCount;
    }

    public getHealthGained(){
        let health = this.healthGained;
        this.healthGained = 0;
        return health;
    }

}

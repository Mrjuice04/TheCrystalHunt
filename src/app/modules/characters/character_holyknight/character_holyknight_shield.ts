import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { monsterControl } from "src/app/modules/monsters/monsterControl";
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { shieldLevelData} from './character_holyknight_shield_level'


export class character_sword_shield {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterControl: monsterControl;
    damage: number = 10;
    oneTimeCollision: boolean = false;
    collisionFrequency: number = 750;
    private levelData: shieldLevelData = new shieldLevelData();
    private level!: number;
    private canAttack: boolean = false;
    private isExplostionHit: boolean = false;
    private stunDuration: number = 2500;
    private shieldDuration: number = 2000;




    constructor(aScene: Phaser.Scene, aCollision: collision, aMonsterControl: monsterControl, aLevel: number) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.monsterControl = aMonsterControl;
        this.level = aLevel;
        let levelAttributes = this.levelData.getParam(aLevel);
        this.damage = levelAttributes.damage;
        this.stunDuration = levelAttributes.stunDuration;
        this.shieldDuration = levelAttributes.shieldDuration;
        if (this.level >= 6){
            this.canAttack = true;
        }
    }

    create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "shield_effect").setScale(0.6, 0.6);
        this.gameScene.sound.add('ability_shield');
        this.sprite.body.setAllowGravity(false);
        this.playAnims();
        this.collision.addPlayerAttack(this);
    }

    playAnims() {
        this.sprite.anims.play("shield_effect", true)
        this.gameScene.sound.play('ability_shield');
    }

    hitMonster(aMonster: any) {
        if (this.isExplostionHit){
            aMonster.isDamaged(this.damage / 2);
        } else {
            aMonster.isDamaged(this.damage);
        }
        aMonster.isStunned(this.stunDuration)
        console.log("monster hit" + aMonster.healthPoint);
    }


    public destroy() {
        let pos = this.sprite.getCenter();
        this.sprite.destroy();
        this.collision.deleteCollider(this);
        
        this.sprite = this.gameScene.physics.add.sprite(pos.x, pos.y, "shield_effect").setScale(0.6, 0.6);
        this.sprite.body.setAllowGravity(false);
        if (this.level >= 3){
            this.isExplostionHit = true;
            this.sprite.setScale(0.9, 0.9);
            this.collision.addPlayerAttack(this);
        }
        
        this.sprite.anims.play("shield_effect_1", true);
        if (this.level >= 9){
            this.sprite = this.gameScene.physics.add.sprite(pos.x, pos.y, "shield_effect").setScale(1000, 1000);
            this.sprite.setVisible(false)
            this.collision.deleteCollider(this);
            this.collision.addPlayerAttack(this);

            setTimeout(() => {
                this.sprite.destroy();
            }, 100)
        }

        setTimeout(() => {
            this.sprite.destroy();
        }, 300)
    }

    public getCanAttack() {
        return this.canAttack;
    }

    public getShieldDuration(){
        return this.shieldDuration;
    }

}

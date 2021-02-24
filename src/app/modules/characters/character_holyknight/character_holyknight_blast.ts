import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { monsterControl } from "../../monsters/monsterControl";
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';


export class character_sword_blast {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterControl: monsterControl;
    damage: number = 15;
    stunTime: number = 1000;
    oneTimeCollision: boolean = true;
    collisionFrequency: number = 0;


    constructor(aScene: Phaser.Scene, aCollision: collision, aMonsterControl: monsterControl) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.monsterControl = aMonsterControl;
    }

    public create(aPosX: number, aPosY: number, aChargeTime: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "blast_effect");
        this.sprite.body.setAllowGravity(false);
        this.damage += Phaser.Math.FloorTo(aChargeTime / 8);
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
        aMonster.isDamaged(this.damage);
        console.log("monster hit" + aMonster.healthPoint);
        aMonster.isStunned(this.stunTime);
    }



    public destroy() {
        this.sprite.destroy();
    }

}

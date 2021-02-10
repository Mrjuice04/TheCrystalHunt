import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { monsterControl } from "src/app/modules/monsters/monster_control";
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { monsterType } from 'src/app/modules/monsters/monster_type';


export class character_sword_slash {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterControl: monsterControl;
    damage: number = 15;
    stunTime: number = 0;


    constructor(aScene: Phaser.Scene, aCollision: collision, aMonsterControl: monsterControl) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.monsterControl = aMonsterControl;
    }

    public create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "ability_slash");
        this.sprite.body.setAllowGravity(false);
        this.collision.addPlayerAttack(this)
    }

    public playAnims() {
        this.sprite.anims.play("ability_slash");
    }

    public hitMonster(aMonster: monsterType) {
        aMonster.isDamaged(this.damage);
        console.log("monster hit" + aMonster.healthPoint);
    }


    public destroy() {
        this.sprite.destroy();
    }

}

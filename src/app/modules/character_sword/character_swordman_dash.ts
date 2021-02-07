import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { monsterControl } from "../monsters/monsterControl";
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';


export class character_sword_dash {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterControl: monsterControl;
    damage: number = 10;
    stunTime: number = 400;


    constructor(aScene: Phaser.Scene, aCollision: collision, aMonsterControl: monsterControl) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.monsterControl = aMonsterControl;
    }

    create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "ability_dash");
        this.sprite.body.setAllowGravity(false);
        this.sprite.setScale(1.2, 1.2);
        this.collision.addPlayerAttack(this)


    }

    playAnims() {
        this.sprite.anims.playReverse("ability_dash");
    }

    hitMonster(aMonster: monster_zombie) {
        aMonster.isDamaged(this.damage);
        aMonster.isStunned(this.stunTime);
        console.log("monster hit" + aMonster.healthPoint);
    }


    destroy() {
        this.sprite.destroy();
    }

}

export class character_sword_spin {

}
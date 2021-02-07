import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { monsterControl } from "../monsters/monsterControl";
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';


export class character_sword_spin {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterControl: monsterControl;
    damage: number = 20;


    constructor(aScene: Phaser.Scene, aCollision: collision, aMonsterControl: monsterControl) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.monsterControl = aMonsterControl;
    }

    create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "ability_spin");
        this.sprite.body.setAllowGravity(false);
        setTimeout(() => {
            this.collision.addPlayerAttack(this)
        }, 200)
    }

    playAnims() {
        this.sprite.anims.play("ability_spin");
    }

    hitMonster(aMonster: monster_zombie) {
        let pos_vector = aMonster.sprite.body.velocity
        let direction = pos_vector.x / Math.abs(pos_vector.x);
        let new_velocityX;
        console.log(direction)
        if (direction == 1){
            new_velocityX = -200;
        } else {
            new_velocityX = 200;
        }
        console.log(new_velocityX)

        aMonster.isDamaged(this.damage);
        aMonster.isKnockbacked(new_velocityX, 0, 400, false, 0);
        console.log("monster hit" + aMonster.healthPoint);
    }


    destroy() {
        this.sprite.destroy();
    }

}

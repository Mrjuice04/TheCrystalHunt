import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { monsterControl } from "src/app/modules/monsters/monster_control";
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';


export class character_sword_shield {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterControl: monsterControl;
    damage: number = 20;
    stunTime: number = 0;
    oneTimeCollision: boolean = false;



    constructor(aScene: Phaser.Scene, aCollision: collision, aMonsterControl: monsterControl) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.monsterControl = aMonsterControl;
    }

    create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "ability_shield").setScale(0.3, 0.3);
        this.gameScene.sound.add('ability_shield');
        this.sprite.body.setAllowGravity(false);
        this.playAnims();
        this.collision.addPlayerAttack(this)
    }

    playAnims() {
        this.gameScene.sound.play('ability_shield_2');
    }

    hitMonster(aMonster: any) {
        let pos_vector = aMonster.sprite.body.velocity
        let direction = pos_vector.x / Math.abs(pos_vector.x);
        let new_velocityX;

        if (direction == 1){
            new_velocityX = -200;
        } else {
            new_velocityX = 200;
        }

        aMonster.isDamaged(this.damage);
        aMonster.isKnockbacked(new_velocityX, 0, 400, false, 0);
        console.log("monster hit" + aMonster.healthPoint);
    }


    destroy() {
        this.sprite.destroy();
    }

}

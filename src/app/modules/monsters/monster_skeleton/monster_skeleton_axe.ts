import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';



export class monster_skeleton_axe{
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    damage: number = 10;
    stunTime: number = 300; //ms

    constructor(aScene: Phaser.Scene, aCollision: collision){
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    create(aPosX: number, aPosY: number){
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "bite");
        this.sprite.body.setAllowGravity(true);
        this.collision.addMonsterAttack(this);
    }

    hitPlayer(aPlayer: character_swordsman){
        aPlayer.isDamaged(this.damage);
        aPlayer.isStunned(this.stunTime);
        console.log("Player Hit. Health: " + aPlayer.healthPoint);
        this.destroy();
    }

    hitGround(){
        this.destroy();
    }

    playAnims() {
        this.sprite.anims.play("bite");
    }

    destroy(){
        this.sprite.destroy();
    }
}
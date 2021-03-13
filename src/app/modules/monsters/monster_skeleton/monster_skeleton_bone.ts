import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';



export class monster_skeleton_bone{
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    damage: number = 20;
    public oneTimeCollision: boolean = true;


    constructor(aScene: Phaser.Scene, aCollision: collision){
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    create(aPosX: number, aPosY: number){
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "bone").setScale(0.2, 0.2);
        this.playAnims();
        this.sprite.body.setAllowGravity(true);
        this.collision.addMonsterAttack(this);
    }

    hitPlayer(aPlayer: character_swordsman){
        aPlayer.isDamaged(this.damage);
        this.destroy();
    }

    hitGround(){
        this.destroy();
    }

    playAnims() {
        this.sprite.anims.play("bone");
    }

    destroy(){
        this.sprite.destroy();
    }
}
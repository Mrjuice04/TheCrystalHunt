import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';



export class monster_hog_charge{
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    damage: number = 10;
    stunTime: number = 500; //ms
    targetPlayer! : character_swordsman;
    public oneTimeCollision: boolean = false;
    public collisionFrequency: number = 500;
    private knockBackPower: number = 200;
    public groundColliding: boolean = false;



    constructor(aScene: Phaser.Scene, aCollision: collision){
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    create(aPosX: number, aPosY: number){
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "monster_hog_charge_effect").setScale(0.45, 0.45);
        this.sprite.body.setAllowGravity(false);
    }

    hitPlayer(aPlayer: character_swordsman){
        aPlayer.isDamaged(this.damage);
        aPlayer.isStunned(this.stunTime);
        if (!this.sprite.flipX){
            aPlayer.isKnockbacked(this.knockBackPower, -100, 1000, true, this.stunTime)
        } else {
            aPlayer.isKnockbacked(this.knockBackPower * -1, -100, 1000, true, this.stunTime)
        }
        this.targetPlayer = aPlayer;
    }

    playAnims() {
        this.sprite.anims.play("monster_hog_charge_effect");
    }

    destroy(){
        this.sprite.destroy();
    }

    public getTargetPlayer(){
        return this.targetPlayer;
    }
}
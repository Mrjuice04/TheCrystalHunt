import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';



export class monster_boss_slime_splat {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    damage: number = 8;
    targetPlayer!: character_swordsman;
    public oneTimeCollision: boolean = true;
    public collisionFrequency: number = 0;
    private knockBackPower: number = 200;
    public groundColliding: boolean = false;
    public duration: number = 300;



    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "monster_boss_slime_splat_effect").setScale(0.2, 0.2);
        this.sprite.body.setAllowGravity(false);
        setTimeout(() => {
            this.destroy();
        }, this.duration)
    }

    hitPlayer(aPlayer: character_swordsman) {
        aPlayer.isDamaged(this.damage);
        aPlayer.isKnockbacked(this.knockBackPower, 0, 300, false, 0);
        this.targetPlayer = aPlayer;
    }

    playAnims() {
        this.sprite.anims.play("monster_boss_slime_splat_effect");
    }

    destroy() {
        this.sprite.destroy();
    }

    public expand(aTick: number){
        let scale = 0.2 + (aTick / this.duration * 0.8);
        this.sprite.setScale(scale);
    }

    public getTargetPlayer() {
        return this.targetPlayer;
    }
}
import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';



export class monster_boss_slime_spit {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    damage: number = 8;
    slowPercent: number = 0.4;
    slowDuration: number = 750;
    targetPlayer!: character_swordsman;
    public oneTimeCollision: boolean = false;
    public collisionFrequency: number = 500;
    public groundColliding: boolean = true;



    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "monster_boss_slime_spit_effect");
        this.sprite.body.setAllowGravity(true);
        this.sprite.setBounce(1, 0.8);
        setTimeout(() => {
            this.destroy();
        }, 2000)
    }

    hitPlayer(aPlayer: character_swordsman) {
        aPlayer.isDamaged(this.damage);
        aPlayer.isSlowed(this.slowPercent, this.slowDuration);
        this.targetPlayer = aPlayer;
    }

    playAnims() {
        this.sprite.anims.play("monster_boss_slime_spit_effect");
    }

    destroy() {
        if (this.sprite !== undefined) {
            this.sprite.anims.play("monster_boss_slime_spit_destroy");
            setTimeout(() => {
                this.sprite.destroy();
            }, 200)
        }

    }

    public getTargetPlayer() {
        return this.targetPlayer;
    }
}
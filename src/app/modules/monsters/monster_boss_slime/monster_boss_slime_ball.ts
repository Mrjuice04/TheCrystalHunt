import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';



export class monster_boss_slime_ball {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    private slowPercent: number = 0.08;
    private slowDuration: number = 500;
    damage: number = 0.2;
    targetPlayer!: character_swordsman;

    public spriteArray: Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> = [];

    public oneTimeCollision: boolean = false;
    public collisionFrequency: number = 500;
    public groundColliding: boolean = true;
    public duration: number = 10000;

    private grounded: boolean = false;



    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "monster_boss_slime_ball_effect").setScale(0.2, 0.2);
        this.sprite.body.setAllowGravity(true);
        setTimeout(() => {
            this.destroy();
        }, this.duration);
        this.collision.addMonsterAttack(this);
    }

    hitPlayer(aPlayer: character_swordsman) {
        aPlayer.isDamaged(this.damage );
        aPlayer.isSlowed(this.slowPercent, this.slowDuration);
        if (!this.grounded) {
            this.sprite.destroy();
            aPlayer.isDamaged(this.damage * 10 );
            aPlayer.isSlowed(this.slowPercent * 10, this.slowDuration);
            this.grounded = true;
        }
    }

    playAnims() {
        this.sprite.anims.play("monster_boss_slime_ball_effect");
    }

    destroy() {
        this.sprite.destroy();
    }

    public hitGround() {
        if (!this.grounded) {
            let pos = this.sprite.getCenter();
            this.sprite.destroy();
            this.collision.deleteCollider(this);
            this.grounded = true;
        }
    }

    public createExplosion(aPosX: number, aPosY: number, aCount: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX + 3 * (aCount - 1), aPosY + 5, "monster_boss_slime_ball_explosion_effect" + aCount).setScale(0.2, 0.5);
        this.sprite.body.setAllowGravity(true);
        this.collision.addMonsterAttack(this);
        this.sprite.setBodySize(this.sprite.width, 1);
        this.sprite.setOffset(0, -1);
        this.grounded = true;
    }

    public getGrounded() {
        return this.grounded;
    }

    public getTargetPlayer() {
        return this.targetPlayer;
    }
}
import { collision } from 'src/app/modules/collision';

export class crystal{
    gameScene: Phaser.Scene
    collision: collision;
    healthPoint: number = 300;
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;

    constructor (aScene: Phaser.Scene, aCollision: collision){
        this.gameScene = aScene;
        this.collision = aCollision;
    }


    public create (aPosX: number, aPosY: number){
        this.sprite = this.gameScene.physics.add.staticSprite(aPosX, aPosY, "brick");
        this.sprite.tint = 0xEBB4FF
        this.collision.addCrystal(this);
    }

    public isDamaged(aDamage: number) {
        this.healthPoint -= aDamage;
    }
}
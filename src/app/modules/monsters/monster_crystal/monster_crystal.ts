import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';


export class monster_crystal {
    gameScene: Phaser.Scene
    collision: collision;
    healthPoint: number = 200;
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    lastSpawnTick!: number;
    canSpawn: boolean = false;
    destoryed: boolean = false;
    spawnTime: number = 10500;


    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    static loadSprite(aScene: Phaser.Scene) {
        aScene.load.spritesheet("crystal", "./assets/crystal.png", { frameWidth: 58, frameHeight: 100 });

    }

    //General Functions
    public create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "crystal").setScale(0.5, 0.5);
        this.gameScene.anims.create({
            key: "crystal",
            frames: this.gameScene.anims.generateFrameNumbers("crystal", { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1,
        });
        this.sprite.anims.play("crystal", true)
        this.sprite.setImmovable(true);
        this.sprite.body.setAllowGravity(false);
        this.sprite.tint = 0xEBB4FF
        this.collision.addCrystal(this);

    }

    public isDamaged(aDamage: number) {
        this.healthPoint -= aDamage;
    }

    public isKnockbacked(aVelocityX: number, aVelocityY: number, aTime: number, aStun: boolean, aStunTime: number) {
        // console.log("this monster is immune to knockBack");
    }

    public isStunned(aTime: number) {
        // console.log("this monster is immune to stun");
    }

    public getPostision() {

    }

    public update() {
        this.checkSpawn();
    }

    public checkSpawn() {
        if (this.lastSpawnTick == undefined || utils.tickElapsed(this.lastSpawnTick) >= this.spawnTime) {
            this.canSpawn = true;
            this.lastSpawnTick = utils.getTick();
            if (this.spawnTime >= 5000) {
                this.spawnTime -= 500;
            }
        }
    }

    public destroy() {
        this.sprite.destroy();
    }


}
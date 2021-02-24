import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';


export class monster_crystal {
    gameScene: Phaser.Scene
    collision: collision;
    healthPoint: number = 400;
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    lastSpawnTick!: number;
    lastHealTick!: number;

    destoryed: boolean = false;

    
    spawnTime: number = 20500;
    canSpawn: boolean = false;
    healTime: number = 5000;
    canHeal: boolean = false;


    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    static loadSprite(aScene: Phaser.Scene) {
        aScene.load.spritesheet("crystal", "./assets/monsters/monster_crystal/crystal.png", { frameWidth: 58, frameHeight: 100 });
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
        this.collision.addMonster(this);

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

    
    public isHealed(aHeal: number){
        this.healthPoint += aHeal;
        if(this.healthPoint > 400){
            this.healthPoint = 400;
        }
        this.sprite.setTint(0xBCF5A9);
        setTimeout(() => {
            this.sprite.clearTint();
        }, 200)
    }

    public update() {
        this.checkSpawn();
        this.checkHeal();
    }

    public checkSpawn() {
        if (this.lastSpawnTick == undefined || utils.tickElapsed(this.lastSpawnTick) >= this.spawnTime) {
            this.canSpawn = true;
            this.lastSpawnTick = utils.getTick();
            if (this.spawnTime >= 10000) {
                this.spawnTime -= 1000;
            }
        }
    }

    private checkHeal() {
        if (this.lastHealTick == undefined || utils.tickElapsed(this.lastHealTick) >= this.healTime) {
            this.canHeal = true;
            this.lastHealTick = utils.getTick();
        }
    }

    public destroy() {
        this.sprite.destroy();
    }


}
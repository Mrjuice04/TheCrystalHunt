import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';


export class monster_crystal{
    gameScene: Phaser.Scene
    collision: collision;
    healthPoint: number = 200;
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    lastSpawnTick!: number;
    canSpawn: boolean = false;

    constructor (aScene: Phaser.Scene, aCollision: collision){
        this.gameScene = aScene;
        this.collision = aCollision;
    }

//General Functions
    public create (aPosX: number, aPosY: number){
        this.sprite = this.gameScene.physics.add.staticSprite(aPosX, aPosY, "brick");
        this.sprite.tint = 0xEBB4FF
        this.collision.addCrystal(this);
    }

    public isDamaged(aDamage: number) {
        this.healthPoint -= aDamage;
    }

    public isKnockbacked(aVelocityX: number, aVelocityY: number, aTime: number, aStun: boolean, aStunTime: number){
        console.log("this monster is immune to knockBack");
    }

    public isStunned(aTime: number){
        console.log("this monster is immune to stun");
    }

    public getPostision(){
        
    }

    public update(){
        this.checkSpawn();
    }

    public checkSpawn(){
        if (this.lastSpawnTick == undefined|| utils.tickElapsed(this.lastSpawnTick) >= 10000){
            this.canSpawn = true;
            this.lastSpawnTick = utils.getTick();
        }
    }
    
    
}
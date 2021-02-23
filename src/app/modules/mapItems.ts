import { collision } from 'src/app/modules/collision';


export class mapItems{
    gameScene: Phaser.Scene;
    collision: collision;

    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.gameScene.load.spritesheet("health_crystal", "./assets/gameScene/healthCrystal.png", { frameWidth: 142, frameHeight: 142 });
    }

    public update(){

    }

    private createHealthCrystal(pos_x: number, pos_y: number){
        this.gameScene.physics.add.sprite(pos_x, pos_y, "health_crystal");
    }
}
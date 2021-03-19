import { collision } from 'src/app/modules/collision';


export class background {
    ground!: Phaser.Types.Physics.Arcade.ImageWithStaticBody;
    collision: collision;
    gridArray: integer[][] = [];
    gameScene: Phaser.Scene;
    isInit: boolean = true;
    brickArray: Array<Phaser.Types.Physics.Arcade.ImageWithDynamicBody> = [];



    constructor(aScene: Phaser.Scene, aCollision: collision) {
        aScene.load.image("brick", "./assets/gameScene/stone_tile.png");
        aScene.load.image("grass", "./assets/gameScene/grass_tile.png");
        this.collision = aCollision;
        this.gameScene = aScene;
    }

    createGrid() {
        console.log("create");
        let maxConnectingBrick: number = 5;
        let minConnectingBrick: number = 3;
        let currentConnectingBrick: number = 0;
        let maxConnectingSpace: number = 3;
        let minConnectingSpace: number = 2;
        let currentConnectingSpace: number = 0;
        if (this.isInit) {
            for (let i = 0; i < 24; i++) {
                this.gridArray.push([]);
                for (let j = 0; j < 32; j++) {
                    this.gridArray[i].push(0);[[[], []]]
                }
            }
        }

        for (let i = 3; i < 21; i += 3) {

            for (let j = 0; j < 2; j++) {
                this.gridArray[i][j] = 1;
                currentConnectingBrick += 1;
            }
            for (let j = 2; j < 30; j++) {
                let type = Math.floor((Math.random() * 2));
                if (type == 1) {
                    if (currentConnectingBrick >= maxConnectingBrick) {
                        type = 0;
                        currentConnectingBrick = 0;
                        currentConnectingSpace += 1;
                    } else if (currentConnectingSpace > 0 && currentConnectingSpace < minConnectingSpace) {
                        type = 0;
                        currentConnectingSpace += 1;
                    } else {
                        currentConnectingBrick += 1;
                        currentConnectingSpace = 0;
                    }
                } else if (type == 0) {
                    if (currentConnectingSpace >= maxConnectingSpace) {
                        type = 1;
                        currentConnectingSpace = 0;
                        currentConnectingBrick += 1;
                    } else if (currentConnectingBrick > 0 && currentConnectingBrick < minConnectingBrick) {
                        type = 1;
                        currentConnectingBrick += 1;
                    } else {
                        currentConnectingSpace += 1;
                        currentConnectingBrick = 0;
                    }
                }
                if (j == 29 && this.gridArray[i][28] == 0) {
                    type = 0;
                } else if (j == 29 && this.gridArray[i][28] == 1) {
                    type = 1;
                }
                this.gridArray[i][j] = type;
            }
            for (let j = 30; j < 32; j++) {
                this.gridArray[i][j] = 1;
            }

            currentConnectingBrick = 0;
            currentConnectingSpace = 0;
        }

        if (this.isInit) {
            for (let i = 21; i < 22; i++) {
                for (let j = 0; j < 32; j++) {
                    let x = j * 25 + 12.5;
                    let y = i * 25 + 12.5;
                    let ground = this.gameScene.physics.add.image(x, y, "grass").setScale(0.25, 0.25);
                    this.gridArray[i][j] = 1;
                    ground.setImmovable(true);
                    ground.body.setAllowGravity(false);
                    this.collision.addBrick(ground, this.isInit);
                }
            }
        }


        for (let i = 0; i < 21; i++) {
            for (let j = 0; j < 32; j++) {
                let type = this.gridArray[i][j];
                if (type == 1) {
                    let x = j * 25 + 12.5;
                    let y = i * 25 + 12.5;
                    let brick = this.gameScene.physics.add.image(x, y, "brick");
                    brick.setImmovable(true);
                    brick.body.setAllowGravity(false);
                    this.collision.addBrick(brick, this.isInit);
                    this.brickArray.push(brick);
                }
            }
        }
        this.isInit = false;
    }

    public destroyBrick() {
        for (let i = 0; i < this.brickArray.length; i++) {
            let brick = this.brickArray[i];
            brick.destroy();
        }
    }

    getBricksArray(): integer[][] {
        return this.gridArray;
    }

}
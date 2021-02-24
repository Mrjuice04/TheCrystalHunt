import { collision } from 'src/app/modules/collision';
import { itemParam, itemData } from './itemSpawn';
import { itemType } from './itemType';
import { healCrystal } from './healCrystal'
import { utils } from '../utils';




export class mapItemControl {
    gameScene: Phaser.Scene;
    collision: collision;
    crystal!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    itemParam!: Array<itemParam>;
    itemData: itemData;
    itemArray: Array<itemType> = [];
    lastSpawnTick!: number;
    currRound: number = 0;

    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.gameScene.load.spritesheet("health_crystal", "./assets/gameScene/healthCrystal.png", { frameWidth: 142, frameHeight: 142 });
        this.lastSpawnTick = utils.getTick();
        this.itemData = new itemData();
    }

    public update(aRound: number) {
        if (aRound != this.currRound) {
            this.currRound = aRound;
            this.itemParam = this.itemData.getArray('round' + this.currRound);
        }
        if (utils.tickElapsed(this.lastSpawnTick) >= 5000) {
            this.itemSpawn();
            this.lastSpawnTick = utils.getTick();
        }
    }


    private addHealCrystal() {
        let newItem = new healCrystal(this.gameScene);
        let pos_x = Math.floor(Math.random() * 800);
        newItem.create(pos_x, 25);
        console.log(newItem);
        this.collision.addPlayerInteractiveItem(newItem);
        this.itemArray.push(newItem);
    }

    private itemSpawn() {
        let newItem: itemParam = { name: '', appearRate: 0, count: 0 };
        for (let i = 0; i < this.itemParam.length; i++) {
            let spawnRoll = Math.random();
            console.log("itemRolled: " + spawnRoll + " and appearRate: " + this.itemParam[i].appearRate)
            if (this.itemParam[i].appearRate >= spawnRoll) {
                newItem = this.itemParam[i];
                break;
            }
        }
        
        if (newItem.count <= 0) {
            return;
        } else {
            newItem.count--;
        }

        switch (newItem.name) {
            case "heal": {
                this.addHealCrystal();
                break;
            }
            default: {
                break;
            }
        }
    }

}
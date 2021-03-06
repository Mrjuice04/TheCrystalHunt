import { collision } from 'src/app/modules/collision';
import { itemType } from './itemType';
import { healCrystal } from './healCrystal'
import { levelUp } from './levelUp'
import { utils } from '../utils';


export class upgradeControl {
    gameScene: Phaser.Scene;
    collision: collision;
    crystal!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    upgradeArray: Array<any> = [];
    lastSpawnTick!: number;
    currRound: number = 0;
    upgradeSpwaned: boolean = false;
    upgradeEnded: boolean = true;

    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    public update(aRound: number, aRoundEnd: boolean) {
        // console.log(this.upgradeEnded + ' / ' + aRoundEnd + ' / ' + (aRound != 1) + ' / ' + (this.currRound != aRound));
        if (this.upgradeEnded && aRoundEnd && aRound != 1 && this.currRound != aRound) {
            this.currRound = aRound;
            this.upgradeSpawn();
            this.upgradeEnded = false;
        }
        if (this.upgradeSpwaned) {
            for (let i = 0; i < this.upgradeArray.length; i++) {
                let curr_upgrade = this.upgradeArray[i];
                if (!curr_upgrade.sprite.active) {
                    for (let j = 0; j < this.upgradeArray.length; j++) {
                        if (this.upgradeArray[j].sprite.active) {
                            this.upgradeArray[j].destroy();
                        }
                    }
                    this.upgradeArray.splice(0, 3);
                    this.upgradeEnded = true;
                    this.upgradeSpwaned = false;
                    console.log(this.upgradeArray);
                    break;
                } else {
                    curr_upgrade.update();
                }
            }
        }


    }


    private levelUpAbility1(aCount: number) {
        let newUpgrade = new levelUp(this.gameScene);
        let pos_x = 150 + 100 * aCount;
        newUpgrade.create(pos_x, 500);
        this.collision.addPlayerInteractiveItem(newUpgrade);
        this.upgradeArray.push(newUpgrade);
    }

    private upgradeSpawn() {
        for (let i = 0; i < 3; i++) {
            let upgradeCount = i + 1;
            this.levelUpAbility1(upgradeCount);
        }
        this.upgradeSpwaned = true;
    }

    public getUpdateEnd() {
        return this.upgradeEnded;
    }
}
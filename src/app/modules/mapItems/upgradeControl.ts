import { collision } from 'src/app/modules/collision';
import { itemType } from './itemType';
import { healCrystal } from './healCrystal'
import { levelUp } from './levelUp'
import { levelUpItem } from './levelUpItem'

import { utils } from '../utils';


export class upgradeControl {
    gameScene: Phaser.Scene;
    collision: collision;
    crystal!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    upgradeArray: Array<levelUpItem> = [];
    lastSpawnTick!: number;
    currRound: number = 0;
    upgradeSpwaned: boolean = false;
    upgradeEnded: boolean = true;
    ultLvlUpCount: number = 0;

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
        if (this.upgradeArray.length > 0) {
            for (let i = 0; i < this.upgradeArray.length; i++) {
                let curr_upgrade = this.upgradeArray[i];
                if (!curr_upgrade.sprite.active) {
                    if (curr_upgrade.getAbility() == 3) {
                        this.ultLvlUpCount--;
                    }
                    for (let j = 0; j < this.upgradeArray.length; j++) {
                        if (this.upgradeArray[j].sprite.active) {
                            this.upgradeArray[j].destroy();
                        }
                    }
                    this.upgradeArray.splice(0, 3);
                    this.upgradeEnded = true;
                    this.upgradeSpwaned = false;
                    break;
                } else {
                    curr_upgrade.update();
                }
            }
        }
    }


    public levelUpAbility(aPosX: number, aPosY: number, aAbility: integer) {
        let newUpgrade = new levelUpItem(this.gameScene);
        newUpgrade.create(aPosX, aPosY, aAbility);
        this.collision.addUpgradeIcon(newUpgrade);
        this.upgradeArray.push(newUpgrade);
    }

    private upgradeSpawn() {
        if (this.currRound % 9 == 0) {
            this.ultLvlUpCount++;
        }
        if (this.ultLvlUpCount > 0) {
            for (let i = 0; i < 4; i++) {
                let upgradeCount = i;
                let posX = 250 + 100 * upgradeCount;
                this.levelUpAbility(posX, 500, i);
            }
        } else {
            for (let i = 0; i < 3; i++) {
                let upgradeCount = i;
                let posX = 300 + 100 * upgradeCount;
                this.levelUpAbility(posX, 500, i);
            }
        }

        this.upgradeSpwaned = true;
    }

    public getUpdateEnd() {
        return this.upgradeEnded;
    }
}
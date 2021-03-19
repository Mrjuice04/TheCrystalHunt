import { core } from '@angular/compiler';
import { fromEventPattern } from 'rxjs';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';
import { collision } from 'src/app/modules/collision';
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { monster_skeleton } from 'src/app/modules/monsters/monster_skeleton/monster_skeleton';
import { monster_crystal } from 'src/app/modules/monsters/monster_crystal/monster_crystal';
import { monster_hog } from 'src/app/modules/monsters/monster_hog/monster_hog';
import { monster_boss_slime } from 'src/app/modules/monsters/monster_boss_slime/monster_boss_slime';
import { monster_mummy } from 'src/app/modules/monsters/monster_mummy/monster_mummy';
import { monsterType, isCrystal } from 'src/app/modules/monsters/monsterType';
import { utils } from 'src/app/modules/utils';
import { monster_data, monsterParam } from './monsterSpawn';
import { mapItemControl } from '../mapItems/mapItemControl';
import { background } from 'src/app/modules/background';
import { upgradeControl } from '../mapItems/upgradeControl';


type players = character_swordsman;

export class monsterControl {
    gameScene: Phaser.Scene;
    collision: collision;
    monsterArray: Array<monsterType> = [];
    anims1Created: boolean = false;
    gridArray: integer[][];
    scoreGained: number = 0;
    healthGained: number = 0;
    roundPlaying: boolean = false;
    roundCountDown: boolean = true;
    lastRoundTick!: number;
    scorePerRound: number = 1000;
    currRound: number = 1;
    monsterData: monster_data = new monster_data();
    monsterParam!: Array<monsterParam>;
    itemControl: mapItemControl;
    background: background;
    upgradControl: upgradeControl

    constructor(aScene: Phaser.Scene, aCollision: collision, aGridArray: integer[][], aItemControl: mapItemControl, aBackground: background, aUpgradControl: upgradeControl) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.gridArray = aGridArray;
        this.itemControl = aItemControl;
        this.background = aBackground;
        this.upgradControl = aUpgradControl;
        monster_zombie.loadSprite(this.gameScene);
        monster_crystal.loadSprite(this.gameScene);
        monster_skeleton.loadSprite(this.gameScene);
        monster_hog.loadSprite(this.gameScene);
        monster_mummy.loadSprite(this.gameScene);
        monster_boss_slime.loadSprite(this.gameScene);
    }

    private monsterSpawn(pos_x: number, pos_y: number) {
        let newmonster: monsterParam = { name: '', appearRate: 0, count: 0, preSpawn: false };
        for (let i = 0; i < this.monsterParam.length; i++) {
            let spawnRoll = Math.random();
            if (this.monsterParam[i].appearRate >= spawnRoll) {
                newmonster = this.monsterParam[i];
                break;
            }
        }

        if (newmonster == undefined || newmonster.count <= 0) {
            for (let i = this.monsterParam.length - 1; i > -1; i--) {
                if (this.monsterParam[i].count > 0) {
                    newmonster = this.monsterParam[i];
                    break;
                }
            }
            if (newmonster == undefined || newmonster.count <= 0) {
                return;
            }
        }
        newmonster.count--;

        switch (newmonster.name) {
            case "zombie": {
                this.addMonsterZombie(pos_x, pos_y);
                break;
            }
            case "skeleton": {
                this.addMonsterSkeleton(pos_x, pos_y);
                break;
            }
            case "hog": {
                this.addMonsterHog(pos_x, pos_y);
                break;
            }
            case "mummy": {
                this.addMonsterMummy(pos_x, pos_y);
                break;
            }
            case "bossSlime": {
                this.addMonsterBossSlime(pos_x, pos_y);
                break;
            }
            default: {
                break;
            }
        }

        if (newmonster.preSpawn) {
            if (newmonster.count <= 0) {
                this.monsterParam.splice(this.monsterParam.indexOf(newmonster), 1);
            }
            this.monsterSpawn(pos_x, pos_y)
        }
    }

    private addMonsterSkeleton(pos_x: number, pos_y: number) {
        let monster = new monster_skeleton(this.gameScene, this.collision, this.gridArray);
        monster.createAnims(this.gameScene);
        monster.create(this.gameScene, pos_x, pos_y);
        this.monsterArray.push(monster);
    }

    private addMonsterZombie(pos_x: number, pos_y: number) {
        let monster = new monster_zombie(this.gameScene, this.collision, this.gridArray);
        monster.createAnims(this.gameScene);
        monster.create(this.gameScene, pos_x, pos_y);
        this.monsterArray.push(monster);
    }

    private addMonsterCrystal(aPosX: number, aPosY: number) {
        let new_crystal = new monster_crystal(this.gameScene, this.collision);
        new_crystal.create(aPosX, aPosY);
        this.monsterArray.push(new_crystal);
    }

    private addMonsterHog(pos_x: number, pos_y: number) {
        let monster = new monster_hog(this.gameScene, this.collision, this.gridArray);
        monster.createAnims(this.gameScene);
        monster.create(this.gameScene, pos_x, pos_y);
        this.monsterArray.push(monster);
    }

    private addMonsterMummy(pos_x: number, pos_y: number) {
        let monster = new monster_mummy(this.gameScene, this.collision, this.gridArray);
        monster.createAnims(this.gameScene);
        monster.create(this.gameScene, pos_x, pos_y);
        this.monsterArray.push(monster);
    }

    private addMonsterBossSlime(pos_x: number, pos_y: number) {
        let monster = new monster_boss_slime(this.gameScene, this.collision, this.gridArray);
        monster.createAnims(this.gameScene);
        monster.create(this.gameScene, pos_x, pos_y);
        this.monsterArray.push(monster);
    }

    public update(aPlayerClass: character_swordsman, aUpgradeEnd: boolean) {
        if (this.roundPlaying) {
            for (let i = 0; i < this.monsterArray.length; i++) {
                let curr_monster = this.monsterArray[i];

                curr_monster.update();
                let aPlayerPosition = aPlayerClass.sprite.getCenter();
                curr_monster.getPostision(aPlayerPosition);
                //monster spawn
                if (isCrystal(curr_monster)) {
                    if (curr_monster.canSpawn) {
                        let pos = curr_monster.sprite.getCenter();
                        this.monsterSpawn(pos.x, pos.y);
                        curr_monster.canSpawn = false;
                    }
                    if (curr_monster.canHeal) {
                        for (let i = 0; i < this.monsterArray.length; i++) {
                            let curr_healing_monster = this.monsterArray[i];
                            if (!isCrystal(curr_healing_monster)) {
                                let heal = 10 + 0.5 * this.currRound;
                                curr_healing_monster.isHealed(curr_monster.getHeal());
                            }
                        }
                        curr_monster.canHeal = false;
                    }
                    if (this.currRound >= 21){
                        curr_monster.isHealed(1000);
                    }
                }
                //life check
                if (curr_monster.sprite.getCenter().y >= 530){
                    curr_monster.sprite.setPosition(curr_monster.sprite.getCenter().x, 500);
                }
                if (curr_monster.healthPoint <= 0) {
                    curr_monster.destroy();
                    this.monsterArray.splice(i, 1);
                    i--;
                    if (isCrystal(curr_monster)) {
                        this.scoreGained += 600;
                        this.healthGained += 30;
                    }
                    this.scoreGained += 100;
                    let itemRoll = Math.random();
                    if (curr_monster.itemDropChance >= itemRoll) {
                        let pos = curr_monster.sprite.getCenter();
                        this.itemControl.addItem(pos.x, pos.y);
                    }
                }
            }

            this.isOnlyCrystal();

            if (this.monsterArray.length <= 0) {
                this.endRound();
            }
        } else {
            if (!this.roundCountDown && aUpgradeEnd) {
                this.lastRoundTick = utils.getTick();
                this.roundCountDown = true;
                if ((this.currRound - 1) % 5 == 0) {
                    setTimeout(() => {
                        this.background.createGrid();
                    }, 3000);
                }
            }
            if (this.roundCountDown && (this.lastRoundTick == undefined || utils.tickElapsed(this.lastRoundTick) >= 5000)) {
                this.startRound();
            }
        }

    }

    private startRound() {
        this.roundPlaying = true;
        this.roundCountDown = false;
        let pos_y;
        // this.addMonsterCrystal(25, pos_y);
        // pos_y = 50 + (Math.floor(Phaser.Math.FloatBetween(0, 6)) * 75);
        // this.addMonsterCrystal(775, pos_y);
        // console.log (this.gridArray)
        let pos_x;
        let crystalCount = Math.floor(this.currRound / 10) + 2;
        if (this.currRound <= 5) {
            crystalCount = 1;
        }
        for (let i = 0; i < crystalCount; i++) {
            for (; ;) {
                pos_y = 50 + (Math.floor(Phaser.Math.FloatBetween(0, 6)) * 75);
                pos_x = 25 + (Math.floor(Phaser.Math.FloatBetween(0, 30)) * 25);
                let curr_row = (Math.floor((pos_y + 20) / 25)) + 1;
                console.log(curr_row)

                let curr_col = (Math.floor((pos_x) / 25)) - 1;
                let ground_value_1 = this.gridArray[curr_row][curr_col];
                let ground_value_2 = this.gridArray[curr_row][curr_col + 1];

                if ((ground_value_1 == 1) && (ground_value_2 == 1)) {
                    console.log(curr_col)
                    this.addMonsterCrystal(pos_x, pos_y);
                    break;
                }
            }
        }
        this.monsterParam = this.monsterData.getArray('round' + this.currRound);
    }


    private endRound() {
        this.roundPlaying = false;
        this.scoreGained += this.scorePerRound;
        this.scorePerRound += 250;
        if (this.currRound % 5 == 0) {
            this.background.destroyBrick();
        }
        this.currRound++;
    }

    private isOnlyCrystal() {
        let crystalCount = Math.floor(this.currRound / 10) + 2;
        if (this.currRound <= 5) {
            crystalCount = 1;
        }
        if (this.monsterArray.length <= crystalCount){
            for (let i = 0; i < this.monsterArray.length; i++) {
                if (!isCrystal(this.monsterArray[i])) {
                    return;
                }
            }
            for (let i = 0; i < this.monsterParam.length; i++) {
                if (this.monsterParam[i].count > 0) {
                    return;
                }
            }
            for (let i = 0; i < this.monsterArray.length; i++) {
                this.monsterArray[0].destroy();
                this.healthGained += 30;
                this.monsterArray.splice(0, 1);
            }
        }
        // if (this.monsterArray.length == 1) {
        //     if (isCrystal(this.monsterArray[0])) {
        //         for (let i = 0; i < this.monsterParam.length; i++) {
        //             if (this.monsterParam[i].count > 0) {
        //                 return;
        //             }
        //         }
        //         this.monsterArray[0].destroy();
        //         this.monsterArray.splice(0, 1);
        //     }
        // } else {
        //     if (isCrystal(this.monsterArray[0]) && isCrystal(this.monsterArray[1])) {
        //         for (let i = 0; i < this.monsterParam.length; i++) {
        //             if (this.monsterParam[i].count > 0) {
        //                 return;
        //             }
        //         }
        //         this.monsterArray[0].destroy();
        //         this.monsterArray[1].destroy();
        //         this.monsterArray.splice(0, 2);
        //     }
        // }
    }


    public getScore() {
        let score = this.scoreGained;
        this.scoreGained = 0;
        return score;
    }

    public getHealth() {
        let health = this.healthGained;
        this.healthGained = 0;
        return health;
    }

    public getRound() {
        return this.currRound;
    }

    public getRoundEnd() {
        return !this.roundPlaying;
    }

}
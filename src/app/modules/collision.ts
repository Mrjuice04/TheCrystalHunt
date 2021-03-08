import { background } from 'src/app/modules/background';
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';
import { monsterControl } from 'src/app/modules/monsters/monsterControl';
import { IfStmt } from '@angular/compiler';
import { monster_crystal } from 'src/app/modules/monsters/monster_crystal/monster_crystal';
import { monsterType } from 'src/app/modules/monsters/monster_type';


// Global variables
let gMonsterArray: Array<monsterType> = [];
let gColliderInfoArray: Array<collisonInfo> = [];
let gCrystalArray: Array<monster_crystal> = [];
let gAttackArray: Array<any> = [];

type players = character_swordsman;

interface collisonInfo {
    collider: Phaser.Physics.Arcade.Collider;
    spriteClass: monsterType | players;
    attackClass: any;
}



export class collision {
    gameScene: Phaser.Scene;
    player!: character_swordsman;
    brickArray: Array<Phaser.Types.Physics.Arcade.ImageWithDynamicBody> = [];

    constructor(aScene: Phaser.Scene) {
        this.gameScene = aScene;
    }



    addBrick(aBrick: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, aInit: boolean) {
        this.gameScene.physics.add.collider(this.player.sprite, aBrick);
        this.brickArray.push(aBrick);
    }

    

    addPlayer(aPlayer: character_swordsman) {
        this.player = aPlayer;
    }

    addMonster(aMonster: monsterType) {
        this.gameScene.physics.add.collider(aMonster.sprite, this.player.sprite);
        for (let i = 0; i < this.brickArray.length; i++) {
            this.gameScene.physics.add.collider(aMonster.sprite, this.brickArray[i]);
        }
        for (let i = 0; i < gAttackArray.length; i++) {
            let collider = this.gameScene.physics.add.overlap(gAttackArray[i].sprite, aMonster.sprite, this.playerAttackHitMonster);
            let collision_info: collisonInfo = { collider: collider, spriteClass: aMonster, attackClass: gAttackArray[i] };
            gColliderInfoArray.push(collision_info);
        }
    }

    addPlayerAttack(aAttack: any) {
        for (let i = 0; i < gMonsterArray.length; i++) {
            let monstersprite = gMonsterArray[i].sprite;
            let collider = this.gameScene.physics.add.overlap(aAttack.sprite, monstersprite, this.playerAttackHitMonster);
            let collision_info: collisonInfo = { collider: collider, spriteClass: gMonsterArray[i], attackClass: aAttack };
            gColliderInfoArray.push(collision_info);
        }
        gAttackArray.push(aAttack);
    }

    playerAttackHitMonster(aAttack: Phaser.Types.Physics.Arcade.ArcadeColliderType, aMonster: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
        for (let i = 0; i < gColliderInfoArray.length; i++) {
            if (aAttack == gColliderInfoArray[i].attackClass.sprite) {
                if (aMonster == gColliderInfoArray[i].spriteClass.sprite) {
                    gColliderInfoArray[i].attackClass.hitMonster(gColliderInfoArray[i].spriteClass);
                    if (gColliderInfoArray[i].attackClass.oneTimeCollision) {
                        gColliderInfoArray[i].collider.destroy();
                        gColliderInfoArray.splice(i, 1)
                        i--;
                    } else {
                        gColliderInfoArray[i].collider.active = false;
                        setTimeout(() => {
                            if (gColliderInfoArray[i] !== undefined) {
                                if (gColliderInfoArray[i].attackClass.sprite.active) {
                                    gColliderInfoArray[i].collider.active = true;
                                }
                            }
                        }, gColliderInfoArray[i].attackClass.collisionFrequency)
                    }
                }
            }
        }
    }

    addMonsterAttack(aAttack: any) {
        let collider = this.gameScene.physics.add.overlap(aAttack.sprite, this.player.sprite, this.monsterAttackHitPlayer);
        let collision_info: collisonInfo = { collider: collider, spriteClass: this.player, attackClass: aAttack };
        gColliderInfoArray.push(collision_info);
        for (let i = 0; i < this.brickArray.length; i++) {
            this.gameScene.physics.add.overlap(aAttack.sprite, this.brickArray[i], this.attackHitGround);
        }
        gAttackArray.push(aAttack);
    }

    monsterAttackHitPlayer(aAttack: Phaser.Types.Physics.Arcade.ArcadeColliderType, aPlayer: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
        for (let i = 0; i < gColliderInfoArray.length; i++) {
            if (aAttack == gColliderInfoArray[i].attackClass.sprite) {
                if (aPlayer == gColliderInfoArray[i].spriteClass.sprite) {
                    gColliderInfoArray[i].attackClass.hitPlayer(gColliderInfoArray[i].spriteClass);
                    gColliderInfoArray[i].collider.destroy();
                    gColliderInfoArray.splice(i, 1)
                    i--;
                }
            }
        }
    }

    attackHitGround(aAttack: Phaser.Types.Physics.Arcade.ArcadeColliderType, aGround: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
        for (let i = 0; i < gAttackArray.length; i++) {
            if (aAttack == gAttackArray[i].sprite) {
                console.log(gAttackArray[i].hitGround);
                if (gAttackArray[i].hitGround !== undefined) {
                    gAttackArray[i].hitGround();
                }
            }
        }
    }

    addMonsterControl(aMonsterControl: monsterControl) {
        gMonsterArray = aMonsterControl.monsterArray;
    }

    addPlayerInteractiveItem(aItem: any) {
        let collider = this.gameScene.physics.add.overlap(aItem.sprite, this.player.sprite, this.playerCollectItem);
        let collision_info: collisonInfo = { collider: collider, spriteClass: this.player, attackClass: aItem };
        gColliderInfoArray.push(collision_info);
        for (let i = 0; i < this.brickArray.length; i++) {
            this.gameScene.physics.add.collider(aItem.sprite, this.brickArray[i]);
        }
    }

    playerCollectItem(aItem: Phaser.Types.Physics.Arcade.ArcadeColliderType, aPlayer: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
        for (let i = 0; i < gColliderInfoArray.length; i++) {
            if (aItem == gColliderInfoArray[i].attackClass.sprite) {
                if (aPlayer == gColliderInfoArray[i].spriteClass.sprite) {
                    gColliderInfoArray[i].attackClass.hitPlayer(gColliderInfoArray[i].spriteClass);
                    // gColliderInfoArray[i].collider.destroy();
                }
            }
        }

    }

    update() {
        this.updateAttackArray();
        this.updateColliderArray();
    }

    private updateAttackArray() {
        for (let i = 0; i < gAttackArray.length; i++) {
            if (!gAttackArray[i].sprite.active) {
                gAttackArray.splice(i, 1)
                i--;
            }
        }
    }

    private updateColliderArray() {
        for (let i = 0; i < gColliderInfoArray.length; i++) {
            if (!gColliderInfoArray[i].attackClass.sprite.active) {
                console.log("delete")
                gColliderInfoArray.splice(i, 1)
                i--;
            }
        }
    }

    public deleteCollider(aClass: any) {
        for (let i = 0; i < gColliderInfoArray.length; i++) {
            if (aClass == gColliderInfoArray[i].attackClass || aClass == gColliderInfoArray[i].spriteClass) {
                gColliderInfoArray[i].collider.destroy();
                gColliderInfoArray.splice(i, 1)
                i--;
            }
        }
    }
}


import { background } from 'src/app/modules/background';
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';
import { monsterControl } from 'src/app/modules/monsters/monster_control';
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



    addBrick(aBrick: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
        this.gameScene.physics.add.collider(this.player.sprite, aBrick);
        this.brickArray.push(aBrick);
    }

    addPlayer(aPlayer: character_swordsman) {
        this.player = aPlayer;
    }

    addMonster(aMonster: monster_zombie) {
        this.gameScene.physics.add.collider(aMonster.sprite, this.player.sprite);
        for (let i = 0; i < this.brickArray.length; i++) {
            this.gameScene.physics.add.collider(aMonster.sprite, this.brickArray[i]);
        }
        for (let i = 0; i < gAttackArray.length; i++) {
            let collider = this.gameScene.physics.add.collider(aMonster.sprite, gAttackArray[i]);
            let collision_info: collisonInfo = { collider: collider, spriteClass: aMonster, attackClass: gAttackArray[i]};
            gColliderInfoArray.push(collision_info);
        }
    }

    addPlayerAttack(aAttack: any) {
        gAttackArray.push(aAttack);
        for (let i = 0; i < gMonsterArray.length; i++) {
            let monstersprite = gMonsterArray[i].sprite;
            let collider = this.gameScene.physics.add.overlap(aAttack.sprite, monstersprite, this.playerAttackHitMonster);
            let collision_info: collisonInfo = { collider: collider, spriteClass: gMonsterArray[i], attackClass: aAttack };
            gColliderInfoArray.push(collision_info);
        }
    }

    playerAttackHitMonster(aAttack: Phaser.Types.Physics.Arcade.ArcadeColliderType, aMonster: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
        for (let i = 0; i < gColliderInfoArray.length; i++) {
            if (aAttack == gColliderInfoArray[i].attackClass.sprite) {
                if (aMonster == gColliderInfoArray[i].spriteClass.sprite) {
                    gColliderInfoArray[i].attackClass.hitMonster(gColliderInfoArray[i].spriteClass);
                    if (gColliderInfoArray[i].attackClass.oneTimeCollision) {
                        gColliderInfoArray[i].collider.destroy();
                    } else {
                        gColliderInfoArray[i].collider.active = false;
                        setTimeout(() => {
                            gColliderInfoArray[i].collider.active = true;
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
    }

    monsterAttackHitPlayer(aAttack: Phaser.Types.Physics.Arcade.ArcadeColliderType, aPlayer: Phaser.Types.Physics.Arcade.ArcadeColliderType) {

        for (let i = 0; i < gColliderInfoArray.length; i++) {
            if (aAttack == gColliderInfoArray[i].attackClass.sprite) {
                if (aPlayer == gColliderInfoArray[i].spriteClass.sprite) {
                    gColliderInfoArray[i].attackClass.hitPlayer(gColliderInfoArray[i].spriteClass);
                    gColliderInfoArray[i].collider.destroy();
                }
            }
        }
    }

    addMonsterControl(aMonsterControl: monsterControl) {
        gMonsterArray = aMonsterControl.monsterArray;
    }

    addCrystal(aCrystal: monster_crystal) {
        this.gameScene.physics.add.collider(aCrystal.sprite, this.player.sprite);
        gCrystalArray.push(aCrystal);
    }
}


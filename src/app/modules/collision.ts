import { background } from 'src/app/modules/background';
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { character_swordsman } from './character_sword/character_swordman';
import { monsterControl } from 'src/app/modules/monsters/monsterControl';
import { IfStmt } from '@angular/compiler';
import { crystal } from 'src/app/modules/monsters/crystal';


// Global variables
let gMonsterArray: Array<monster_zombie> = [];
let gColliderInfoArray: Array<collisonWithMonster> = [];
let gCrystalArray: Array<crystal> = [];

interface collisonWithMonster {
    collider: Phaser.Physics.Arcade.Collider;
    spriteClass: monster_zombie | character_swordsman;
    attackClass: any;
}


export class collision {
    gameScene: Phaser.Scene;
    player!: character_swordsman;
    brickArray: Array<Phaser.Types.Physics.Arcade.ImageWithStaticBody> = [];

    constructor(aScene: Phaser.Scene) {
        this.gameScene = aScene;
    }



    addBrick(aBrick: Phaser.Types.Physics.Arcade.ImageWithStaticBody){
        this.gameScene.physics.add.collider(this.player.sprite, aBrick);
        this.brickArray.push(aBrick);
    }

    addPlayer(aPlayer: character_swordsman) {
        this.player = aPlayer;
    }

    addMonster(aMonster: monster_zombie) {
        this.gameScene.physics.add.collider(aMonster.sprite, this.player.sprite);
        for(let i = 0; i < this.brickArray.length; i++){
            this.gameScene.physics.add.collider(aMonster.sprite, this.brickArray[i]);
        }
        for(let i = 0; i < gMonsterArray.length; i++){
            this.gameScene.physics.add.collider(aMonster.sprite, gMonsterArray[i].sprite);
        }
        for(let i = 0; i < gCrystalArray.length; i++){
            this.gameScene.physics.add.collider(aMonster.sprite, gCrystalArray[i].sprite);
        }
    }

    addPlayerAttack(aAttack: any) {
        for (let i = 0; i < gMonsterArray.length; i++) {
            let monstersprite = gMonsterArray[i].sprite;
            let collider = this.gameScene.physics.add.overlap(aAttack.sprite, monstersprite, this.playerAttackHitMonster);
            let collision_info: collisonWithMonster = { collider: collider, spriteClass: gMonsterArray[i], attackClass: aAttack };
            gColliderInfoArray.push(collision_info);
        }
    }

    playerAttackHitMonster(aAttack: Phaser.Types.Physics.Arcade.ArcadeColliderType, aMonster: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
        for (let i = 0; i < gColliderInfoArray.length; i++) {
            if (aAttack == gColliderInfoArray[i].attackClass.sprite) {
                if(aMonster == gColliderInfoArray[i].spriteClass.sprite){
                    gColliderInfoArray[i].attackClass.hitMonster(gColliderInfoArray[i].spriteClass);
                    gColliderInfoArray[i].collider.destroy();
                }
            }
        }
    }

    addMonsterAttack(aAttack: any){
        let collider = this.gameScene.physics.add.overlap(aAttack.sprite, this.player.sprite, this.monsterAttackHitPlayer);
        let collision_info: collisonWithMonster = { collider: collider, spriteClass: this.player, attackClass: aAttack};
        gColliderInfoArray.push(collision_info);
    }

    monsterAttackHitPlayer(aAttack: Phaser.Types.Physics.Arcade.ArcadeColliderType, aPlayer: Phaser.Types.Physics.Arcade.ArcadeColliderType){

        for (let i = 0; i < gColliderInfoArray.length; i++) {
            if (aAttack == gColliderInfoArray[i].attackClass.sprite) {
                if(aPlayer == gColliderInfoArray[i].spriteClass.sprite){
                    gColliderInfoArray[i].attackClass.hitPlayer(gColliderInfoArray[i].spriteClass);
                    gColliderInfoArray[i].collider.destroy();
                }
            }
        }
    }

    addMonsterControl(aMonsterControl: monsterControl) {
        gMonsterArray = aMonsterControl.monsterArray;
    }

    addCrystal(aCrystal: crystal){
        this.gameScene.physics.add.overlap(aCrystal.sprite, this.player.sprite);
        gCrystalArray.push(aCrystal);
    }
}


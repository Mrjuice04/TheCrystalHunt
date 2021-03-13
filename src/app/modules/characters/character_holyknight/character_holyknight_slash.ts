import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { monsterControl } from "src/app/modules/monsters/monsterControl";
import { monsterType, isCrystal } from 'src/app/modules/monsters/monster_type';
import { slashLevelParam, slashLevelData} from './character_holyknight_slash_level'


export class character_sword_slash {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterControl: monsterControl;

    stunTime: number = 500;
    energyGained: number = 0;
    oneTimeCollision: boolean = true;
    collisionFrequency: number = 0;

    private damage!: number;
    private cooldown!: number;
    private empowerRate!: number;
    private empowerStun: boolean = false;
    private isEmpowerHit:boolean = false;
    
    private levelData: slashLevelData = new slashLevelData();


    constructor(aScene: Phaser.Scene, aCollision: collision, aMonsterControl: monsterControl, aLevel: number) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.monsterControl = aMonsterControl;
        let levelAttributes = this.levelData.getParam(aLevel);
        this.damage = levelAttributes.damage;
        this.cooldown = levelAttributes.cooldown;
        this.empowerRate = levelAttributes.empowerRate;
        if (aLevel >= 6){
            this.empowerStun = true;
        }
    }

    public create(aPosX: number, aPosY: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "slash_effect").setDepth(2);
        this.gameScene.sound.add('ability_slash');
        this.sprite.body.setAllowGravity(false);
        this.collision.addPlayerAttack(this)
    }

    public playAnims() {
        this.sprite.anims.play("slash_effect");
        this.gameScene.sound.play('ability_slash');
        this.gameScene.sound.play('ability_slash_2');

    }

    public empowerHit(){
        this.damage *= 2;
        this.sprite.setTint(0xFFBF00);
        this.isEmpowerHit = true;
    }

    public hitMonster(aMonster: monsterType) {
        aMonster.isDamaged(this.damage);
        if (!isCrystal(aMonster)) {
            this.energyGained += 4;
        }
        if (this.isEmpowerHit && this.empowerStun){
            aMonster.isStunned(this.stunTime);
        }
    }

    public getEnergy() {
        let energy = this.energyGained;
        this.energyGained = 0;
        return energy;
    }

    public getCoolDown() {
        return this.cooldown;
    }

    public getEmpowerRate() {
        return this.empowerRate;
    }

    public destroy() {
        this.sprite.destroy();
        this.collision.deleteCollider(this);
    }

}

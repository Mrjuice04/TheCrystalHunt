import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';



export class monster_mummy_bandage {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    collision: collision;
    damage: number = 10;
    stunTime: number = 300; //ms
    origin!: number;
    private isHit: boolean = false;
    private targetPlayer!: character_swordsman;
    public oneTimeCollision: boolean = true;


    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    create(aPosX: number, aPosY: number, aOriginX: number) {
        this.sprite = this.gameScene.physics.add.sprite(aPosX, aPosY, "monster_mummy_bandage").setBodySize(0, 0, false).setOrigin(aOriginX, 0.5).setScale(1, 0.5);
        this.sprite.setCrop(0, 0, 0, this.sprite.height);
        this.sprite.body.setAllowGravity(false);
        this.origin = aOriginX;
        setTimeout(() => {
            this.collision.addMonsterAttack(this);
        }, 100)
    }

    hitPlayer(aPlayer: character_swordsman) {
        this.isHit = true;
        aPlayer.isDamaged(this.damage);
        aPlayer.isStunned(this.stunTime);
        if (aPlayer.getUnstoppable()){
            return;
        }
        this.targetPlayer = aPlayer;
    }

    public extending(aTick: number) {
        if (aTick > 500) {
            return;
        }
        let width = 200 * (aTick / 500);
        if (this.origin == 0) {
            this.sprite.setCrop(0, 0, width, this.sprite.height);
            this.sprite.setBodySize(width, this.sprite.height, false);
        } else {
            this.sprite.setCrop(200 - width, 0, width, this.sprite.height);
            this.sprite.setBodySize(width, this.sprite.height, false);
            this.sprite.setOffset(200 - width, 0)
        }
    }

    public pulling(aTick: number, aLength: number) {
        if (aTick > aLength) { 
            return;
        }
        let width = 200 * (aLength / 500) - 200 * (aTick / 500);
        if (this.origin == 0) {
            this.sprite.setCrop(0, 0, width, this.sprite.height);
            this.sprite.setBodySize(width, this.sprite.height, false);
        } else {
            this.sprite.setCrop(200 - width, 0, width, this.sprite.height);
            this.sprite.setBodySize(width, this.sprite.height, false);
            this.sprite.setOffset(200 - width, 0)
        }
        if (this.isHit && this.targetPlayer != undefined){
            if (this.origin == 0){
                let pos = this.sprite.getLeftCenter();
                let posX = pos.x + width;
                this.targetPlayer.isDisplaced(posX, pos.y)
            } else {
                let pos = this.sprite.getRightCenter();
                let posX = pos.x - width;
                this.targetPlayer.isDisplaced(posX, pos.y)
            }
        }
    }

    public hasHitPlayer(){
        return this.isHit;
    }

    playAnims() {
        this.sprite.anims.play("bite");
    }

    destroy() {
        this.sprite.destroy();
    }
}
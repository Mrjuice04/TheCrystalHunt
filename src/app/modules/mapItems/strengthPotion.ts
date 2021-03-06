import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';


export class strengthPotion {
    public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    //import classes
    private gameScene: Phaser.Scene;
    // private collision: collision;

    //attributes
    private heal: number = 30;

    constructor(aScene: Phaser.Scene) {
        this.gameScene = aScene;
    }

    public create(pos_x: number, pos_y: number) {
        this.sprite = this.gameScene.physics.add.sprite(pos_x, pos_y, "health_crystal").setScale(0.1, 0.1).setTint(0x58D3F7);
        this.sprite.setCollideWorldBounds(true);
    }

    public hitPlayer(aPlayer: character_swordsman){
        aPlayer.isHealed(this.heal);
        this.destroy();
    }

    public destroy(){
        this.sprite.destroy();
    }
}
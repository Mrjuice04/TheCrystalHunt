import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';


export class healCrystal {
    public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    //import classes
    private gameScene: Phaser.Scene;
    // private collision: collision;

    //attributes
    private heal: number = 10;

    constructor(aScene: Phaser.Scene) {
        this.gameScene = aScene;
    }

    public create(pos_x: number, pos_y: number) {
        this.sprite = this.gameScene.physics.add.sprite(pos_x, pos_y, "health_crystal").setScale(0.1, 0.1);
        this.sprite.setTint(0x00FF00);
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

export class energyCrystal {
    public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    //import classes
    private gameScene: Phaser.Scene;
    // private collision: collision;

    //attributes
    private energy: number = 10;

    constructor(aScene: Phaser.Scene) {
        this.gameScene = aScene;
    }

    public create(pos_x: number, pos_y: number) {
        this.sprite = this.gameScene.physics.add.sprite(pos_x, pos_y, "health_crystal").setScale(0.1, 0.1);
        this.sprite.setTint(0x0000FF);
        this.sprite.setCollideWorldBounds(true);
    }

    public hitPlayer(aPlayer: character_swordsman){
        aPlayer.incEnergy(this.energy);
        this.destroy();
    }

    public destroy(){
        this.sprite.destroy();
    }
}
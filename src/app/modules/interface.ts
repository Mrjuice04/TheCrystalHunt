export class game_interface{
    gameScene!: Phaser.Scene;
    healthBar!: Phaser.GameObjects.Sprite;

    constructor(aScene: Phaser.Scene){
        this.gameScene = aScene;
        this.gameScene.load.image("profile", "./assets/profile_test.png");
        this.gameScene.load.image("healthBar", "./assets/hb.png");
    }

    public create(){
        this.gameScene.add.sprite(400, 572, "profile");
        this.healthBar = this.gameScene.add.sprite(400, 564, "healthBar");
    }

    public changeHealthBar(aHealthPoint: number){
        let width = this.healthBar.width;
        let height = this.healthBar.height;
        let ratio = aHealthPoint / 100;
        let new_width = width * ratio;
        this.healthBar.setCrop(0, 0, new_width, height);
    }

    public changeEnergyBar(aHealthPoint: number){
        let width = this.healthBar.width;
        let height = this.healthBar.height;
        let ratio = aHealthPoint / 100;
        let new_width = width * ratio;
        this.healthBar.setCrop(0, 0, new_width, height);
    }
}
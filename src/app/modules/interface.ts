import { Text } from "@angular/compiler/src/i18n/i18n_ast";

export class game_interface{
    gameScene!: Phaser.Scene;
    healthBar!: Phaser.GameObjects.Sprite;
    energyBar!: Phaser.GameObjects.Sprite;
    score: number = 0;
    scoreText!: Phaser.GameObjects.Text;
    abilityIcon1!: Phaser.GameObjects.Sprite;

    constructor(aScene: Phaser.Scene){
        this.gameScene = aScene;
        this.gameScene.load.image("profile", "./assets/profile_test.png");
        this.gameScene.load.image("healthBar", "./assets/hb.png");
        this.gameScene.load.image("energyBar", "./assets/eb.png");
    }

    public create(){
        this.gameScene.add.sprite(400, 572, "profile");
        this.healthBar = this.gameScene.add.sprite(400, 564, "healthBar");
        this.energyBar = this.gameScene.add.sprite(400, 579, "energyBar");
        this.changeEnergyBar(50);
        this.scoreText = this.gameScene.add.text(100, 572, "Score: " + this.score.toString());
        this.scoreText.setOrigin(0.5, 0.5);
        this.abilityIcon1 = this.gameScene.add.sprite(554, 572, 'ability1').setScale(0.45, 0.45);
    }

    public changeHealthBar(aHealthPoint: number){
        let width = this.healthBar.width;
        let height = this.healthBar.height;
        let ratio = aHealthPoint / 100;
        let new_width = width * ratio;
        this.healthBar.setCrop(0, 0, new_width, height);
    }

    public changeEnergyBar(aEnergyPoint: number){
        let width = this.energyBar.width;
        let height = this.energyBar.height;
        let ratio = aEnergyPoint / 100;
        let new_width = width * ratio;
        this.energyBar.setCrop(0, 0, new_width, height);
    }

    public changeScore(aScore: number){
        this.score = aScore;
        this.scoreText.setText("Score: " + this.score.toString());
    }
}
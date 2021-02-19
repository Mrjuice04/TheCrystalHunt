import { Text } from "@angular/compiler/src/i18n/i18n_ast";

export class game_interface{
    gameScene!: Phaser.Scene;
    healthBar!: Phaser.GameObjects.Sprite;
    energyBar!: Phaser.GameObjects.Sprite;
    score: number = 0;
    scoreText!: Phaser.GameObjects.Text;
    basicAttackIcon!: Phaser.GameObjects.Sprite;
    abilityIcon1!: Phaser.GameObjects.Sprite;
    abilityIcon2!: Phaser.GameObjects.Sprite;
    ultimateIcon!: Phaser.GameObjects.Sprite;
    currRound: number = 0;
    roundText!: Phaser.GameObjects.Text;

    constructor(aScene: Phaser.Scene){
        this.gameScene = aScene;
        this.gameScene.load.image("profile", "./assets/profile_test.png");
        this.gameScene.load.image("healthBar", "./assets/hb.png");
        this.gameScene.load.image("energyBar", "./assets/eb.png");
        this.gameScene.load.image("sky", "./assets/gameScene/sky.png");
    }

    public create(){
        this.gameScene.add.sprite(400, 572, "profile");
        this.healthBar = this.gameScene.add.sprite(400, 564, "healthBar");
        this.energyBar = this.gameScene.add.sprite(400, 579, "energyBar");
        this.changeEnergyBar(0);
        this.scoreText = this.gameScene.add.text(200, 572, "Score: " + this.score.toString());
        this.scoreText.setOrigin(0.5, 0.5);
        this.roundText = this.gameScene.add.text(80, 572, "Round: " + this.currRound.toString());
        this.roundText.setOrigin(0.5, 0.5);
        this.basicAttackIcon = this.gameScene.add.sprite(554, 572, 'basicAttack').setScale(0.45, 0.45);
        this.gameScene.add.text(554, 595, "A").setOrigin(0.5, 0.5).setFill("0xffffff");
        this.abilityIcon1 = this.gameScene.add.sprite(625, 572, 'ability1').setScale(0.45, 0.45);
        this.gameScene.add.text(625, 595, "S").setOrigin(0.5, 0.5).setFill("0xffffff");
        this.abilityIcon2 = this.gameScene.add.sprite(696, 572, 'ability2').setScale(0.45, 0.45);
        this.gameScene.add.text(696, 595, "D").setOrigin(0.5, 0.5).setFill("0xffffff");
        this.ultimateIcon = this.gameScene.add.sprite(767, 572, 'ultimate').setScale(0.2, 0.2);
        this.gameScene.add.text(767, 595, "Q").setOrigin(0.5, 0.5).setFill("0xffffff");
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

    public changeRound(aRound: number){
        this.currRound = aRound;
        this.roundText.setText("Round: " + this.currRound.toString());
    }
}
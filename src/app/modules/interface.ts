import { Text } from "@angular/compiler/src/i18n/i18n_ast";

export class game_interface {
    gameScene!: Phaser.Scene;
    healthBar!: Phaser.GameObjects.Sprite;
    maxHealthPoint!: number;
    energyBar!: Phaser.GameObjects.Sprite;
    maxEnergyPoint!: number;
    score: number = 0;
    scoreText!: Phaser.GameObjects.Text;
    basicAttackIcon!: Phaser.GameObjects.Sprite;
    abilityIcon1!: Phaser.GameObjects.Sprite;
    abilityIcon2!: Phaser.GameObjects.Sprite;
    ultimateIcon!: Phaser.GameObjects.Sprite;
    currRound: number = 0;
    roundText!: Phaser.GameObjects.Text;

    ability1Energy!: number;
    ability2Energy!: number;
    ability3Energy!: number;

    ability1Shade!: Phaser.GameObjects.Sprite;
    ability2Shade!: Phaser.GameObjects.Sprite;
    ability3Shade!: Phaser.GameObjects.Sprite;
    playerEnergy!: number;

    levelText0!: Phaser.GameObjects.Text;
    levelText1!: Phaser.GameObjects.Text;
    levelText2!: Phaser.GameObjects.Text;
    levelText3!: Phaser.GameObjects.Text;

    constructor(aScene: Phaser.Scene) {
        this.gameScene = aScene;
        this.gameScene.load.image("profile", "./assets/gameScene/profile_test.png");
        this.gameScene.load.image("healthBar", "./assets/gameScene/healthBar.png");
        this.gameScene.load.image("energyBar", "./assets/gameScene/energyBar.png");
        this.gameScene.load.image("sky", "./assets/gameScene/sky.png");
        this.gameScene.load.image("iconShade", "./assets/gameScene/iconShade.png");
        this.gameScene.load.image("levelUpBox", "./assets/gameScene/levelUpBox.png");
        this.gameScene.load.image("levelUpText", "./assets/gameScene/levelUp.png");
    }

    public create() {
        this.gameScene.add.sprite(400, 572, "profile");
        this.healthBar = this.gameScene.add.sprite(400, 564, "healthBar");
        this.energyBar = this.gameScene.add.sprite(400, 579, "energyBar");
        this.changeEnergyBar(0);
        this.scoreText = this.gameScene.add.text(200, 572, "Score: " + this.score.toString());
        this.scoreText.setOrigin(0.5, 0.5);
        this.roundText = this.gameScene.add.text(80, 572, "Round: " + this.currRound.toString());
        this.roundText.setOrigin(0.5, 0.5);
        this.basicAttackIcon = this.gameScene.add.sprite(554, 572, 'basicAttack').setScale(0.45, 0.45);
        this.gameScene.add.text(554, 595, "A").setOrigin(0.5, 0.5).setFill("0xffffff").setScale(0.75);;

        this.abilityIcon1 = this.gameScene.add.sprite(625, 572, 'ability1').setScale(0.45, 0.45);
        this.gameScene.add.text(625, 595, "S").setOrigin(0.5, 0.5).setFill("0xffffff").setScale(0.75);
        this.ability1Shade = this.gameScene.add.sprite(625, 572, 'iconShade').setScale(0.55, 0.55);

        this.abilityIcon2 = this.gameScene.add.sprite(696, 572, 'ability2').setScale(0.45, 0.45);
        this.gameScene.add.text(696, 595, "D").setOrigin(0.5, 0.5).setFill("0xffffff").setScale(0.75);;
        this.ability2Shade = this.gameScene.add.sprite(696, 572, 'iconShade').setScale(0.55, 0.55);

        this.ultimateIcon = this.gameScene.add.sprite(767, 572, 'ultimate').setScale(0.2, 0.2);
        this.gameScene.add.text(767, 595, "SPACE").setOrigin(0.5, 0.5).setFill("0xffffff").setScale(0.75);;
        this.ability3Shade = this.gameScene.add.sprite(767, 572, 'iconShade').setScale(0.55, 0.55);

        this.levelText0 = this.gameScene.add.text(554, 549, "Lvl 1").setOrigin(0.5, 0.5).setFill("0xffffff").setScale(0.75);
        this.levelText1 = this.gameScene.add.text(625, 549, "Lvl 1").setOrigin(0.5, 0.5).setFill("0xffffff").setScale(0.75);
        this.levelText2 = this.gameScene.add.text(696, 549, "Lvl 1").setOrigin(0.5, 0.5).setFill("0xffffff").setScale(0.75);
        this.levelText3 = this.gameScene.add.text(767, 549, "Lvl 1").setOrigin(0.5, 0.5).setFill("0xffffff").setScale(0.75);

    }

    public update() {
        let width = this.ability1Shade.width;
        let height = this.ability1Shade.height;
        if (this.playerEnergy >= this.ability1Energy) {
            this.ability1Shade.setCrop(0, 0, 0, height);
        } else {
            this.ability1Shade.setCrop(0, 0, width, height);
        }
        if (this.playerEnergy >= this.ability2Energy) {
            this.ability2Shade.setCrop(0, 0, 0, height);
        } else {
            this.ability2Shade.setCrop(0, 0, width, height);
        }
        if (this.playerEnergy >= this.ability3Energy) {
            this.ability3Shade.setCrop(0, 0, 0, height);
        } else {
            this.ability3Shade.setCrop(0, 0, width, height);
        }
    }

    public changeHealthBar(aHealthPoint: number) {
        let width = this.healthBar.width;
        let height = this.healthBar.height;
        let ratio = aHealthPoint / this.maxHealthPoint;
        let new_width = width * ratio;
        this.healthBar.setCrop(0, 0, new_width, height);
    }

    public changeEnergyBar(aEnergyPoint: number) {
        let width = this.energyBar.width;
        let height = this.energyBar.height;
        let ratio = aEnergyPoint / this.maxEnergyPoint;
        let new_width = width * ratio;
        this.energyBar.setCrop(0, 0, new_width, height);
        this.playerEnergy = aEnergyPoint;
    }

    public changeScore(aScore: number) {
        this.score = aScore;
        this.scoreText.setText("Score: " + this.score.toString());
    }

    public changeRound(aRound: number) {
        this.currRound = aRound;
        this.roundText.setText("Round: " + this.currRound.toString());
    }

    public changeMaxHealth(aHealthPoint: number) {
        this.maxHealthPoint = aHealthPoint;
    }

    public changeMaxEnergy(aEnergyPoint: number) {
        this.maxEnergyPoint = aEnergyPoint;
    }

    public addAbilityEnergy(aEnergy1: number, aEnergy2: number, aEnergy3: number) {
        this.ability1Energy = aEnergy1;
        this.ability2Energy = aEnergy2;
        this.ability3Energy = aEnergy3;
    }

    public changeAbilityLevel(aLevel0: number, aLevel1: number, aLevel2: number, aLevel3: number,) {
        this.levelText0.setText("Lvl " + aLevel0);
        this.levelText1.setText("Lvl " + aLevel1);
        this.levelText2.setText("Lvl " + aLevel2);
        this.levelText3.setText("Lvl " + aLevel3);
        if (aLevel0 == 9){
            this.levelText0.setText("Lvl Max");
        }
        if (aLevel1 == 9){
            this.levelText1.setText("Lvl Max");
        }
        if (aLevel2 == 9){
            this.levelText2.setText("Lvl Max");
        }
        if (aLevel3 == 3){
            this.levelText3.setText("Lvl Max");
        }
    }
}
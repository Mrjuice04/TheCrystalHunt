import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';


export class levelUpItem {
    public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    public iconBox!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    public iconText!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    //import classes
    private gameScene: Phaser.Scene;

    private keyCRTL!: Phaser.Input.Keyboard.Key;
    private spawnRoll = Math.random() * 2;

    private text!: Phaser.GameObjects.Text;
    private state: string = "idle";

    private ability!: integer;

    constructor(aScene: Phaser.Scene) {
        this.gameScene = aScene;
    }

    public create(pos_x: number, pos_y: number, aAbility: integer) {
        this.iconBox = this.gameScene.physics.add.sprite(pos_x, pos_y, "levelUpBox").setScale(0.5, 0.5);
        this.iconBox.body.setAllowGravity(false);
        this.iconBox.setCollideWorldBounds(true);
        this.iconBox.setVelocityY(25)
        this.iconBox.body.setMaxVelocityY(25);


        if (aAbility == 0) {
            this.sprite = this.gameScene.physics.add.sprite(pos_x, pos_y, "basicAttack").setScale(0.4, 0.4);
        } else if (aAbility == 1) {
            this.sprite = this.gameScene.physics.add.sprite(pos_x, pos_y, "ability1").setScale(0.4, 0.4);
        } else if (aAbility == 2) {
            this.sprite = this.gameScene.physics.add.sprite(pos_x, pos_y, "ability2").setScale(0.4, 0.4);
        } else {
            this.sprite = this.gameScene.physics.add.sprite(pos_x, pos_y, "ability3").setScale(0.15, 0.15);
        }
        this.sprite.body.setAllowGravity(false);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setVelocityY(25)
        this.sprite.body.setMaxVelocityY(25);

        this.iconText = this.gameScene.physics.add.sprite(pos_x, pos_y + 16, "levelUpText").setScale(0.5, 0.5).setOrigin(0.5, 1);
        this.iconText.body.setAllowGravity(false);
        this.iconText.setCollideWorldBounds(true);
        this.iconText.setVelocityY(25)
        this.iconText.body.setMaxVelocityY(25);

        let pos = this.sprite.getTopCenter();
        this.text = this.gameScene.add.text(pos.x, pos.y - 10, 'Press CTRL').setOrigin(0.5, 1)
        this.text.setCrop(0, 0, 0, this.text.height);

        this.ability = aAbility;
        this.keyCRTL = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    }

    public hitPlayer(aPlayer: character_swordsman) {
        this.state = "overlapped";
        // console.log(this.ability)

        if (this.keyCRTL.isDown) {
            let attack;
            if (this.ability == 0) {
                attack = 0;
            } else if (this.ability == 1) {
                attack = 1;
            } else if (this.ability == 2) {
                attack = 2;
            } else {
                attack = 3;
            }
            console.log(this.ability);
            if (this.ability <= 2) {
                if (aPlayer.getAttackLevel(this.ability) >= 9) {
                    this.text.setText("Already at Max Level")
                    return;
                }
            }

            aPlayer.attackLevelUp(attack);
            this.destroy();
        }
    }

    public destroy() {
        this.sprite.destroy();
        this.text.destroy();
        this.iconBox.destroy();
        this.iconText.destroy();
    }

    public update() {
        this.stateMachine();
        this.state = "idle";
        if (this.sprite.getCenter().y >= 500) {
            this.sprite.setAccelerationY(-50);
            let pos = this.sprite.getCenter();
            this.text.setPosition(pos.x, pos.y - 10);
        } else {
            this.sprite.setAccelerationY(50);
            let pos = this.sprite.getCenter();
            this.text.setPosition(pos.x, pos.y - 10);
        }
        if (this.iconBox.getCenter().y >= 500) {
            this.iconBox.setAccelerationY(-50);
            this.iconText.setAccelerationY(-50);
        } else {
            this.iconBox.setAccelerationY(50);
            this.iconText.setAccelerationY(50);

        }
    }

    private stateMachine() {
        switch (this.state) {
            case "idle": {
                this.text.setCrop(0, 0, 0, this.text.height);
                break;
            }
            case "overlapped": {
                this.text.setCrop(0, 0, this.text.width, this.text.height);
                break;
            }
            default: {
                this.state = "idle"
                break;
            }
        }
    }

    public getAbility(){
        return this.ability;
    }
}
import { collision } from 'src/app/modules/collision';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';


export class levelUp {
    public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    //import classes
    private gameScene: Phaser.Scene;

    private keyCRTL!: Phaser.Input.Keyboard.Key;
    private spawnRoll = Math.random() * 2;

    private text!: Phaser.GameObjects.Text;
    private state: string = "idle";

    constructor(aScene: Phaser.Scene) {
        this.gameScene = aScene;
    }

    public create(pos_x: number, pos_y: number) {
        this.sprite = this.gameScene.physics.add.sprite(pos_x, pos_y, "health_crystal").setScale(0.1, 0.1);
        this.sprite.setCollideWorldBounds(true);
        this.keyCRTL = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        let pos = this.sprite.getTopCenter();
        this.text = this.gameScene.add.text(pos.x, pos.y + 2, 'hi');
        this.text.setOrigin(0.5, 1);
        this.text.setCrop(0, 0, 0, this.text.height);
        if (this.spawnRoll <= 1.3) {
            if (this.spawnRoll < 0.1) {
                this.text.setText("Ability 3 Lvl Up")
            } else if (this.spawnRoll < 0.5) {
                this.text.setText("Ability 2 Lvl Up");
            } else if (this.spawnRoll < 0.8) {
                this.text.setText("Ability 1 Lvl Up");
            } else {
                this.text.setText("Basic Attack Lvl Up");
            }
            this.sprite.setTint(0xFF0040);
        } else {
            if (this.spawnRoll - 1.3 < 0.4) {
                this.sprite.setTint(0x00FF00);
                this.text.setText("Max HP Up");
            } else {
                this.sprite.setTint(0x0000FF);
                this.text.setText("Max Energy Up");
            }
        }
    }

    public hitPlayer(aPlayer: character_swordsman) {
        this.state = "overlapped";

        if (this.keyCRTL.isDown) {
            let attack;
            if (this.spawnRoll <= 1.3) {
                if (this.spawnRoll < 0.1) {
                    attack = 3;
                    console.log("attack3LvlUp");
                } else if (this.spawnRoll < 0.4) {
                    attack = 2
                    console.log("attack2LvlUp");
                } else if (this.spawnRoll < 0.7) {
                    attack = 1
                    console.log("attack1LvlUp");
                } else {
                    attack = 0;
                    console.log("attack0LvlUp");
                }
                aPlayer.attackLevelUp(attack);
            } else {
                if (this.spawnRoll - 1.3 < 0.4) {
                    aPlayer.incMaxHealth(10);
                    aPlayer.isHealed(75);
                    console.log("incMaxHp");
                } else {
                    aPlayer.incMaxEnergy(10);
                    aPlayer.incEnergy(50);
                    console.log("incMaxEng");
                }
            }
            this.destroy();
        }
    }

    public destroy() {
        this.sprite.destroy();
        this.text.destroy();
    }

    public update() {
        this.stateMachine();
        this.state = "idle";
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
}
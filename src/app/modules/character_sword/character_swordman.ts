import { Scene } from "phaser";
import { animationFrameScheduler } from "rxjs";
import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { character_sword_dash } from 'src/app/modules/character_sword/character_swordman_dash'
import { character_sword_spin } from 'src/app/modules/character_sword/character_swordman_spin'
import { monsterControl } from "../monsters/monsterControl";


export class character_swordsman {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    collision: collision;
    inAnims: boolean = false;
    monsterControl!: monsterControl;
    healthPoint: number = 100;
    canAttack: boolean = true;
    canMove: boolean = true;
    private state_value: string = "idle";
    gameScene: Phaser.Scene;

    //tick
    lastDashTick!: number;
    lastSpinTick!: number;
    init_height!: number;
    lastStunTick!: number;
    lastJumpTick!: number;
    stunnedTime!: number;

    //keys
    keyW!: Phaser.Input.Keyboard.Key;
    keyA!: Phaser.Input.Keyboard.Key;
    keyS!: Phaser.Input.Keyboard.Key;
    keyD!: Phaser.Input.Keyboard.Key;
    keyQ!: Phaser.Input.Keyboard.Key;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    //character 

    constructor(aScene: Phaser.Scene, aCollision: collision) {
        aScene.load.spritesheet("character_swordman", "./assets/character_swordsman_test.png", { frameWidth: 15, frameHeight: 18 });
        aScene.load.spritesheet("ability_dash", "./assets/sword_effect.png", { frameWidth: 24, frameHeight: 11 });
        aScene.load.spritesheet("ability_spin", "./assets/effect.png", { frameWidth: 72, frameHeight: 72 });

        this.collision = aCollision;
        this.gameScene = aScene;

        //keys
        this.keyW = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyQ = this.gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.cursors = this.gameScene.input.keyboard.createCursorKeys();
    }

    create() {
        this.sprite = this.gameScene.physics.add.sprite(50, 500, "character_swordman").setScale(1.4, 1.4);
        this.sprite.setCollideWorldBounds(true);
        this.collision.addPlayer(this);
    }

    machine() {
        switch (this.state_value) {
            case "idle": {
                if (this.check_walking()) {
                    this.state_value = "walking";
                } else if (this.check_jump()) {
                    this.doJump();
                    this.state_value = "jumping";
                } else if (this.check_attack_Dash()) {
                    this.do_attack_Dash_1();
                    this.state_value = "attacking_dash";
                } else if (this.check_attack_Spin()) {
                    this.state_value = "attacking_spin_1";
                } else {
                    this.is_idle();
                }
                break;
            }
            case "walking": {
                if (!this.do_walking()) {
                    this.state_value = "idle";
                } else if (!this.canMove) {
                    this.state_value = "idle";
                } else if (this.check_jump()) {
                    this.doJump();
                    this.state_value = "jumping";
                } else if (this.check_attack_Dash()) {
                    this.do_attack_Dash_1();
                    this.state_value = "attacking_dash";
                } else if (this.check_attack_Spin()) {
                    this.state_value = "attacking_spin_1";
                }
                break;
            }
            case "jumping": {
                this.do_walking();
                if (this.check_doubleJump()) {
                    this.do_doubleJump();
                    this.state_value = "doubleJumping";
                } else if (this.is_jump_end()) {
                    this.state_value = "idle"
                } else if (this.check_attack_Spin()) {
                    this.state_value = "attacking_spin_1";
                }
                break;
            }
            case "doubleJumping": {
                this.do_walking();
                if (this.is_jump_end()) {
                    this.state_value = "idle"
                }
                break;
            }
            case "attacking_dash": {
                if (this.do_attack_Dash_2()) {
                    this.state_value = "idle"
                }
                break;
            }
            case "attacking_spin_1": {
                if (this.do_attack_Spin_1()) {
                    this.state_value = "attacking_spin_2"
                }
                break;
            }
            case "attacking_spin_2": {
                if (this.is_attack_Spin_end()) {
                    this.state_value = "idle"
                }
                break;
            }
            case "stunned": {
                if (this.isStunEnd()) {
                    console.log("stunned");
                    this.state_value = "idle";
                }
                break;
            }
            default: {
                this.state_value = "idle"
                break;
            }
        }
    }

    update() {
        this.machine();
    }

    public createAnims(aScene: Phaser.Scene) {
        aScene.anims.create({
            key: "move",
            frames: aScene.anims.generateFrameNumbers("character_swordman", { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1,
        });

        aScene.anims.create({
            key: "idle",
            frames: aScene.anims.generateFrameNumbers("character_swordman", { start: 7, end: 10 }),
            frameRate: 10,
            repeat: -1,
        });

        aScene.anims.create({
            key: "attack",
            frames: aScene.anims.generateFrameNumbers("character_swordman", { start: 21, end: 24 }),
            frameRate: 10,
        });

        aScene.anims.create({
            key: "ability_dash",
            frames: aScene.anims.generateFrameNumbers("ability_dash", { start: 0, end: 4 }),
            frameRate: 20,
        })

        aScene.anims.create({
            key: "ability_spin",
            frames: aScene.anims.generateFrameNumbers("ability_spin", { start: 0, end: 12 }),
            frameRate: 20,
        })
    }
    public isStunned(aTime: number) {
        this.sprite.setAccelerationX(0);
        this.sprite.setVelocityX(0);
        this.lastStunTick = utils.getTick();
        this.stunnedTime = aTime;
        this.state_value = "stunned"
    }

    private isStunEnd() {
        if (utils.tickElapsed(this.lastStunTick) >= this.stunnedTime) {
            return true;
        }
        return false;
    }

    public isDamaged(aDamage: number) {
        this.healthPoint -= aDamage;
    }

    private is_idle() {
        this.sprite.setVelocityX(0);
        this.sprite.body.setAllowGravity(true);
        this.sprite.anims.play("idle", true);
    }

    private check_walking() {
        if ((this.cursors.left.isDown || this.cursors.right.isDown) && this.sprite.body.touching.down) {
            return true;
        }
        return false;
    }

    private do_walking() {
        if (this.cursors.left.isDown) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-100);
            this.sprite.anims.play("move", true);
            return true;
        } else if (this.cursors.right.isDown) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(100);
            this.sprite.anims.play("move", true);
            return true;
        } else {
            this.sprite.setVelocityX(0);
            return false;
        }
    }

    private check_jump(): boolean {
        if (this.canMove && this.sprite.body.touching.down && this.cursors.up.isDown) {
            return true;
        }
        return false;
    }

    private doJump() {
        this.init_height = this.sprite.getCenter().y;
        this.sprite.setVelocityY(-200);
        this.lastJumpTick = utils.getTick();
    }

    private check_doubleJump(): boolean {
        let curr_height = this.sprite.getCenter().y;
        if (this.canMove && (((curr_height - this.init_height) <= -40) || (utils.tickElapsed(this.lastJumpTick) >= 400) || this.lastJumpTick == undefined) && this.cursors.up.isDown) {
            return true;
        }
        return false;
    }

    private do_doubleJump() {
        this.sprite.setVelocityY(-150);
    }

    private is_jump_end() {
        if (this.sprite.body.touching.down) {
            return true;
        }
        return false;
    }

    private check_attack_Dash() {
        if (this.sprite.body.touching.down && ((this.lastDashTick == undefined) || (utils.tickElapsed(this.lastDashTick) >= 800)) && this.keyQ.isDown) {
            return true;
        }
        return false;
    }

    private do_attack_Dash_1() {
        this.lastDashTick = utils.getTick();
        if (this.sprite.flipX == false) {
            this.sprite.setVelocityX(200);
        } else if (this.sprite.flipX == true) {
            this.sprite.setVelocityX(-200);
        }
        this.sprite.anims.play("attack", true);
    }

    private do_attack_Dash_2() {
        if ((utils.tickElapsed(this.lastDashTick) >= 300)) {
            this.sprite.setVelocityX(0);
            let attack = new character_sword_dash(this.gameScene, this.collision, this.monsterControl);
            if (!this.sprite.flipX) {
                attack.create(this.sprite.getRightCenter().x + 10, this.sprite.getRightCenter().y + 3);
                attack.playAnims();
            } else {
                attack.create(this.sprite.getLeftCenter().x - 10, this.sprite.getRightCenter().y + 3);
                attack.sprite.flipX = true;
                attack.playAnims();
            }
            setTimeout(() => {
                attack.destroy();
            }, 300)
            return true;
        }
        return false;
    }

    private check_attack_Spin() {
        if (((this.lastSpinTick == undefined) || (utils.tickElapsed(this.lastSpinTick) >= 3000)) && this.keyW.isDown) {
            this.lastSpinTick = utils.getTick();
            return true;
        }
        return false;
    }

    private do_attack_Spin_1() {
        if ((utils.tickElapsed(this.lastSpinTick) >= 300)) {
            this.sprite.setVelocity(0, 0);
            this.sprite.body.setAllowGravity(false);

            let pos_vector = this.sprite.getCenter();
            let effect = new character_sword_spin(this.gameScene, this.collision, this.monsterControl);
            effect.create(pos_vector.x, pos_vector.y);
            effect.sprite.anims.play("ability_spin");

            console.log("doSpin")
            setTimeout(() => {
                effect.destroy();
            }, 700)

            return true;
        }
        return false;
    }

    private is_attack_Spin_end() {
        this.sprite.setVelocity(0, 0);
        if ((utils.tickElapsed(this.lastSpinTick) >= 1200)) {
            return true;
        }
        return false;
    }

    addMonsterControl(aMonsterControl: monsterControl) {
        this.monsterControl = aMonsterControl;
    }

}
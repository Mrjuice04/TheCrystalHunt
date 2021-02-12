import { Scene } from "phaser";
import { animationFrameScheduler } from "rxjs";
import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { utils } from 'src/app/modules/utils';
import { character_sword_dash } from 'src/app/modules/characters/character_holyknight/character_holyknight_dash'
import { character_sword_spin } from 'src/app/modules/characters/character_holyknight/character_holyknight_spin'
import { character_sword_slash } from 'src/app/modules/characters/character_holyknight/character_holyknight_slash'
import { monsterControl } from "../../monsters/monster_control";
import { game_interface } from 'src/app/modules/interface';


export class character_swordsman {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    collision: collision;
    inAnims: boolean = false;
    monsterControl!: monsterControl;
    healthPoint: number = 100;
    energyPoint: number = 50;
    canAttack: boolean = true;
    canMove: boolean = true;
    private state_value: string = "idle";
    private attackCounter: integer = 0;
    gameScene: Phaser.Scene;
    interface: game_interface;
    private attack!: character_sword_dash;
    shield!: character_sword_spin;


    //tick
    private lastDashTick!: number;
    private lastSpinTick: number = 0;
    private init_height!: number;
    private lastStunTick!: number;
    private lastJumpTick!: number;
    private lastSlashTick!: number;
    private stunnedTime!: number;

    //keys
    keyW!: Phaser.Input.Keyboard.Key;
    keyA!: Phaser.Input.Keyboard.Key;
    keyS!: Phaser.Input.Keyboard.Key;
    keyD!: Phaser.Input.Keyboard.Key;
    keyQ!: Phaser.Input.Keyboard.Key;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    //character 

    constructor(aScene: Phaser.Scene, aCollision: collision, aInterface: game_interface) {
        aScene.load.spritesheet("character_swordman", "./assets/character_swordsman_test.png", { frameWidth: 15, frameHeight: 18 });
        aScene.load.spritesheet("ability_dash", "./assets/sword_effect.png", { frameWidth: 24, frameHeight: 11 });
        aScene.load.spritesheet("ability_spin", "./assets/effect.png", { frameWidth: 72, frameHeight: 72 });
        aScene.load.spritesheet("ability_slash", "./assets/sword_effect_2.png", { frameWidth: 31, frameHeight: 24 });
        aScene.load.image("ability_shield", "./assets/circle.png");
        aScene.load.audio('ability_dash', './assets/audio/107589__qat__unsheath-sword.wav');
        aScene.load.audio('ability_shield', './assets/audio/249819__spookymodem__magic-smite.wav');
        aScene.load.audio('ability_slash', './assets/audio/446014__slavicmagic__wpn-3-generic.wav');


        this.collision = aCollision;
        this.gameScene = aScene;
        this.interface = aInterface;

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

    private sprite_machine() {
        switch (this.state_value) {
            case "idle": {
                if (this.check_walking()) {
                    this.state_value = "walking";
                } else if (this.check_jump()) {
                    this.doJump();
                    this.state_value = "jumping";
                } else if (this.check_attack_Slash()) {
                    this.do_attack_Slash();
                    this.state_value = "attacking_slash";
                } else if (this.check_attack_Dash()) {
                    this.do_attack_Dash_1();
                    this.state_value = "attacking_dash";
                } else if (this.check_attack_Shield()) {
                    this.do_attack_Shield();
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
                } else if (this.check_attack_Slash()) {
                    this.do_attack_Slash();
                    this.state_value = "attacking_slash";
                } else if (this.check_attack_Dash()) {
                    this.do_attack_Dash_1();
                    this.state_value = "attacking_dash";
                } else if (this.check_attack_Shield()) {
                    this.do_attack_Shield();
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
                } else if (this.check_attack_Shield()) {
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
            case "attacking_spin": {
                this.do_walking();
                if (this.is_attack_Spin_end()) {
                    this.state_value = "idle"
                }
                break;
            }
            case "attacking_spin_2": {
                this.do_walking();
                if (this.is_attack_Spin_end()) {
                    this.state_value = "idle"
                }
                break;
            }
            case "attacking_slash": {
                if (this.check_attack_Slash_end()) {
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

    private slash_machine(){
        
    }

    private shield_machine(){

    }

    private charge_machine(){
        
    }

    public update() {
        this.sprite_machine();
        if (this.lastSpinTick != 0 && (utils.tickElapsed(this.lastSpinTick) >= 310)) {
            this.shield.sprite.setPosition(this.sprite.getCenter().x, this.sprite.getCenter().y);
        }
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
            frames: aScene.anims.generateFrameNumbers("character_swordman", { start: 21, end: 25 }),
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

        aScene.anims.create({
            key: "ability_slash",
            frames: aScene.anims.generateFrameNumbers("ability_slash", { start: 0, end: 5 }),
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
        this.interface.changeHealthBar(this.healthPoint);
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

    private check_attack_Slash() {
        if (this.sprite.body.touching.down && ((this.lastSlashTick == undefined) || (utils.tickElapsed(this.lastSlashTick) >= 600)) && this.keyA.isDown) {
            return true;
        }
        return false;
    }

    private do_attack_Slash() {
        this.lastSlashTick = utils.getTick();

        this.sprite.anims.play("attack", true)
        this.attack = new character_sword_slash(this.gameScene, this.collision, this.monsterControl);
        let pos = this.sprite.getCenter();
        if (!this.sprite.flipX) {
            pos.x += 10;
            this.sprite.setVelocityX(20);
        } else {
            pos.x -= 10;
            this.sprite.setVelocityX(-20);
        }
        this.attack.create(pos.x, pos.y);
        if (this.attackCounter == 1) {
            this.attack.sprite.flipX = true;
            this.attackCounter = 0;
        } else {
            this.attackCounter++;
        }
        this.attack.playAnims();

        setTimeout(() => {
            this.attack.destroy();
        }, 300)
    }

    private check_attack_Slash_end(): boolean {
        if (utils.tickElapsed(this.lastSlashTick) >= 300) {
            this.attack.destroy();
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
        this.sprite.setVelocityX(0);

        setTimeout(() => {
            if (this.sprite.flipX == false) {
                this.sprite.setVelocityX(200);
            } else if (this.sprite.flipX == true) {
                this.sprite.setVelocityX(-200);
            }
            this.sprite.anims.play("attack", true);
            this.attack = new character_sword_dash(this.gameScene, this.collision, this.monsterControl);
            if (!this.sprite.flipX) {
                this.attack.create(this.sprite.getRightCenter().x + 10, this.sprite.getRightCenter().y + 3);
                this.attack.playAnims();
            } else {
                this.attack.create(this.sprite.getLeftCenter().x - 10, this.sprite.getRightCenter().y + 3);
                this.attack.sprite.flipX = true;
                this.attack.playAnims();
            }
            setTimeout(() => {
                this.attack.destroy();
            }, 1000)
        }, 400)
    }

    private do_attack_Dash_2() {
        if ((utils.tickElapsed(this.lastDashTick) >= 410)) {
            if (this.sprite.flipX == false) {
                this.sprite.setVelocityX(200);
            } else if (this.sprite.flipX == true) {
                this.sprite.setVelocityX(-200);
            }
            if (!this.sprite.flipX) {
                this.attack.sprite.setPosition(this.sprite.getCenter().x + 10, this.sprite.getCenter().y + 3)
            } else {
                this.attack.sprite.setPosition(this.sprite.getCenter().x - 10, this.sprite.getCenter().y + 3)
            }
        }
        if ((utils.tickElapsed(this.lastDashTick) >= 1400)) {
            this.sprite.setVelocityX(0);
        }
        if ((utils.tickElapsed(this.lastDashTick) >= 1500)) {
            return true;
        }
        return false;
    }

    private check_attack_Shield() {
        if ((this.lastSpinTick == 0) && this.keyW.isDown) {
            return true;
        }
        return false;
    }

    private do_attack_Shield() {
        this.lastSpinTick = utils.getTick();
        console.log("doAttackSpin")
        this.sprite.setVelocity(0, 0);
        setTimeout(() => {
            let pos_vector = this.sprite.getCenter();
            let effect = new character_sword_spin(this.gameScene, this.collision, this.monsterControl);
            effect.create(pos_vector.x, pos_vector.y);
            this.shield = effect;
            setTimeout(() => {
                effect.destroy();
                this.lastSpinTick = 0;
            }, 3000)
        }, 300)
    }

    private is_attack_Spin_end() {
        if ((utils.tickElapsed(this.lastSpinTick) >= 310)) {
            this.shield.sprite.setPosition(this.sprite.getCenter().x, this.sprite.getCenter().y);
        }
        if ((utils.tickElapsed(this.lastSpinTick) >= 3300)) {
            return true;
        }
        return false;
    }

    addMonsterControl(aMonsterControl: monsterControl) {
        this.monsterControl = aMonsterControl;
    }

}
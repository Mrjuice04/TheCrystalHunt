import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { collision } from 'src/app/modules/collision';
import { monster_zombie_bite } from 'src/app/modules/monsters/monster_zombie/monster_zombie_bite';
import { utils } from 'src/app/modules/utils';

export class monster_zombie {
    name: string = "zombie";
    collision: collision;
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameScene: Phaser.Scene;
    monsterToPlayerX!: number;
    monsterToPlayerY!: number;
    healthPoint: number = 100;
    canSpawnMonster: boolean = false;
    gridArray: integer[][];
    state_value: string = "walking";
    jump_target!: number;
    maxVelocityX: number = Math.round(Phaser.Math.Between(90, 125));

    // ticks
    private lastAttackTick!: number;
    private lastJumpTick!: number;
    private lastDashTick!: number;
    private lastStunTick!: number;
    private lastSearchTick!: number
    private stunnedTime!: number;



    constructor(aScene: Phaser.Scene, aCollision: collision, aGridArray: integer[][]) {
        this.collision = aCollision;
        this.gameScene = aScene;
        this.gridArray = aGridArray;
    }

    static loadSprite(aScene: Phaser.Scene) {
        aScene.load.spritesheet("monster1", "./assets/monster_zombie.png", { frameWidth: 13, frameHeight: 16 });
        aScene.load.spritesheet("bite", "./assets/monster_zombie_bite.png", { frameWidth: 11, frameHeight: 11 });
    }

    //General Public Function
    public create(aScene: Phaser.Scene, pos_x: number, pos_y: number) {
        this.sprite = aScene.physics.add.sprite(pos_x, pos_y, "monster1").setScale(1.4, 1.4);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setVelocityX(-100);
        this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
        this.sprite.anims.play("monster.move");
        this.collision.addMonster(this);
    }

    public update() {
        this.machine();
    }

    public getPostision(aPlayerPosition: Phaser.Math.Vector2) {
        let monsterposition = this.sprite.getCenter();
        this.monsterToPlayerX = monsterposition.x - aPlayerPosition.x
        this.monsterToPlayerY = monsterposition.y - aPlayerPosition.y
    }

    public isDamaged(aDamage: number) {
        this.healthPoint -= aDamage;
    }

    public isStunned(aTime: number) {
        this.sprite.setAccelerationX(0);
        this.sprite.setVelocityX(0);
        this.lastStunTick = utils.getTick();
        this.stunnedTime = aTime;
        this.state_value = "stunned";
    }

    public isKnockbacked(aVelocityX: number, aVelocityY: number, aTime: number, aStun: boolean, aStunTime: number) {
        this.sprite.setAccelerationX(0);
        this.sprite.setMaxVelocity(200, 10000);
        this.sprite.setVelocity(aVelocityX, aVelocityY);
        this.lastStunTick = utils.getTick();
        this.stunnedTime = aTime;
        this.state_value = "stunned";
        if (aStun) {
            this.isStunned(aStunTime);
        }
    }

    public createAnims(aScene: Phaser.Scene) {
        aScene.anims.create({
            key: "monster.move",
            frames: aScene.anims.generateFrameNumbers("monster1", { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1,
        });

        aScene.anims.create({
            key: "monster.idle",
            frames: aScene.anims.generateFrameNumbers("monster1", { start: 7, end: 10 }),
            frameRate: 10,
            repeat: -1,
        });

        aScene.anims.create({
            key: "bite",
            frames: aScene.anims.generateFrameNumbers("bite", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        })
    }




    //Character Functions
    private machine() {
        switch (this.state_value) {
            case "idle": {

                break;
            }
            case "walking": {
                if (this.checkJump()) {
                    this.doJump();
                    this.state_value = "jumping";
                } else if (this.checkAttack()) {
                    this.doAttack();
                    this.state_value = "attack_jump";
                } else if (this.checkDash()) {
                    this.state_value = "dashing";
                } else {
                    this.walking();
                }
                break;
            }
            case "jumping": {
                if (this.checkJumpHeight()) {
                    this.moveAfterJump();
                }
                if (this.isJumpEnd()) {
                    this.moveAfterJump();
                    this.state_value = "walking";
                }
                break;
            }
            case "attack_jump": {
                if (this.attack_jump()) {
                    this.state_value = "attack_bite";
                }
                break;
            }
            case "attack_bite": {
                if (this.attack_bite()) {
                    this.state_value = "walking";
                }
                break;
            }
            case "dashing": {
                if (this.doDash()) {
                    setTimeout(() => {
                        if (this.sprite != undefined) {
                            this.state_value = "walking";
                            this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
                        }
                    }, 200)
                }
                break;
            }
            case "stunned": {
                if (this.isStunEnd()) {
                    this.state_value = "walking";
                }
                break;
            }
            default: {
                this.state_value = "walking";
                break;
            }
        }
    }


    private walking() {
        if (this.monsterToPlayerY <= 10 && this.monsterToPlayerY >= -10) {
            if (this.sprite.flipX) {
                if (this.monsterToPlayerX <= 0) {
                    this.sprite.flipX = false;
                    this.sprite.setAccelerationX(100);
                } else {
                    this.sprite.setAccelerationX(-100);
                }
            } else {
                if (this.monsterToPlayerX >= 0) {
                    this.sprite.flipX = true;
                    this.sprite.setAccelerationX(-100);
                } else {
                    this.sprite.setAccelerationX(100);
                }
            }
        } else {
            if (((this.lastSearchTick == undefined) || (utils.tickElapsed(this.lastSearchTick) >= 5000))) {
                this.findPlayer();
                this.lastSearchTick = utils.getTick();
            }
            if (!this.sprite.flipX) {
                this.sprite.setAccelerationX(100);
            } else {
                this.sprite.setAccelerationX(-100);
            }
            if (this.sprite.getCenter().x <= 40) {
                this.sprite.setAccelerationX(100);
                this.sprite.flipX = false;
            }
            else if (this.sprite.getCenter().x >= 760) {
                this.sprite.setAccelerationX(-100);
                this.sprite.flipX = true;
            }
        }
    }

    private checkJump(): boolean {
        if (((this.lastJumpTick == undefined) || (utils.tickElapsed(this.lastJumpTick) >= 800))) {
            if (this.sprite.body.touching.down && this.monsterToPlayerY >= 50) {
                let curr_col;
                if (!this.sprite.flipX) {
                    curr_col = Math.round((this.sprite.getCenter().x - 25) / 25);
                } else {
                    curr_col = Math.round((this.sprite.getCenter().x) / 25);
                }
                let curr_row = Math.round(this.sprite.getCenter().y / 25);
                let above_value = this.gridArray[curr_row - 3][curr_col];
                let next_above_value_1;
                if (!this.sprite.flipX) {
                    next_above_value_1 = this.gridArray[curr_row - 3][curr_col + 1]
                } else {
                    next_above_value_1 = this.gridArray[curr_row - 3][curr_col - 1]
                }
                let next_above_value_2;
                if (!this.sprite.flipX) {
                    next_above_value_2 = this.gridArray[curr_row - 3][curr_col + 2]
                } else {
                    next_above_value_2 = this.gridArray[curr_row - 3][curr_col - 2]
                }

                if (above_value == 0 && (next_above_value_1 == 1 || next_above_value_2 == 1)) {
                    this.jump_target = (curr_row - 3) * 25 - 12.5;
                    this.lastJumpTick = utils.getTick();
                    return true;
                }
            }
        }
        return false;
    }

    private doJump() {
        this.sprite.setAccelerationX(0);
        this.sprite.setVelocityX(0);
        this.sprite.setVelocityY(-250);
    }

    private checkJumpHeight(): boolean {
        let curr_height = this.sprite.getBottomCenter().y
        if (curr_height <= this.jump_target) {
            return true;
        }
        return false;
    }

    private isJumpEnd(): boolean {
        if (this.sprite.body.touching.down) {
            let curr_height = this.sprite.getBottomCenter().y
            if (curr_height + 25 <= this.jump_target) {
                this.findPlayer();
            }
            return true;
        }
        return false;
    }

    private moveAfterJump() {
        if (!this.sprite.flipX) {
            this.sprite.setAccelerationX(100);
            this.sprite.setVelocityX(100);
        } else {
            this.sprite.setAccelerationX(-100);
            this.sprite.setVelocityX(-100);
        }
    }

    private checkDash() {
        if (((this.lastDashTick == undefined) || (utils.tickElapsed(this.lastDashTick) >= 900))) {
            if (this.sprite.body.touching.down && this.monsterToPlayerY >= 0) {
                let curr_col;
                if (!this.sprite.flipX) {
                    curr_col = Math.round((this.sprite.getCenter().x - 25) / 25);
                } else {
                    curr_col = Math.round((this.sprite.getCenter().x) / 25);
                }
                let curr_row = Math.round(this.sprite.getCenter().y / 25);
                let next_col_value;
                if (!this.sprite.flipX) {
                    next_col_value = this.gridArray[curr_row][curr_col + 1];
                } else {
                    next_col_value = this.gridArray[curr_row][curr_col - 1];
                }

                if (next_col_value == 0) {
                    this.lastDashTick = utils.getTick();
                    return true;
                }
            }
        }
        return false;
    }

    private doDash() {
        if (utils.tickElapsed(this.lastDashTick) >= 100) {
            if (this.sprite.flipX == false) {
                this.sprite.setMaxVelocity(200, 10000);
                this.sprite.setVelocity(120, -60);
            } else if (this.sprite.flipX == true) {
                this.sprite.setMaxVelocity(200, 10000);
                this.sprite.setVelocity(-120, -60);
            }

            return true;
        }
        return false;
    }


    private checkAttack(): boolean {
        if (this.monsterToPlayerY <= 10 && this.monsterToPlayerY >= -10) {
            if ((this.sprite.flipX && this.monsterToPlayerX >= 0 && this.monsterToPlayerX <= 70) || (!this.sprite.flipX && this.monsterToPlayerX <= 0 && this.monsterToPlayerX >= -70)) {
                if (this.sprite.body.touching.down) {
                    if (((this.lastAttackTick == undefined) || (utils.tickElapsed(this.lastAttackTick) >= 2500))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private doAttack() {
        this.lastAttackTick = utils.getTick();
        this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.1);
    }

    private attack_jump(): boolean {
        if (utils.tickElapsed(this.lastAttackTick) >= 200) {
            if (!this.sprite.flipX) {
                this.sprite.setMaxVelocity(200, 10000);
                this.sprite.setVelocity(200, -50);
            } else {
                this.sprite.setMaxVelocity(200, 10000);
                this.sprite.setVelocity(-200, -50);
            }
            return true;
        }
        return false;
    }

    private attack_bite() {
        if (utils.tickElapsed(this.lastAttackTick) >= 600) {
            let attack = new monster_zombie_bite(this.gameScene, this.collision);
            if (this.sprite.flipX == false) {
                attack.create(this.sprite.getRightCenter().x + 5, this.sprite.getRightCenter().y + 5);
                attack.playAnims();
            } else if (this.sprite.flipX == true) {
                attack.create(this.sprite.getLeftCenter().x - 5, this.sprite.getRightCenter().y + 5);
                attack.sprite.flipX = true;
                attack.playAnims();
            }
            setTimeout(() => {
                attack.destroy();
            }, 400)
            this.sprite.setVelocityX(0);
            this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
            return true;
        }
        return false;
    }

    private isStunEnd() {
        if (utils.tickElapsed(this.lastStunTick) >= this.stunnedTime) {
            this.sprite.setMaxVelocity(this.maxVelocityX, 10000);
            this.sprite.setVelocityX(1);
            return true;
        }
        return false;
    }



    private findPlayer() {
        if (this.sprite.flipX == true) {
            if (this.monsterToPlayerX <= 0) {
                this.sprite.flipX = false;
            }
        } else if (this.sprite.flipX == false) {
            if (this.monsterToPlayerX >= 0) {
                this.sprite.flipX = true;
            }
        }
    }



}

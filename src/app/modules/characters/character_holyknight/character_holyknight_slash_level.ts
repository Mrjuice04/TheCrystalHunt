export interface slashLevelParam {
    damage: number;
    cooldown: number;
    empowerRate: number;
}


export class slashLevelData {
    private map = new Map();

    slashParamArray: Array<slashLevelParam> = [
        { damage: 18, cooldown: 600, empowerRate: 0 },
        { damage: 20, cooldown: 600, empowerRate: 0 },
        { damage: 23, cooldown: 600, empowerRate: 5 }, //added empower hit
        { damage: 25, cooldown: 600, empowerRate: 5 },
        { damage: 26, cooldown: 500, empowerRate: 5 },
        { damage: 27, cooldown: 500, empowerRate: 5 }, // added empower stun
        { damage: 30, cooldown: 500, empowerRate: 5 },
        { damage: 31, cooldown: 500, empowerRate: 5 },
        { damage: 32, cooldown: 500, empowerRate: 3 }, // increase rate of empower
    ]

    constructor() {

    }

    getParam(level: integer): slashLevelParam {
        if (level < 1) {
            return this.slashParamArray[0];
        }
        else if (level <= this.slashParamArray.length) {
            return this.slashParamArray[level - 1];
        }
        else {
            return this.slashParamArray[this.slashParamArray.length - 1];
        }
    }

    getArray(key: String): slashLevelParam {
        let retarray = JSON.parse(JSON.stringify(this.map.get(key)));
        return retarray;
    }
}


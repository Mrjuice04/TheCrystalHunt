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
        { damage: 25, cooldown: 500, empowerRate: 5 },
        { damage: 28, cooldown: 500, empowerRate: 5 }, // added empower stun
        { damage: 32, cooldown: 500, empowerRate: 5 },
        { damage: 35, cooldown: 500, empowerRate: 5 },
        { damage: 37, cooldown: 500, empowerRate: 3 }, // increase rate of empower
        { damage: 40, cooldown: 400, empowerRate: 3 },
        { damage: 44, cooldown: 400, empowerRate: 3 },
        { damage: 48, cooldown: 400, empowerRate: 3 }, // special empower
        { damage: 52, cooldown: 400, empowerRate: 3 },
        { damage: 56, cooldown: 400, empowerRate: 3 },
        { damage: 60, cooldown: 500, empowerRate: 2 }, //
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


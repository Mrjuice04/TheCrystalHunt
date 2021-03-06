export interface shieldLevelParam {
    damage: number;
    stunDuration: number;
    shieldDuration: number;
}


export class shieldLevelData {
    private map = new Map();

    shieldParamArray: Array<shieldLevelParam> = [
        { damage: 30, stunDuration: 2500, shieldDuration: 2000 },
        { damage: 35, stunDuration: 2500, shieldDuration: 2000 },
        { damage: 40, stunDuration: 3000, shieldDuration: 2500 }, // added explosion
        { damage: 45, stunDuration: 3000, shieldDuration: 2500 },
        { damage: 50, stunDuration: 3000, shieldDuration: 2500 },
        { damage: 55, stunDuration: 3500, shieldDuration: 3000 }, // allow attack
        { damage: 60, stunDuration: 3500, shieldDuration: 3000 },
        { damage: 65, stunDuration: 3500, shieldDuration: 3000 },
        { damage: 70, stunDuration: 4000, shieldDuration: 4000 }  // explosion stun all
    ]

    constructor() {

    }

    getParam(level: integer): shieldLevelParam {
        if (level < 1) {
            return this.shieldParamArray[0];
        }
        else if (level <= this.shieldParamArray.length) {
            return this.shieldParamArray[level - 1];
        }
        else {
            return this.shieldParamArray[this.shieldParamArray.length - 1];
        }
    }

    getArray(key: String): shieldLevelParam {
        let retarray = JSON.parse(JSON.stringify(this.map.get(key)));
        return retarray;
    }
}


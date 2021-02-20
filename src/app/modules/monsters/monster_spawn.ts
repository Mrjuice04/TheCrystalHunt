
export interface monsterParam {
    name: String;
    appearRate: number;
    count: number;
}


export class monster_data {
    private map = new Map();

    constructor() {
        let round1_array: Array<monsterParam> = [
            { name: 'zombie', appearRate: 1, count: 10 },
        ];
        this.map.set("round1", round1_array);

        let round2_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.3, count: 2},
            { name: 'zombie', appearRate: 1, count: 10 },
        ];
        this.map.set("round2", round2_array);

    }

    getArray(key: String): Array<monsterParam> {
        let retarray = JSON.parse(JSON.stringify(this.map.get(key)));
        return retarray;
    }
}

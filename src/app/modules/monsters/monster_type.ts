import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { monster_crystal } from 'src/app/modules/monsters/monster_crystal/monster_crystal';
import { monster_skeleton } from 'src/app/modules/monsters/monster_skeleton/monster_skeleton';


export type monsterType = monster_zombie | monster_crystal | monster_skeleton;

export function isCrystal(target: monsterType): target is monster_crystal {
    if (target == undefined){
        return false;
    }
    return (target as monster_crystal).checkSpawn !== undefined;
}
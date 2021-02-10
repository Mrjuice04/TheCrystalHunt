import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { monster_crystal } from 'src/app/modules/monsters/monster_crystal/monster_crystal';

export type monsterType = monster_zombie | monster_crystal;

export function isCrystal(target: monsterType): target is monster_crystal {
    return (target as monster_crystal).checkSpawn !== undefined;
}
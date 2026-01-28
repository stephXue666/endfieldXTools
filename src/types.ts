export interface Category { name: string; stats: string[]; }
export interface Weapon { name: string; rarity: number; type: string; targets: string[]; }
export interface Dungeon { name: string; attrs: string[]; skills: string[]; }
export interface Config {
    APP_VERSION: string;
    LAST_UPDATE: string;
    DATABASE: { base: Category; attrs: Category; skills: Category; };
    WEAPONS: Weapon[];
    DUNGEONS: Dungeon[];
}
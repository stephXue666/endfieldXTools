import type { Config, Weapon } from '../types';
import { useMemo, useState, useEffect } from 'react';

interface Props {
    config: Config;
    farmingList: string[];
}

interface WeaponWithAdvice {
    weapon: Weapon;
    matchedStats: string[];
    ticketAdvice: { base: string[], advanced: string[] };
}

interface FarmingScheme {
    id: string;
    lockBase: string[];
    lockAdvanced: string[]; 
    weapons: WeaponWithAdvice[];
    score: number; 
}

interface DungeonCardProps {
    dungeon: {
        name: string;
        attrs: string[];
        skills: string[];
        weapons: WeaponWithAdvice[];
        schemes: FarmingScheme[];
    };
    defaultExpanded: boolean;
}

function DungeonCard({ dungeon, defaultExpanded }: DungeonCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const d = dungeon;

    useEffect(() => {
        setIsExpanded(defaultExpanded);
    }, [defaultExpanded]);

    return (
        <div className="group bg-[#111418] border border-gray-800 rounded-2xl relative overflow-hidden transition-all hover:border-[#ffca28]/40 hover:shadow-[0_0_30px_rgba(255,202,40,0.05)] h-fit">
            <div className="absolute -right-4 -top-4 text-8xl font-black text-white/[0.03] italic pointer-events-none group-hover:text-[#ffca28]/5 transition-all">
                {d.weapons.length}
            </div>

            <div className="relative z-10">
                <header 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-6 cursor-pointer select-none flex items-start justify-between group/header"
                >
                    <div>
                        <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase block mb-1">Target_Sector</span>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{d.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {!isExpanded && (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-gray-500 font-mono">TOTAL_MATCH</span>
                                <span className="text-xl font-black text-[#ffca28]">{d.weapons.length}</span>
                            </div>
                        )}
                        
                        <div className={`w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center transition-all ${isExpanded ? 'rotate-180 bg-gray-800 text-white' : 'group-hover/header:bg-[#ffca28] group-hover/header:text-black group-hover/header:border-[#ffca28]'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </header>

                {isExpanded && (
                    <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-4"></div>

                        {d.schemes.map(scheme => (
                            <div key={scheme.id} className="relative bg-black/20 rounded-xl border border-gray-800/50 overflow-hidden">
                                <div className="bg-black/40 p-3 border-b border-gray-800/50 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                                            Protocol: {scheme.lockAdvanced.join(' / ')}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-600 bg-gray-800 px-1.5 rounded">{scheme.weapons.length} Weapons</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="flex gap-1">
                                            {scheme.lockBase.map(base => (
                                                <span key={base} className="px-1.5 py-0.5 bg-[#ffca28] text-black text-[10px] font-black rounded">
                                                    {base}
                                                </span>
                                            ))}
                                            {[...Array(3 - scheme.lockBase.length)].map((_, i) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-gray-800 text-gray-500 text-[10px] font-bold rounded border border-dashed border-gray-600">
                                                    任意
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-gray-600 text-[10px]">+</span>
                                        <div className="flex flex-wrap gap-1">
                                            {scheme.lockAdvanced.map(adv => (
                                                <span key={adv} className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                                                    {adv}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2 flex flex-col gap-1">
                                    {scheme.weapons.map(({ weapon: w }) => (
                                        <div key={w.name} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/5 transition-colors relative group/weapon">
                                            <div className="flex items-center gap-2">
                                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                                <span className="text-xs font-bold text-gray-400">{w.name}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-[#ffca28] opacity-60 group-hover/weapon:opacity-0 transition-opacity">{w.rarity}★</span>
                                            
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/weapon:opacity-100 transition-opacity pointer-events-none">
                                                {w.targets.map(t => (
                                                    <span key={t} className="text-[9px] bg-black/80 px-1 rounded text-gray-300 border border-gray-700">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// 简单的 Hook 用于获取列数
function useColumns() {
    const [columns, setColumns] = useState(1);

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth >= 1280) setColumns(3); // xl
            else if (window.innerWidth >= 768) setColumns(2); // md
            else setColumns(1);
        };
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    return columns;
}

export default function FarmingAdvisor({ config, farmingList }: Props) {
    const recommendations = useMemo(() => {
        if (!config || farmingList.length === 0) return [];

        const trackedWeapons = config.WEAPONS.filter(w => farmingList.includes(w.name));

        return config.DUNGEONS.map(dungeon => {
            const matchedWeapons = trackedWeapons.map(weapon => {
                const matchedStats = weapon.targets.filter(t => 
                    dungeon.attrs.includes(t) || dungeon.skills.includes(t)
                );

                const targetAttr = weapon.targets.find(t => config.DATABASE.attrs.stats.includes(t));
                const targetSkill = weapon.targets.find(t => config.DATABASE.skills.stats.includes(t));

                const matchAttr = targetAttr ? dungeon.attrs.includes(targetAttr) : true;
                const matchSkill = targetSkill ? dungeon.skills.includes(targetSkill) : true;
                
                if (matchAttr && matchSkill) {
                    const recommendedBase = weapon.targets.filter(t => 
                        config.DATABASE.base.stats.includes(t)
                    );
                    const recommendedAdvanced = weapon.targets.filter(t => 
                        config.DATABASE.attrs.stats.includes(t) || 
                        config.DATABASE.skills.stats.includes(t)
                    );

                    return { 
                        weapon, 
                        matchedStats,
                        ticketAdvice: { base: recommendedBase, advanced: recommendedAdvanced }
                    };
                }
                return null;
            }).filter((item): item is WeaponWithAdvice => item !== null);

            if (matchedWeapons.length === 0) return null;

            const potentialAdvancedStats = new Set<string>();
            matchedWeapons.forEach(w => {
                w.ticketAdvice.advanced.forEach(s => potentialAdvancedStats.add(s));
            });

            const schemesMap = new Map<string, FarmingScheme>();

            potentialAdvancedStats.forEach(advStat => {
                const weaponsInScheme = matchedWeapons.filter(w => 
                    w.ticketAdvice.advanced.includes(advStat)
                );

                if (weaponsInScheme.length === 0) return;

                const weaponKey = weaponsInScheme.map(w => w.weapon.name).sort().join('|');

                if (schemesMap.has(weaponKey)) {
                    const existing = schemesMap.get(weaponKey)!;
                    if (!existing.lockAdvanced.includes(advStat)) {
                        existing.lockAdvanced.push(advStat);
                    }
                } else {
                    const baseStatCounts = new Map<string, number>();
                    weaponsInScheme.forEach(w => {
                        w.ticketAdvice.base.forEach(base => {
                            baseStatCounts.set(base, (baseStatCounts.get(base) || 0) + 1);
                        });
                    });

                    const topBases = Array.from(baseStatCounts.entries())
                        .sort((a, b) => b[1] - a[1])
                        .map(entry => entry[0])
                        .slice(0, 3);
                    
                    schemesMap.set(weaponKey, {
                        id: `${dungeon.name}-${weaponKey}`,
                        lockBase: topBases,
                        lockAdvanced: [advStat],
                        weapons: weaponsInScheme,
                        score: weaponsInScheme.length
                    });
                }
            });

            const schemes = Array.from(schemesMap.values());
            schemes.sort((a, b) => b.score - a.score);

            return { 
                ...dungeon, 
                weapons: matchedWeapons, 
                schemes
            };
        }).filter((d): d is NonNullable<typeof d> => d !== null)
          .sort((a, b) => b.weapons.length - a.weapons.length);
    }, [config, farmingList]);

    const columns = useColumns();

    // 将数据分配到列中
    const columnData = useMemo(() => {
        const cols = Array.from({ length: columns }, () => [] as typeof recommendations);
        recommendations.forEach((item, index) => {
            cols[index % columns].push(item);
        });
        return cols;
    }, [recommendations, columns]);

    if (farmingList.length === 0) {
        return (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-900 rounded-3xl bg-black/10 animate-in fade-in zoom-in-95 duration-700">
                <div className="w-16 h-16 border-4 border-[#ffca28]/20 border-t-[#ffca28] rounded-full animate-spin mb-6"></div>
                <h3 className="text-[#ffca28] text-3xl font-black tracking-tighter mb-2 uppercase">没得刷</h3>
                <p className="text-gray-600 text-[12px] font-mono tracking-[0.4em] uppercase text-center px-10 leading-relaxed">
                    请在左侧列表中勾选需要刷取的武器<br/>系统将自动计算最优物流路径
                </p>
            </div>
        );
    }

    return (
        <div className="flex gap-6 pb-20 items-start">
            {columnData.map((col, colIndex) => (
                <div key={colIndex} className="flex-1 flex flex-col gap-6 min-w-0">
                    {col.map((d, index) => (
                        <DungeonCard 
                            key={d.name} 
                            dungeon={d} 
                            // 只有第一列的第一个元素才默认展开
                            defaultExpanded={colIndex === 0 && index === 0} 
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

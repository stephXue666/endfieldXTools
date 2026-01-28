import type { Config } from '../types';
import { useMemo } from 'react';

interface Props {
    config: Config;
    farmingList: string[];
}

export default function FarmingAdvisor({ config, farmingList }: Props) {
    const recommendations = useMemo(() => {
        if (!config || farmingList.length === 0) return [];

        // 1. 获取清单中所有的武器对象
        const trackedWeapons = config.WEAPONS.filter(w => farmingList.includes(w.name));

        // 2. 遍历地图，计算匹配度
        return config.DUNGEONS.map(dungeon => {
            const matchedWeapons = trackedWeapons.filter(weapon => {
                const targetAttr = weapon.targets.find(t => config.DATABASE.attrs.stats.includes(t));
                const targetSkill = weapon.targets.find(t => config.DATABASE.skills.stats.includes(t));

                // 匹配规则：地图必须能掉落该武器所需的高级词条
                const matchAttr = targetAttr ? dungeon.attrs.includes(targetAttr) : true;
                const matchSkill = targetSkill ? dungeon.skills.includes(targetSkill) : true;
                return matchAttr && matchSkill;
            });

            return { ...dungeon, weapons: matchedWeapons };
        }).filter(d => d.weapons.length > 0) // 只显示有收获的地图
            .sort((a, b) => b.weapons.length - a.weapons.length); // 产出越多的排前面
    }, [config, farmingList]);

    // 空状态提示
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {recommendations.map(d => (
                <div key={d.name} className="group bg-[#111418] border border-gray-800 rounded-2xl p-6 relative overflow-hidden transition-all hover:border-[#ffca28]/40 hover:shadow-[0_0_30px_rgba(255,202,40,0.05)]">
                    {/* 装饰：背景大数字 */}
                    <div className="absolute -right-4 -top-4 text-8xl font-black text-white/[0.03] italic pointer-events-none group-hover:text-[#ffca28]/5 transition-all">
                        {d.weapons.length}
                    </div>

                    <div className="relative z-10">
                        <header className="mb-6">
                            <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase block mb-1">Target_Sector</span>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter border-b border-gray-900 pb-2">{d.name}</h3>
                        </header>

                        <div className="space-y-3">
                            {/*<div className="flex justify-between items-center">*/}
                            {/*    <span className="text-[10px] font-bold text-[#ffca28] opacity-60 uppercase tracking-widest">匹配目标清单:</span>*/}
                            {/*    <span className="text-[10px] font-mono text-gray-600">COUNT: {d.weapons.length}</span>*/}
                            {/*</div>*/}

                            <div className="flex flex-col gap-2">
                                {d.weapons.map(w => (
                                    <div key={w.name} className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-gray-800 group-hover:border-gray-700 transition-all">
                                        <span className="text-m font-black text-gray-300 uppercase tracking-tight">{w.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[12px] font-mono text-gray-700">{w.type}</span>
                                            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                                            <span className="text-[12px] font-black text-[#ffca28]">{w.rarity}★</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
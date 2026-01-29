import type { Weapon, Config } from '../types';
import { useMemo, useState } from 'react';

interface Props {
    config: Config;
    selectedWeapon: Weapon | null;
    onSelect: (w: Weapon) => void;
    // --- 刷取清单相关 Props ---
    farmingList: string[];
    onToggleFarming: (name: string) => void;
    onClearFarming: () => void;
    // --- 移动端适配 ---
    isOpen: boolean;
    onClose: () => void;
}

export default function WeaponInventory({
        config, selectedWeapon, onSelect,
        farmingList, onToggleFarming, onClearFarming,
        isOpen, onClose
    }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRarities, setFilterRarities] = useState<number[]>([]);
    const [filterTypes, setFilterTypes] = useState<string[]>([]);

    const weaponTypes = useMemo(() => Array.from(new Set(config.WEAPONS.map(w => w.type))), [config]);

    const toggleFilter = <T,>(list: T[], setList: (val: T[]) => void, value: T) => {
        setList(list.includes(value) ? list.filter(i => i !== value) : [...list, value]);
    };

    const filtered = useMemo(() => config.WEAPONS.filter(w => {
        const matchSearch = w.name.includes(searchTerm);
        const matchRarity = filterRarities.length === 0 || filterRarities.includes(w.rarity);
        const matchType = filterTypes.length === 0 || filterTypes.includes(w.type);
        return matchSearch && matchRarity && matchType;
    }), [config, searchTerm, filterRarities, filterTypes]);

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm lg:relative lg:inset-auto lg:z-0 lg:col-span-3 lg:w-full lg:max-w-none lg:h-full
            bg-[#111418] border-r border-gray-800 shadow-2xl transition-transform duration-300 ease-in-out
            lg:border-r lg:border-gray-900 lg:rounded-2xl lg:shadow-none
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            p-6 flex flex-col min-h-0
        `}>
            {/* 头部：标题与清空 */}
            <div className="flex-shrink-0 space-y-6 mb-6">
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-white">武器选择</h2>
                        <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest leading-none">Weapon_Archive</p>
                    </div>
                    {farmingList.length > 0 && (
                        <button
                            onClick={onClearFarming}
                            className="text-[12px] font-bold text-red-500 bg-red-900/10 border border-red-900/30 px-3 py-1.5 rounded-lg hover:bg-red-900/30 transition-all active:scale-95"
                        >
                            清空 ({farmingList.length})
                        </button>
                    )}
                </div>

                {/* 搜索 */}
                <input
                    placeholder="搜索武器名称..."
                    className="w-full bg-black/40 border border-gray-800 p-3 rounded-lg text-xs focus:border-[#ffca28] outline-none font-mono"
                    onChange={e => setSearchTerm(e.target.value)}
                />

                {/* 星级多选 */}
                <div className="space-y-2">
                    <span className="text-[14px] font-bold text-gray-700 uppercase tracking-widest block">// 星级</span>
                    <div className="grid grid-cols-5 gap-1.5">
                        <button onClick={() => setFilterRarities([])} className={`py-1.5 rounded border border-gray-800 text-[12px] font-black ${filterRarities.length === 0 ? 'bg-[#ffca28] text-black' : 'text-gray-600'}`}>ALL</button>
                        {[6, 5, 4, 3].map(r => (
                            <button key={r} onClick={() => toggleFilter(filterRarities, setFilterRarities, r)} className={`py-1.5 rounded border border-gray-800 text-[12px] font-bold ${filterRarities.includes(r) ? 'bg-[#ffca28] text-black' : 'text-gray-600'}`}>{r}★</button>
                        ))}
                    </div>
                </div>

                {/* 类型多选 */}
                <div className="space-y-2">
                    <span className="text-[14px] font-bold text-gray-700 uppercase tracking-widest block">// 类型</span>
                    <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => setFilterTypes([])} className={`px-2 py-1.5 rounded border border-gray-800 text-[12px] font-black ${filterTypes.length === 0 ? 'bg-[#ffca28] text-black' : 'text-gray-600'}`}>ALL</button>
                        {weaponTypes.map(t => (
                            <button key={t} onClick={() => toggleFilter(filterTypes, setFilterTypes, t)} className={`px-2 py-1.5 rounded border border-gray-800 text-[12px] font-bold ${filterTypes.includes(t) ? 'bg-[#ffca28] text-black' : 'text-gray-600'}`}>{t}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 武器列表滚动区 */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scroll min-h-0">
                {filtered.map(w => {
                    const isTracked = farmingList.includes(w.name);
                    const isSelected = selectedWeapon?.name === w.name;

                    return (
                        <button
                            key={w.name}
                            onClick={() => {
                                onSelect(w);
                                onToggleFarming(w.name);
                            }}
                            className={`
                                w-full text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden group
                                ${isTracked
                                    ? 'border-[#ffca28] bg-[#ffca28]/10 shadow-[0_0_20px_rgba(255,202,40,0.1)]'
                                    : 'border-transparent bg-black/30 hover:bg-white/5'
                                }
                                ${isSelected && !isTracked ? 'border-gray-600' : ''}
                            `}
                        >
                            {/* 勾选状态指示器 (放在右侧) */}
                            <div className={`
                                absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center z-10
                                ${isTracked
                                    ? 'bg-[#ffca28] border-[#ffca28] scale-110'
                                    : 'border-gray-800 group-hover:border-gray-600 scale-100'
                                }
                            `}>
                                {isTracked && (
                                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>

                            {/* 内容区域 */}
                            <div className="pr-10">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-black text-sm uppercase tracking-tight ${isTracked ? 'text-white' : 'text-gray-500'}`}>
                                        {w.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[12px] font-black ${isTracked ? 'text-[#ffca28]/80' : 'text-gray-700'}`}>
                                        {w.rarity}★
                                    </span>
                                    <span className="text-[12px] font-mono text-gray-700 uppercase">
                                        {w.type}
                                    </span>
                                </div>
                            </div>

                            {/* 背景装饰线 (仅选中时显示) */}
                            {isTracked && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffca28] shadow-[2px_0_10px_rgba(255,202,40,0.5)]"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* 移动端关闭按钮 */}
            <button onClick={onClose} className="lg:hidden mt-4 w-full py-3 bg-gray-900 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg">关闭菜单</button>
        </aside>
    );
}

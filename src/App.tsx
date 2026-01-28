import { useState, useEffect, useMemo } from 'react'

// --- 1. 定义类型接口 (TS 玩家必备) ---
interface Category {
    name: string;
    stats: string[];
}

interface Config {
    APP_VERSION: string;
    DATABASE: Record<string, Category>;
    DUNGEONS: { name: string; drop: string }[];
}

interface Verdict {
    title: string;
    color: string;
    score: number;
    desc: string;
}

export default function App() {
    // --- 2. 定义状态 (State) ---
    const [config, setConfig] = useState<Config | null>(null);
    const [weaponTarget, setWeaponTarget] = useState<Record<string, string | null>>({});
    const [matrixInput, setMatrixInput] = useState<string[]>([]);

    // --- 3. 获取数据 (Effect) ---
    useEffect(() => {
        // Vite 开发环境下，'./data.json' 会去 public 文件夹寻找
        fetch('./data.json')
            .then(res => res.json())
            .then((data: Config) => {
                setConfig(data);
                // 初始化武器目标锁定状态
                const init: Record<string, string | null> = {};
                Object.keys(data.DATABASE).forEach(k => init[k] = null);
                setWeaponTarget(init);
            })
            .catch(err => console.error("Sync Error:", err));
    }, []);

    // --- 4. 判定逻辑 (Memo) ---
    const verdict = useMemo<Verdict | null>(() => {
        if (!config || matrixInput.length < 3) return null;

        // 过滤出已选的武器词条
        const targets = Object.values(weaponTarget).filter((v): v is string => v !== null);
        const matches = matrixInput.filter(s => targets.includes(s)).length;
        const score = Math.round((matches / 3) * 100);

        const levels = [
            { m: 3, t: 'Optimal', c: 'border-yellow-500 text-yellow-500 bg-yellow-500/10', d: '完美契合，建议拉满。' },
            { m: 2, t: 'Great', c: 'border-green-500 text-green-400 bg-green-500/10', d: '高质量，优质过渡。' },
            { m: 1, t: 'Suboptimal', c: 'border-blue-500 text-blue-400 bg-blue-500/10', d: '契合度低，建议喂掉。' },
            { m: 0, t: 'Fodder', c: 'border-red-500 text-red-500 bg-red-500/10', d: '完全不匹配的废料。' }
        ];

        const res = levels.find(l => matches >= l.m)!;
        return { title: res.t, color: res.c, score, desc: res.d };
    }, [matrixInput, weaponTarget, config]);

    // --- 5. 渲染逻辑 (JSX) ---
    if (!config) return <div className="h-screen flex items-center justify-center font-mono text-gray-500">SYNCING_DATA...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-10 text-gray-300">
            <header className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-black italic text-[#ffca28] uppercase tracking-tighter">endfieldXTools</h1>
                    <p className="text-[10px] text-gray-600 font-mono mt-1 tracking-widest uppercase">Protocol: React + TSX</p>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">VER: {config.APP_VERSION}</span>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左侧：武器目标锁定 */}
                <section className="bg-[#16191d] p-5 border-l-4 border-[#ffca28] shadow-2xl">
                    <h3 className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest font-bold">// Weapon Targets</h3>
                    {Object.entries(config.DATABASE).map(([key, cat]) => (
                        <div key={key} className="mb-8 last:mb-0">
                            <label className="text-[9px] text-[#ffca28] font-bold mb-2 block uppercase border-l border-gray-800 pl-2">{cat.name}</label>
                            <div className="flex flex-wrap gap-1.5">
                                {cat.stats.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setWeaponTarget(prev => ({...prev, [key]: s}))}
                                        className={`px-2.5 py-1.5 rounded text-[11px] transition-all border border-gray-800 ${weaponTarget[key] === s ? 'bg-[#ffca28] text-black font-bold' : 'bg-[#1a1e23] hover:border-gray-600'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 右侧：分析判定区 */}
                <section className="lg:col-span-2 bg-[#16191d] p-5 border-l-4 border-blue-500 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">// Analysis Board</h3>
                        <button onClick={() => setMatrixInput([])} className="text-[9px] text-gray-600 hover:text-red-500 border border-gray-800 px-2 py-1 rounded">CLEAR</button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="h-14 sm:h-16 bg-black/40 border-b-2 border-gray-700 flex items-center justify-center text-[#ffca28] font-bold text-sm sm:text-lg">
                                {matrixInput[i] || '---'}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        {Object.values(config.DATABASE).map((cat, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="text-[8px] text-gray-700 font-black mb-2 uppercase tracking-tighter">{cat.name}</div>
                                <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                                    {cat.stats.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => matrixInput.length < 3 && setMatrixInput(prev => [...prev, s])}
                                            className="text-left px-2 py-2 bg-[#1a1e23] hover:bg-[#252a31] rounded text-[10px] text-gray-400 truncate border border-transparent hover:border-gray-700 transition-colors"
                                        >
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {verdict ? (
                        <div className={`p-5 rounded border-r-4 flex items-center justify-between shadow-inner animate-in slide-in-from-bottom-2 duration-300 ${verdict.color}`}>
                            <div>
                                <div className="text-3xl font-black italic uppercase tracking-tighter">{verdict.title}</div>
                                <div className="text-[10px] font-bold mt-1 opacity-70 tracking-widest uppercase">{verdict.desc}</div>
                            </div>
                            <div className="text-4xl font-black font-mono">{verdict.score}%</div>
                        </div>
                    ) : (
                        <div className="h-24 flex items-center justify-center border border-dashed border-gray-800 rounded text-[10px] text-gray-600 uppercase tracking-[0.3em] font-mono">
                            Waiting for input...
                        </div>
                    )}
                </section>
            </div>

            {/* 底部：副本参考 */}
            <footer className="mt-8 p-5 bg-[#111317] rounded border border-gray-800">
                <h3 className="text-[10px] font-bold text-gray-600 uppercase mb-4 tracking-[0.2em]">// Drop Data Reference</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {config.DUNGEONS.map(d => (
                        <div key={d.name} className="p-3 bg-black/20 border border-gray-800 rounded group hover:border-gray-600 transition-colors">
                            <div className="text-[11px] font-bold text-[#ffca28] mb-1 leading-none">{d.name}</div>
                            <div className="text-[9px] text-gray-600 leading-tight mt-1">{d.drop}</div>
                        </div>
                    ))}
                </div>
            </footer>
        </div>
    )
}
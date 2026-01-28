import type { Weapon, Config } from '../types';
import { useMemo } from 'react';

interface Props {
    config: Config;
    selectedWeapon: Weapon | null;
    matrixInput: string[];
    setMatrixInput: (s: string[]) => void;
}

export default function MatrixEvaluator({ config, selectedWeapon, matrixInput, setMatrixInput }: Props) {
    const verdict = useMemo(() => {
        if (!selectedWeapon) return null;
        const limit = selectedWeapon.rarity === 3 ? 2 : 3;
        if (matrixInput.length < limit) return null;
        const matches = matrixInput.filter(s => selectedWeapon.targets.includes(s)).length;
        const score = Math.round((matches / limit) * 100);
        const levels = [
            { min: 100, t: 'PERFECT', c: 'text-yellow-500 border-yellow-500 bg-yellow-500/5' },
            { min: 60, t: 'EXCELLENT', c: 'text-green-400 border-green-500 bg-green-500/5' },
            { min: 0, t: 'REJECT', c: 'text-red-500 border-red-500 bg-red-500/5' }
        ];
        return { ...levels.find(l => score >= l.min)!, score };
    }, [matrixInput, selectedWeapon]);

    const limit = selectedWeapon?.rarity === 3 ? 2 : 3;

    return (
        <section className="bg-[#16191d] p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                    <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2].map(i => (
                            <div key={i} className={`h-32 rounded-2xl flex flex-col items-center justify-center border-b-4 ${i >= limit ? 'bg-black/10 opacity-10' : 'bg-black/40 border-gray-800'}`}>
                                <span className="text-[8px] text-gray-700 mb-2 font-mono">NODE_0{i+1}</span>
                                <div className="text-xl font-black italic text-[#ffca28]">{i >= limit ? 'LOCKED' : (matrixInput[i] || '---')}</div>
                            </div>
                        ))}
                    </div>
                    <div className="grid gap-8">
                        {Object.entries(config.DATABASE).map(([key, cat]) => (
                            <div key={key}>
                                <h4 className="text-[9px] text-gray-700 font-black mb-3 uppercase border-l-2 border-gray-800 pl-3">{cat.name}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {cat.stats.map(s => (
                                        <button key={s} disabled={matrixInput.length >= limit || matrixInput.includes(s)} onClick={() => setMatrixInput([...matrixInput, s])} className="px-4 py-2 bg-[#1f242b] hover:bg-[#ffca28] hover:text-black rounded-lg text-[11px] font-bold text-gray-500 disabled:opacity-5">{s}</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-center lg:pl-12">
                    {verdict ? (
                        <div className={`p-10 rounded-3xl border-r-[24px] shadow-2xl ${verdict.c}`}>
                            <div className="text-9xl font-black italic leading-none">{verdict.score}%</div>
                            <div className="text-4xl font-black italic uppercase mt-4">{verdict.t}</div>
                        </div>
                    ) : (
                        <div className="text-center py-32 border-2 border-dashed border-gray-900 rounded-3xl text-xs uppercase animate-pulse">Waiting_For_Matrix...</div>
                    )}
                </div>
            </div>
        </section>
    );
}
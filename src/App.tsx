import { useState, useEffect } from 'react';
import WeaponInventory from './components/WeaponInventory';
import FarmingAdvisor from './components/FarmingAdvisor';
import MatrixEvaluator from './components/MatrixEvaluator';
import type { Config, Weapon } from './types';

export default function App() {
    const [config, setConfig] = useState<Config | null>(null);
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
    const [matrixInput, setMatrixInput] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'advisor' | 'evaluator'>('advisor');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [farmingList, setFarmingList] = useState<string[]>(() => {
        const saved = localStorage.getItem('ef_farming_list');
        return saved ? JSON.parse(saved) : [];
    });

    // 1. 初始化数据
    useEffect(() => {
        const saved = localStorage.getItem('ef_farming_list');
        if (saved) setFarmingList(JSON.parse(saved));

        // 读取配置
        fetch('./data.json')
            .then((res) => res.json())
            .then((data: Config) => {
                setConfig(data);
                if (data.WEAPONS.length > 0) setSelectedWeapon(data.WEAPONS[0]);
            });
    }, []);

    useEffect(() => {
        localStorage.setItem('ef_farming_list', JSON.stringify(farmingList));
    }, [farmingList]);

    // 2. 武器选择回调（处理移动端自动收起）
    const handleWeaponSelect = (w: Weapon) => {
        setSelectedWeapon(w);
        setMatrixInput([]); // 切换武器清空当前鉴定输入
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    // 3. 切换武器勾选状态
    const toggleFarmingWeapon = (weaponName: string) => {
        setFarmingList(prev =>
            prev.includes(weaponName)
                ? prev.filter(n => n !== weaponName)
                : [...prev, weaponName]
        );
    };
    // 4. 清空清单
    const clearFarmingList = () => {
        if (confirm("确定要清空所有选中的刷取目标吗？")) {
            setFarmingList([]);
        }
    };

    if (!config) {
        return (
            <div className="h-screen bg-[#0c0d10] flex items-center justify-center font-sans text-gray-800 tracking-[0.4em] uppercase">
                初始化中...
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#0c0d10] font-sans flex flex-col overflow-hidden text-gray-400">

            {/* --- I. 顶级导航栏 (Top Bar) --- */}
            <header className="flex-shrink-0 h-16 bg-[#111418] border-b border-gray-800 px-4 lg:px-8 flex items-center justify-between z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    {/* 移动端菜单触发器 */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        // 增加 flex items-center gap-2 让图标和文字对齐并保持间距
                        className="lg:hidden p-2 px-3 bg-[#ffca28] text-black rounded flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        <span className="text-xs font-bold whitespace-nowrap">
                            武器选择
                        </span>
                    </button>

                    {/* Logo & 系统标识 */}
                    <div className="flex items-center gap-3">
                        {/*<div className="w-8 h-8 bg-[#ffca28] rounded flex items-center justify-center font-black text-black italic text-xl shadow-[0_0_15px_rgba(255,202,40,0.3)]">*/}
                        {/*    X*/}
                        {/*</div>*/}
                        <div className="flex flex-col">
                            <h1 className="text-white font-black text-lg leading-none">EndfieldXTools</h1>
                            <span className="text-[12px] text-gray-600 font-mono uppercase">基质小工具</span>
                        </div>
                    </div>
                </div>

                {/* 右侧：元数据 */}
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col text-right">
                        <span className="text-[12px] text-gray-600 font-mono tracking-widest">By</span>
                        <span className="text-xs font-bold text-gray-400">StephenXue</span>
                    </div>
                    <div className="h-8 w-px bg-gray-800 hidden md:block"></div>
                    <div className="flex flex-col text-right">
                        <span className="text-[9px] text-[#ffca28] font-mono uppercase tracking-widest">当前版本</span>
                        <span className="text-xs font-black text-white font-mono">{config.APP_VERSION}</span>
                    </div>
                </div>
            </header>

            {/* --- II. 全屏应用布局 --- */}
            <div className="flex-1 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 lg:p-8 min-h-0">

                {/* 左侧：仓库组件 (独立滚动) */}
                <WeaponInventory
                    config={config}
                    selectedWeapon={selectedWeapon}
                    onSelect={handleWeaponSelect}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    farmingList={farmingList}
                    onToggleFarming={toggleFarmingWeapon}
                    onClearFarming={clearFarmingList}
                />

                {/* 右侧：功能主区 (独立滚动) */}
                <main className="lg:col-span-9 flex flex-col h-full min-h-0">

                    {/* 页签控制器 */}
                    <div className="flex-shrink-0 flex items-stretch gap-1 mb-6 bg-[#111418] p-1 rounded-xl border border-gray-900 w-fit">
                        <button
                            onClick={() => setActiveTab('advisor')}
                            className={`px-8 py-3 rounded-lg text-sm font-black transition-all flex items-center gap-3 ${
                                activeTab === 'advisor'
                                    ? 'bg-[#ffca28] text-black shadow-[0_0_20px_rgba(255,202,40,0.2)]'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'advisor' ? 'bg-black animate-pulse' : 'bg-gray-800'}`}></div>
                            <span className="tracking-wider">刷取淤积点</span>
                        </button>

                        {/*<button*/}
                        {/*    onClick={() => setActiveTab('evaluator')}*/}
                        {/*    className={`px-8 py-3 rounded-lg text-sm font-black transition-all flex items-center gap-3 ${*/}
                        {/*        activeTab === 'evaluator'*/}
                        {/*            ? 'bg-[#ffca28] text-black shadow-[0_0_20px_rgba(255,202,40,0.2)]'*/}
                        {/*            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'*/}
                        {/*    }`}*/}
                        {/*>*/}
                        {/*    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'evaluator' ? 'bg-black animate-pulse' : 'bg-gray-800'}`}></div>*/}
                        {/*    <span className="tracking-wider">基质筛选</span>*/}
                        {/*</button>*/}
                    </div>

                    {/* 动态滚动内容区 */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scroll min-h-0 pb-10">
                        <div key={activeTab} className="animate-in fade-in slide-in-from-right-4 duration-500">
                            {activeTab === 'advisor' ? (
                                <FarmingAdvisor
                                    config={config}
                                    farmingList={farmingList}
                                />
                            ) : (
                                <MatrixEvaluator
                                    config={config}
                                    selectedWeapon={selectedWeapon}
                                    matrixInput={matrixInput}
                                    setMatrixInput={setMatrixInput}
                                />
                            )}
                        </div>
                    </div>

                </main>
            </div>

            {/* 移动端菜单背景遮罩 */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
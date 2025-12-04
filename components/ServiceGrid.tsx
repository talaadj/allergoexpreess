import React from 'react';

interface ServiceItem {
    id: string;
    title: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
}

interface ServiceGridProps {
    items: ServiceItem[];
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ items }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl mx-auto px-4">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={item.onClick}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-4 group border border-slate-100 h-40"
                >
                    <div className={`p-4 rounded-full ${item.color} text-white transition-transform group-hover:scale-110`}>
                        {item.icon}
                    </div>
                    <span className="font-bold text-slate-800 text-sm md:text-base text-center leading-tight">
                        {item.title}
                    </span>
                </button>
            ))}
        </div>
    );
};

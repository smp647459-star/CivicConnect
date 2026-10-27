import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', style, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${hover ? 'hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon, action }: { title: string; subtitle?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 p-5 pb-3">
      <div className="flex items-start gap-3">
        {icon && <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">{icon}</div>}
        <div>
          <h3 className="font-bold text-slate-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

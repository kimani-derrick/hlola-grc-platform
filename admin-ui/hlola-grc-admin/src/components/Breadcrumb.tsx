import { BreadcrumbItem } from '@/types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (index: number) => void;
}

export const Breadcrumb = ({ items, onNavigate }: BreadcrumbProps) => {
  return (
    <div className="glass rounded-2xl p-4 mb-8">
      <nav className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="text-slate-400 mx-2">/</span>}
            <button
              onClick={() => onNavigate(index)}
              className={`${
                index === items.length - 1
                  ? 'text-hlola-blue font-semibold'
                  : 'text-slate-600 hover:text-hlola-blue cursor-pointer'
              }`}
            >
              {item}
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
};

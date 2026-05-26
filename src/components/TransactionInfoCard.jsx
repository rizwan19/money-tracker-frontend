import {Pencil, Trash2, TrendingDown, TrendingUp, UtensilsCrossed} from "lucide-react";

const TransactionInfoCard = ({icon, title, date, amount, type, hideDeleteButton, onDelete, onEdit}) => {
    const getAmountStyles = () => type === 'INCOME' ? 'bg-green-950/70 text-green-300': 'bg-red-950/70 text-red-300';
    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-slate-800/70">
            <div className="w-12 h-12 flex items-center justify-center text-xl text-slate-100 bg-slate-800 rounded-full">
                {icon ? (
                    <img src={icon} alt={title} className="w-6 h-6" />
                ) : (
                    <UtensilsCrossed className="text-teal-300" />
                )}
            </div>
            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-100 font-medium">{title}</p>
                    <p className="text-xs text-slate-400 mt-1">{date}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="text-slate-400 hover:text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <Pencil size={18} />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {!hideDeleteButton && (
                        <button
                            onClick={onDelete}
                            className="text-slate-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
                    <h6 className="text-xs font-medium">
                        {type === "INCOME" ? '+' : '-'} ${amount}
                    </h6>
                    {type === 'INCOME' ? (
                        <TrendingUp size={15} />
                    ) : (
                        <TrendingDown size={15} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TransactionInfoCard;

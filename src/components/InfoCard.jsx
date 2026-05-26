const InfoCard = ({icon, label, value, color}) => {
    return (
        <div className="flex gap-6 bg-slate-900 p-6 rounded-2xl shadow-md shadow-slate-950/30 border border-slate-700">
            <div className={`w-14 h-14 shrink-0 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <h6 className="text-sm text-slate-400 mb-1">{label}</h6>
                <div className="flex items-start gap-1 text-[22px] leading-tight text-slate-50">
                    <span className="shrink-0">$</span>
                    <span className="min-w-0 break-all">{value}</span>
                </div>
            </div>
        </div>
    )
}

export default InfoCard;

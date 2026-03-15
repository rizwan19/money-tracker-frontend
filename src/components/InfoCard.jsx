const InfoCard = ({icon, label, value, color}) => {
    return (
        <div className="flex gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className={`w-14 h-14 shrink-0 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <h6 className="text-sm text-gray-500 mb-1">{label}</h6>
                <div className="flex items-start gap-1 text-[22px] leading-tight text-gray-900">
                    <span className="shrink-0">$</span>
                    <span className="min-w-0 break-all">{value}</span>
                </div>
            </div>
        </div>
    )
}

export default InfoCard;

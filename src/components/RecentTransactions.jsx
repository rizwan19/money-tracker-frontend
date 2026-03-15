import {ArrowRight, LoaderCircle} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";

const RecentTransactions = ({transactions = [], onMore, loading = false}) => {
    const hasTransactions = Array.isArray(transactions) && transactions.length > 0;

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h4 className="text-lg">Recent Transactions</h4>
                <button className="card-btn" onClick={onMore}>
                    More <ArrowRight className="text-base" size={15} />
                </button>
            </div>
            <div className="mt-6">
                {loading ? (
                    <div className="flex items-center justify-center py-6 text-gray-500">
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                    </div>
                ) : hasTransactions ? (
                    transactions.slice(0, 5).map(item => (
                        <TransactionInfoCard
                            key={item.id}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format('Do MMM YYYY')}
                            amount={item.amount}
                            type={item.type}
                            hideDeleteButton={true}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No Data</p>
                )}
            </div>
        </div>
    )
}

export default RecentTransactions;

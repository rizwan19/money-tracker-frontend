import CustomPieChart from "./CustomPieChart.jsx";
import {addThousandSeparator} from "../util/util.js";

const formatCompactCurrency = (amount) => {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
        return "$0";
    }

    if (Math.abs(numericAmount) < 100000) {
        return `$${addThousandSeparator(numericAmount)}`;
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1
    }).format(numericAmount);
};

const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {

    const colors = ["#59168B", "#a0090e", "#016630"];
    const balanceData = [
        {name: "Total Balance", amount: totalBalance},
        {name: "Total Income", amount: totalIncome},
        {name: "Total Expense", amount: totalExpense}
    ]

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Financial Overview</h5>
            </div>
            <CustomPieChart
                data={balanceData}
                label="Total Balance"
                totalAmount={formatCompactCurrency(totalBalance)}
                colors={colors}
                showTextAnchor={true}
            />
        </div>
    )
}

export default FinanceOverview;

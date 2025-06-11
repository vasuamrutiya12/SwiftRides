import { TrendingUp, TrendingDown } from "lucide-react"

// eslint-disable-next-line no-unused-vars
export default function StatsCard({ title, value, icon: Icon, color, change, changeType }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow font-bold">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center">
          {changeType === "positive" ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-1">from last month</span>
        </div>
      )}
      
    </div>
  )
}

import { DollarSign, CheckCircle, Clock, XCircle, Ban } from "lucide-react"

export default function PaymentStats({ payments }) {
  const stats = {
    completed: payments.filter((p) => p.status === "completed"),
    pending: payments.filter((p) => p.status === "pending"),
    failed: payments.filter((p) => p.status === "failed"),
    cancelled: payments.filter((p) => p.status === "cancelled"),
  }

  const totals = {
    completed: stats.completed.reduce((sum, p) => sum + p.amount, 0),
    pending: stats.pending.reduce((sum, p) => sum + p.amount, 0),
    failed: stats.failed.reduce((sum, p) => sum + p.amount, 0),
    cancelled: stats.cancelled.reduce((sum, p) => sum + p.amount, 0),
  }

  const statCards = [
    {
      title: "Completed",
      amount: totals.completed,
      count: stats.completed.length,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Pending",
      amount: totals.pending,
      count: stats.pending.length,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Failed",
      amount: totals.failed,
      count: stats.failed.length,
      icon: XCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Cancelled",
      amount: totals.cancelled,
      count: stats.cancelled.length,
      icon: Ban,
      color: "bg-gray-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
    },
  ]

  const totalAmount = Object.values(totals).reduce((sum, amount) => sum + amount, 0)

  return (
    <div className="space-y-4 mx-5">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
            <p className="text-3xl font-bold text-red-600">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`${stat.bgColor} p-4 rounded-lg border`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${stat.textColor}`}>{stat.title}</h4>
                <Icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
              <div className="space-y-1">
                <p className={`text-2xl font-bold ${stat.textColor}`}>${stat.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {stat.count} transaction{stat.count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

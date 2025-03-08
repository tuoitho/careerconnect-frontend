
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import apiService from "../api/apiService"
// Assuming you have these icons in your project
import { FaPlus, FaTrash, FaBell } from "react-icons/fa"
import Loading2 from "../components/Loading2"
const JobAlertSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await apiService.get("/job-alerts")
      setSubscriptions(response.result)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return

    try {
      setLoading(true)
      const response = await apiService.post("/job-alerts/subscribe", {
        keyword: keyword.trim(),
      })

      toast.success("Subscribed to job alerts successfully")
      setKeyword("")
      fetchSubscriptions() // Refresh the list
    } catch (error) {
      console.error("Error subscribing:", error)
      toast.error("Failed to subscribe to job alerts")
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async (subscriptionId) => {
    try {
      setLoading(true)
      const response =
      await apiService.delete(`/job-alerts/unsubscribe/${subscriptionId}`)

      toast.success(response.message)
      fetchSubscriptions() // Refresh the list
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FaBell className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Job Alert Subscriptions</h1>
          </div>
          <p className="text-gray-600">Get notified when new jobs matching your keywords are posted via email.</p>
        </div>

        {/* Add subscription form */}
        <form onSubmit={handleSubscribe} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword (e.g. React, Designer, Remote)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus size={14} />
              <span>Add Alert</span>
            </button>
          </div>
        </form>

        {/* Subscriptions list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Job Alert Keywords</h2>
{loading&& <Loading2/>}
          {loading ? (
            // <div className="text-center py-8">
            //   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            //   <p className="mt-2 text-gray-600">Loading...</p>
            // </div>
            // <Loading2/>
            <></>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-600">You don't have any job alert subscriptions yet.</p>
              <p className="text-sm text-gray-500 mt-1">
                Add keywords above to get notified about relevant job opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {subscription.keyword}
                    </span>
                  </div>
                  <button
                    onClick={() => handleUnsubscribe(subscription.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                    aria-label="Delete subscription"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobAlertSubscription


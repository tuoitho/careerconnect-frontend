// components/TabView.js
import { useState } from "react"

const TabView = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0)
 return (
    <div className="flex space-x-4">
      {children.map((child, index) => (
       <Tab 
          key={index}
         active={index === activeTab}
          onClick={() => setActiveTab(index)}
 {...child.props}
        />
      ))}
    </div>
 )
}

const Tab = ({ active, onClick, label, icon, className }) => {
  return (
 <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${active ? "bg-blue-500 text-white shadow-md" : "hover:bg-gray-100"}`}
    >
      {icon}
      <span>{label}</span>
    </button>
 )
}

export { TabView, Tab }

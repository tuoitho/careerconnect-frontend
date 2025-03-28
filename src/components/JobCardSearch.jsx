import React, { useMemo } from 'react';
import { CalendarDays, MapPin, Briefcase, DollarSign, Tag, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, isPast, parseISO, format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';

const JobCardSearch = ({ job }) => {
  const navigate = useNavigate();

  const formatSalary = (min, max) => {
    return `${min && min !== "0" ? `$${min}` : ""} ${max && max !== "0" ? `- $${max}` : ""}`.trim() || "Thỏa thuận"
  }

  const handleJobClick = () => {
    navigate(`/job/${job.jobId}`);
  }

  // Calculate days remaining until deadline
  const deadlineInfo = useMemo(() => {
    if (!job.deadline) return { text: "Không có hạn", color: "text-gray-500" };

    try {
      const deadlineDate = parseISO(job.deadline);
      const today = new Date();
      const daysRemaining = differenceInDays(deadlineDate, today);

      if (isPast(deadlineDate)) {
        return {
          text: "Đã hết hạn",
          color: "text-red-500",
          days: 0
        };
      }
      else if (daysRemaining <= 3) {
        return {
          text: `Còn ${daysRemaining} ngày`,
          color: "text-red-500",
          days: daysRemaining
        };
      }
      else if (daysRemaining <= 7) {
        return {
          text: `Còn ${daysRemaining} ngày`,
          color: "text-orange-500",
          days: daysRemaining
        };
      }
      else {
        return {
          text: `Còn ${daysRemaining} ngày`,
          color: "text-green-500",
          days: daysRemaining
        };
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      return { text: "Không rõ hạn", color: "text-gray-500" };
    }
  }, [job.deadline]);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-green-400 transition-shadow duration-300 border border-green-200 cursor-pointer"
      onClick={handleJobClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="mr-4">
            <img
              src={job.companyLogo || "/placeholder-logo.png"}
              alt={job.companyName}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-600">{job.title}</h3>
            <p className="text-gray-600">{job.companyName}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1 text-green-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mr-1 text-green-500" />
                <span>{job.jobType}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Tag className="w-4 h-4 mr-1 text-green-500" />
                <span>{job.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deadline Badge */}
        <div className={`flex items-center text-sm font-medium ${deadlineInfo.color}`}>
          <Clock className={`w-4 h-4 mr-1 ${deadlineInfo.color}`} />
          {deadlineInfo.text}
        </div>
      </div>

      {/* Additional deadline visualization for urgent jobs */}
      {deadlineInfo.days !== undefined && deadlineInfo.days <= 7 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                deadlineInfo.days <= 3 ? 'bg-red-500' : 'bg-orange-500'
              }`}
              style={{ width: `${Math.max(100 - (deadlineInfo.days * 14), 10)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCardSearch;

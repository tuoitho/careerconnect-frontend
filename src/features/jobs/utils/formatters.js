/**
 * Định dạng hiển thị mức lương
 * @param {string|number} min - Mức lương tối thiểu
 * @param {string|number} max - Mức lương tối đa
 * @returns {string} - Chuỗi định dạng mức lương
 */
export const formatSalary = (min, max) => {  
  if (!min && !max) return 'Thỏa thuận';
  return `${min && min !== "0" ? `$${min}` : ""}${min && max && max !== "0" ? " - " : ""}${max && max !== "0" ? `$${max}` : ""}`.trim();
};

/**
 * Định dạng hiển thị ngày tháng
 * @param {string|Date} date - Ngày cần định dạng
 * @returns {string} - Chuỗi định dạng ngày tháng
 */
export const formatDate = (date) => {  
  if (!date) return '';
  return new Date(date).toLocaleDateString("vi-VN", { month: "long", day: "numeric", year: "numeric" });
};

/**
 * Rút gọn văn bản nếu quá dài
 * @param {string} text - Văn bản cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Văn bản đã rút gọn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
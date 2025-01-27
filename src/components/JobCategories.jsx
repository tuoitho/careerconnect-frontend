import { BriefcaseIcon, ComputerDesktopIcon, BuildingOfficeIcon, CurrencyDollarIcon, AcademicCapIcon, HeartIcon } from '@heroicons/react/24/outline';

const categories = [
  {
    name: 'Công nghệ thông tin',
    count: '1200+ việc làm',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'Tài chính - Ngân hàng',
    count: '800+ việc làm',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Marketing',
    count: '500+ việc làm',
    icon: BriefcaseIcon,
  },
  {
    name: 'Giáo dục',
    count: '300+ việc làm',
    icon: AcademicCapIcon,
  },
  {
    name: 'Y tế',
    count: '400+ việc làm',
    icon: HeartIcon,
  },
  {
    name: 'Bất động sản',
    count: '600+ việc làm',
    icon: BuildingOfficeIcon,
  },
];

export default function JobCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ngành nghề nổi bật</h2>
          <p className="mt-4 text-lg text-gray-600">
            Khám phá cơ hội việc làm theo ngành nghề bạn quan tâm
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
            >
              <category.icon className="h-12 w-12 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
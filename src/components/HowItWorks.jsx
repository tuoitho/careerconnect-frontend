import { UserIcon, DocumentTextIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    title: 'Tạo hồ sơ',
    description: 'Tạo hồ sơ chuyên nghiệp để thu hút nhà tuyển dụng',
    icon: UserIcon,
  },
  {
    title: 'Tìm việc phù hợp',
    description: 'Tìm kiếm và ứng tuyển vào công việc phù hợp với bạn',
    icon: DocumentTextIcon,
  },
  {
    title: 'Bắt đầu công việc',
    description: 'Nhận việc và bắt đầu hành trình sự nghiệp mới',
    icon: BriefcaseIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Cách thức hoạt động</h2>
          <p className="mt-4 text-lg text-gray-600">
            Ba bước đơn giản để bắt đầu sự nghiệp mới của bạn
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
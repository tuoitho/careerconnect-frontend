# Hướng dẫn sử dụng Hook Service

Tài liệu này giải thích cách sử dụng các hook service mới được refactor từ các service thông thường.

## Giới thiệu

Các hook service được xây dựng dựa trên hook `useApi` để quản lý trạng thái loading, error và data tốt hơn. Điều này giúp tách biệt logic xử lý API và UI, đồng thời tận dụng các tính năng như hiển thị toast message và xử lý lỗi tự động.

## Các hook service có sẵn

- `useAuthService`: Xử lý các API liên quan đến xác thực (đăng nhập, đăng xuất, refresh token)
- `useCompanyService`: Xử lý các API liên quan đến công ty
- `useJobService`: Xử lý các API liên quan đến công việc
- `useCandidateService`: Xử lý các API liên quan đến ứng viên

## Cách sử dụng

### 1. Import hook service

```jsx
import { useAuthService } from '../api/authServiceWithHook';
// hoặc
import { useCompanyService } from '../services/companyServiceWithHook';
// hoặc
import { useJobService } from '../services/jobServiceWithHook';
// hoặc
import { useCandidateService } from '../services/candidateServiceWithHook';
```

### 2. Sử dụng hook trong component

```jsx
const MyComponent = () => {
  const authService = useAuthService();
  // hoặc
  const companyService = useCompanyService();
  // hoặc
  const jobService = useJobService();
  // hoặc
  const candidateService = useCandidateService();
  
  // Sử dụng các API
  const handleLogin = async () => {
    try {
      const response = await authService.login.execute(username, password);
      // Xử lý response
    } catch (error) {
      // Không cần xử lý lỗi ở đây vì đã được xử lý trong hook
    }
  };
  
  // Kiểm tra trạng thái loading
  if (authService.login.loading) {
    return <LoadingSpinner />;
  }
  
  // Hiển thị lỗi nếu có
  if (authService.login.error) {
    return <div>{authService.login.error.message}</div>;
  }
  
  return (
    // JSX của component
  );
};
```

### 3. Các thuộc tính và phương thức có sẵn

Mỗi API trong hook service đều có các thuộc tính và phương thức sau:

- `execute`: Phương thức để gọi API
- `loading`: Trạng thái loading của API
- `error`: Lỗi nếu có
- `data`: Dữ liệu trả về từ API
- `reset`: Phương thức để reset trạng thái của API
- `setData`: Phương thức để set dữ liệu thủ công

### 4. Ví dụ

Xem các ví dụ trong thư mục `examples` để hiểu rõ hơn cách sử dụng các hook service:

- `LoginWithHook.jsx`: Ví dụ về cách sử dụng `useAuthService`
- `CompanyMembersWithHook.jsx`: Ví dụ về cách sử dụng `useCompanyService`
- `AppliedJobWithHook.jsx`: Ví dụ về cách sử dụng `useJobService`

## Lợi ích

- Quản lý trạng thái loading, error và data tốt hơn
- Tách biệt logic xử lý API và UI
- Tự động hiển thị toast message khi có lỗi hoặc thành công
- Giảm code trùng lặp
- Dễ dàng mở rộng và bảo trì
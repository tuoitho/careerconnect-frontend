# Hướng dẫn nâng cấp từ Service thông thường sang Hook Service

Tài liệu này hướng dẫn cách chuyển đổi từ các service thông thường sang các hook service mới trong dự án CareerConnect.

## Lợi ích của việc chuyển đổi

- **Quản lý trạng thái tốt hơn**: Tự động quản lý loading, error và data
- **Giảm code trùng lặp**: Không cần viết lại logic xử lý lỗi và loading ở mỗi component
- **Tách biệt logic**: Tách biệt logic xử lý API và UI
- **Hiển thị thông báo tự động**: Tự động hiển thị toast message khi có lỗi hoặc thành công
- **Dễ dàng mở rộng**: Dễ dàng thêm các API mới và tùy chỉnh cách xử lý

## Các bước chuyển đổi

### 1. Import hook service thay vì service thông thường

**Trước đây:**
```jsx
import { authService } from '../api/authService';
```

**Bây giờ:**
```jsx
import { useAuthService } from '../api/authServiceWithHook';
```

### 2. Sử dụng hook trong component

**Trước đây:**
```jsx
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);
  try {
    const response = await authService.login(username, password);
    // Xử lý response
    toast.success("Login successful");
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
```

**Bây giờ:**
```jsx
const authService = useAuthService();

const handleLogin = async () => {
  try {
    const response = await authService.login.execute(username, password);
    // Xử lý response (toast đã được xử lý tự động trong hook)
  } catch (error) {
    // Không cần xử lý lỗi ở đây vì đã được xử lý trong hook
  }
};

// Sử dụng loading state từ hook
if (authService.login.loading) {
  return <LoadingSpinner />;
}
```

### 3. Xử lý lỗi và loading

**Trước đây:**
```jsx
{loading && <LoadingSpinner />}
{error && <div className="error">{error.message}</div>}
```

**Bây giờ:**
```jsx
{authService.login.loading && <LoadingSpinner />}
{authService.login.error && <div className="error">{authService.login.error.message}</div>}
```

### 4. Truy cập dữ liệu

**Trước đây:**
```jsx
const [userData, setUserData] = useState(null);

const fetchUserData = async () => {
  try {
    const response = await userService.getCurrentUser();
    setUserData(response.data);
  } catch (error) {
    // Xử lý lỗi
  }
};
```

**Bây giờ:**
```jsx
const userService = useUserService();

const fetchUserData = async () => {
  try {
    await userService.getCurrentUser.execute();
    // Dữ liệu đã được lưu trong userService.getCurrentUser.data
  } catch (error) {
    // Không cần xử lý lỗi ở đây
  }
};

// Hoặc sử dụng data trực tiếp
const userData = userService.getCurrentUser.data;
```

## Ví dụ chuyển đổi

Xem các ví dụ trong thư mục `examples` để hiểu rõ hơn cách chuyển đổi:

- `LoginWithHook.jsx`: Ví dụ về cách chuyển đổi từ LoginPage sang sử dụng hook useAuthService
- `CompanyMembersWithHook.jsx`: Ví dụ về cách chuyển đổi từ CompanyMembers sang sử dụng hook useCompanyService
- `AppliedJobWithHook.jsx`: Ví dụ về cách chuyển đổi từ AppliedJob sang sử dụng hook useJobService
- `AuthContextWithHook.jsx`: Ví dụ về cách chuyển đổi AuthContext sang sử dụng hook useAuthService

## Lưu ý khi chuyển đổi

1. **Tên phương thức**: Các phương thức API trong hook service có thêm `.execute()` để gọi API
2. **Xử lý lỗi**: Không cần xử lý lỗi và hiển thị toast trong component nữa, vì đã được xử lý trong hook
3. **Trạng thái loading**: Sử dụng `service.method.loading` thay vì quản lý state loading riêng
4. **Truy cập dữ liệu**: Sử dụng `service.method.data` để truy cập dữ liệu trả về từ API

## Kết luận

Việc chuyển đổi từ service thông thường sang hook service giúp code sạch hơn, dễ bảo trì hơn và giảm code trùng lặp. Mặc dù có thể mất một chút thời gian để chuyển đổi, nhưng lợi ích lâu dài là rất đáng giá.
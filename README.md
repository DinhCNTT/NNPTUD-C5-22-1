# 📋 SOUNDSPACE PROJECT RULES

> **Context:** Full-stack Music Room App (Node.js Express + React.js)  
> **Philosophy:** Practical, Maintainable, Team-Friendly  
> **Based on:** Actual SoundSpace codebase patterns (Feb 2026)

---

## I. FRONTEND RULES (CLIENT)

### 1. Architecture & Structure

**📁 Current Structure (Keep it):**
```
client/src/
├── components/      → All UI components (RoomCard, ModalPhong, etc.)
├── pages/          → Page-level components (Admin, Home, Room)
├── services/       → Utilities (socket, toastConfig, api helpers)
├── contexts/       → React Context (AuthContext)
└── routes/         → Route config
```

**✅ Component Rules:**
- **One component per file** - Tên file = Tên component
- **Co-locate CSS** - `ModalPhong.jsx` + `ModalPhong.css` cạnh nhau
- **Max 400 lines** - Nếu quá → Cân nhắc tách nhỏ (nhưng không bắt buộc)

### 2. API Calls & Data Fetching

**✅ THỰC TẾ (OK để làm):**
```javascript
// Component có thể gọi axios trực tiếp
const handleJoinRoom = async () => {
  const token = localStorage.getItem('token');
  await axios.post(
    `http://localhost:8800/api/rooms/${room._id}/join`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
```

**🎯 TỐI ƯU (Nên làm khi rảnh):**
- Tách API calls vào `services/roomApi.js` nếu:
  - Dùng lại > 2 lần
  - Logic phức tạp (retry, transform data)
  
**⚠️ BẮT BUỘC:**
- **KHÔNG hardcode URL** - Dùng biến `API_URL` từ `.env`
- **LUÔN có try-catch** - Hiển thị toast khi lỗi
- **LUÔN có loading state** - `isLoading`, `isJoining`, etc.

### 3. State Management

**✅ Rules:**
- **Local State** (`useState`) - Cho UI component riêng
- **Context** - Cho shared data (Auth, Theme)
- **Socket events** - Cho real-time updates

**❌ TRÁNH:**
- Prop drilling > 3 levels → Dùng Context
- State ở parent khi con không cần → Đẩy xuống

**VD Tốt:**
```javascript
// ✅ State ở đúng chỗ
const [isJoining, setIsJoining] = useState(false);
const [roomCode, setRoomCode] = useState('');
```

### 4. Styling (CSS Modules)

**✅ Standard - CSS MODULES:**
- **File naming:** `Component.module.css`
- **Import:** `import styles from './Component.module.css'`
- **Usage:** `className={styles.container}` (tự động scoped)

**Class Naming (Trong file .module.css):**
```css
/* Component.module.css */
.container { ... }
.header { ... }
.closeButton { ... }
.submitBtn { ... }
```

**Sử dụng trong JSX:**
```javascript
import styles from './ModalPhong.module.css';

const ModalPhong = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.closeButton}>✕</button>
        </div>
      </div>
    </div>
  );
};
```

**Multiple Classes:**
```javascript
// ✅ Template literal
<div className={`${styles.button} ${styles.primary}`}>

// ✅ Conditional
<div className={isActive ? styles.active : styles.inactive}>

// ✅ Combined
<div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
```

**Layout:** Flexbox chủ yếu, Grid khi cần

**❌ TRÁNH:**
- Global CSS cho component riêng (trừ `index.css`)
- Inline styles (trừ dynamic values: colors, positions)
- `!important` (trừ override thư viện)

### 5. UI/UX Requirements

**🎯 BẮT BUỘC:**

1. **Loading States:**
   ```javascript
   <button disabled={isLoading}>
     {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
   </button>
   ```

2. **Toast Notifications:**
   ```javascript
   toast.success('✅ Thành công!', toastConfig);
   toast.error('❌ Lỗi: ' + err.message, toastConfig);
   ```

3. **Error Handling:**
   ```javascript
   catch (err) {
     toast.error(
       err.response?.data?.msg || 'Đã có lỗi xảy ra',
       toastConfig
     );
   }
   ```

4. **Empty States:**
   - Danh sách rỗng → Hiện message thân thiện
   - Không data → Skeleton hoặc placeholder

---

## II. BACKEND RULES (SERVER)

### 1. Architecture Pattern

**✅ Layered Architecture (Current):**
```
server/src/
├── controllers/     → Xử lý request/response
├── models/         → Mongoose schemas
├── routes/         → Route definitions
├── middleware/     → Auth, upload, etc.
├── config/         → Database, Cloudinary, etc.
└── services/       → Business logic (nếu cần)
```

**Controller Pattern:**
```javascript
// ✅ Controller nên gọn, xử lý flow
const addRequestFromYouTube = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { url, tags, mood } = req.body;
    const userId = req.user?.id || req.user?._id;

    // 1. Validate
    if (!tags || tags.length === 0) {
      return res.status(400).json({ msg: 'Vui lòng chọn tags' });
    }

    // 2. Business logic
    const room = await Room.findById(roomId);
    // ... xử lý logic

    // 3. Response
    return res.status(201).json({
      msg: 'Đã gửi đề xuất!',
      request: newRequest,
      points: 5
    });
  } catch (error) {
    console.error('[CONTROLLER_ERROR]:', error);
    return res.status(500).json({ 
      msg: 'Lỗi máy chủ', 
      error: error.message 
    });
  }
};
```

### 2. API Response Format

**✅ THỰC TẾ (Current standard):**
```javascript
// Success (200/201)
{
  "msg": "Mô tả ngắn gọn",
  "data": { ... },          // Tùy chọn
  "points": 5,              // Tùy chọn
  "count": 10               // Tùy chọn
}

// Error (400/403/404/500)
{
  "msg": "Mô tả lỗi rõ ràng"
}
```

**🎯 KHI NÀO CẦN REFACTOR:**
- Nếu team quyết định chuẩn hóa thành:
  ```javascript
  { success: true/false, message: "...", data: {...} }
  ```

### 3. Error Handling

**✅ BẮT BUỘC:**
```javascript
// Mọi controller phải có try-catch
try {
  // ... logic
} catch (error) {
  console.error('[FUNCTION_NAME] Error:', error);
  return res.status(500).json({ 
    msg: 'Lỗi máy chủ',
    error: process.env.NODE_ENV === 'dev' ? error.message : undefined
  });
}
```

**🔍 Validation:**
```javascript
// Check đầu vào
if (!requiredField) {
  return res.status(400).json({ msg: 'Thiếu field XYZ' });
}

// Check quyền
if (room.owner.toString() !== userId.toString()) {
  return res.status(403).json({ msg: 'Không đủ quyền' });
}
```

### 4. Database Operations

**✅ Good Practices:**
```javascript
// Populate khi cần
const room = await Room.findById(roomId)
  .populate('members', 'username avatar')
  .populate('owner', 'username email');

// Update atomic
await User.updateOne(
  { _id: userId },
  { $inc: { contributionPoints: 5 } }
);

// Check exists
const room = await Room.findById(roomId);
if (!room) {
  return res.status(404).json({ msg: 'Không tìm thấy phòng' });
}
```

---

## III. SOCKET.IO RULES

### 1. Event Naming Convention

**✅ Pattern:** `<object>-<action>` (kebab-case)

```javascript
// Client emit
socket.emit('request-to-join', { roomId, requester });

// Server broadcast
io.to(roomId).emit('room-members-changed', { 
  roomId, 
  membersCount: room.members.length 
});
```

### 2. Data Structure

**✅ Luôn gửi object, có roomId:**
```javascript
socket.emit('event-name', {
  roomId: '...',
  data: { ... },
  timestamp: Date.now()
});
```

---

## IV. GENERAL BEST PRACTICES

### 1. Console Logging

**✅ Development:**
```javascript
console.log('[COMPONENT_NAME] Action:', data);
console.error('[ERROR_CONTEXT]:', error);
```

**⚠️ Production:**
- Remove hoặc wrap với `if (process.env.NODE_ENV === 'dev')`

### 2. Comments

**✅ Khi nào cần:**
- Logic phức tạp, không rõ ràng
- Workaround cho bug thư viện
- Business rules quan trọng

**❌ Tránh:**
```javascript
// ❌ BAD: Comment rõ ràng
const user = getCurrentUser(); // Get current user

// ✅ GOOD: Comment giải thích WHY
// Phải check ghost mode vì admin có thể vào phòng ẩn danh
if (isGhostMode) { ... }
```

### 3. Git Commit Messages

**✅ Format:**
```
feat: Thêm tính năng song request
fix: Sửa lỗi vote không cập nhật
refactor: Tách RoomCard thành components nhỏ
style: Cập nhật UI modal phòng
```

---

## V. CODE REVIEW CHECKLIST

### Frontend
- [ ] Có loading state khi call API
- [ ] Có toast thông báo Success/Error
- [ ] Có try-catch cho async operations
- [ ] CSS class naming theo chuẩn `Component-element`
- [ ] Không có warning trong console

### Backend
- [ ] Controller có try-catch
- [ ] Response format nhất quán
- [ ] Validation đầu vào đầy đủ
- [ ] Authentication check cho protected routes
- [ ] Console.log có prefix `[CONTEXT]`

---

## VI. PHASE 3 SPECIFIC RULES

### Song Request Components

**File Structure:**
```
components/SongRequest/
├── SongRequestModal.jsx        → Modal form (YouTube + Upload)
├── SongRequestModal.css
├── RequestsList.jsx            → Display requests
├── RequestsList.css
├── VoteButton.jsx              → Vote component
├── VoteButton.css
├── HostActions.jsx             → Approve/reject
└── HostActions.css
```

**API Integration:**
```javascript
// ✅ OK: Direct axios trong component
const handleSubmit = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    await axios.post(
      `http://localhost:8800/api/rooms/${roomId}/requests/youtube`,
      { youtubeUrl, tags, mood },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Đã gửi đề nghị!');
    onClose();
  } catch (err) {
    toast.error(err.response?.data?.msg || 'Có lỗi xảy ra');
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 PRIORITY LEVELS

### 🔴 CRITICAL (Phải làm)
- Try-catch cho mọi API call
- Loading states
- Toast notifications
- Error handling

### 🟡 RECOMMENDED (Nên làm)
- Tách components > 400 dòng
- Rename CSS classes theo chuẩn
- Add comments cho logic phức tạp

### 🟢 OPTIONAL (Làm khi rảnh)
- Tách API calls vào services
- Refactor response format
- Add TypeScript (future)

---

**Last Updated:** Feb 6, 2026  
**Version:** 1.0 (Based on actual codebase)

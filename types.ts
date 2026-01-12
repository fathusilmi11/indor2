
export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN_PACKING = 'ADMIN_PACKING',
  ADMIN_KONTEN = 'ADMIN_KONTEN',
  ADMIN_MARKETPLACE = 'ADMIN_MARKETPLACE',
  STAFF_GUDANG = 'STAFF_GUDANG'
}

export enum AttendanceStatus {
  PRESENT = 'HADIR',
  LATE = 'TERLAMBAT',
  ABSENT = 'ALFA',
  LEAVE = 'IZIN/CUTI'
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: AttendanceStatus;
  note?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

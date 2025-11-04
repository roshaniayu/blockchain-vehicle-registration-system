"use client";

// Icons
import { Icon_User, Logout_icon } from "@/components/icons/iconPack";

// Custom Hook
import { useLogin } from "@/utils/apiHooks/useAuth";

export function UserInfo() {
  const { data: userinfo } = useLogin();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <div>
        <div className=" bg-zinc-800 px-6 py-2 rounded-xl">
          <div className="text-xs font-bold">{userinfo.data.user.username}</div>
          <div className="text-xs text-gray-400">
            {userinfo.data.user.userType}
          </div>
        </div>
      </div>
      <div className="cursor-pointer" onClick={() => handleLogout()}>
        <Logout_icon />
      </div>
    </div>
  );
}

import { useDispatch } from "react-redux";
import { setAuthInfo } from "../store/auth.slice";
import { deleteToken } from "../server/auth.action";
import { useRouter } from "next/navigation";

export default function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();

  const logout = async () => {
  dispatch(
    setAuthInfo({
      isAuthinticated: false,
      userInfo: null,
    })
  );

  await deleteToken();

router.push("/");
router.refresh();
};

  return { logout };
}
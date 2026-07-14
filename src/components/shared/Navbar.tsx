"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import useLogout from "../../features/auth/hooks/useLogout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightFromBracket,
  faBars,
  faXmark,
  faGear,
  faRotateRight,
  faHeart,
  faCartShopping,
  faSun,
  faMoon
} from "@fortawesome/free-solid-svg-icons";
import { getCart } from "../../features/cart/server/cartPage.action";
import { setCartCount } from "../../features/cart/store/cart.slice";
import { setWishlistCount } from "../../features/wishlist/store/wishlist.slice";
import { getWishlist } from "../../features/wishlist/server/wishlist.actions";
import { useAppDispatch } from "../../store/store";
import logo from "../../assets/images/logo.png";
import { useAppSelector } from "../../store/store";
import { useFlyToCart } from "../../context/FlyToCartContext";
import { useTheme } from "next-themes";

export default function Navbar() {
  const pathname = usePathname();
  const { registerTarget, bouncingTarget } = useFlyToCart();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ⬇️ الناف بار يختفي خالص في الصفحات دي
  const hiddenRoutes = ["/skin-test", "/privacy", "/terms", "/profile"];
  const shouldHideNavbar = hiddenRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  const { isAuthinticated, userInfo } = useAppSelector(
    (state) => state.auth
  );
  const cartCount = useAppSelector(
    (state) => state.cart.count
  );
  const wishlistCount = useAppSelector(
    (state) => state.wishlist.count
  );
  const [blurGone, setBlurGone] = useState(false);
  const router = useRouter();
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { logout } = useLogout();
  const [isLeaving, setIsLeaving] = useState(false);
  const dispatch = useAppDispatch();

  // Pages where cart/wishlist icons should be visible
  const showCartWishlist = pathname === "/categories" || pathname === "/cart";

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setBlurGone(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function loadCart() {
      const result = await getCart();

      const count =
        result.data.cartItems?.reduce(
          (sum, item) => sum + item.quantity,
          0
        ) || 0;

      dispatch(setCartCount(count));
    }

    async function loadWishlist() {
      const result = await getWishlist();
      dispatch(setWishlistCount(result.data.wishlistItems?.length || 0));
    }

    loadCart();
    loadWishlist();
  }, [dispatch]);

  const links = [
    { name: "Home", path: "/" },
    { name: "DermaBot", path: "/Chatbot" },
    { name: "Derma Store", path: "/categories" },
    { name: "Derma Scan", path: "/DermaScan" },
  ];

  const handleNavigate = (path: string) => {
    setIsLeaving(true);

    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  // ⬇️ لازم يكون بعد الـ hooks كلها (مينفعش قبلهم في React)
  if (shouldHideNavbar) return null;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full px-3 sm:px-6 lg:px-10">
      <div className="flex items-center justify-between lg:justify-center gap-3 lg:gap-8">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 lg:gap-3">

          {/* LOGO */}
          <div className="w-[5.5rem] h-14 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={blurGone ? { opacity: 1, y: 0 } : {}}
            >
              <Image src={logo} alt="Logo" width={140} height={60} />
            </motion.div>
          </div>

          {/* NAV BOX */}
          <motion.div
            className="
              hidden lg:flex
              items-center
              gap-10
              px-10
              py-2
              bg-[#e0e0e0] dark:bg-[#2a2d3a]
              rounded-2xl
              shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
              dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
              transition-colors duration-300
            "
            initial={{ opacity: 0, y: -20 }}
            animate={blurGone ? { opacity: 1, y: 0 } : {}}
          >

            {/* LINKS */}
            <ul className="hidden lg:flex items-center gap-6 text-[#57300C] dark:text-gray-200 font-medium">

              {links.map((item, idx) => (
                <li key={idx}>
                  {item.name === "DermaBot" ? (
                    <button
                      onClick={() => handleNavigate(item.path)}
                      className={`
                        px-5 py-2 rounded-full transition-all duration-300
                        ${
                          pathname === item.path
                            ? "text-[#2196F3] shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#1c1e27,inset_-4px_-4px_8px_#383c4d]"
                            : "hover:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] dark:hover:shadow-[inset_4px_4px_8px_#1c1e27,inset_-4px_-4px_8px_#383c4d]"
                        }
                      `}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={`
                        px-5 py-2 rounded-full transition-all duration-300
                        ${
                          pathname === item.path
                            ? "text-[#2196F3] shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#1c1e27,inset_-4px_-4px_8px_#383c4d]"
                            : "hover:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] dark:hover:shadow-[inset_4px_4px_8px_#1c1e27,inset_-4px_-4px_8px_#383c4d]"
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

          </motion.div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex lg:hidden items-center gap-2 sm:gap-3">

          {/* CART + WISHLIST — mobile */}
          {showCartWishlist && (
            <>
              <Link
                href="/wishlist"
                className="
                  relative w-12 h-12 rounded-full
                  flex items-center justify-center
                  bg-[#e0e0e0] dark:bg-[#2a2d3a]
                  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
                  dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
                  transition-colors duration-300
                "
              >
                <div ref={(el) => registerTarget("wishlist", el)} className="absolute inset-0" aria-hidden="true" />
                <motion.div
                  animate={
                    bouncingTarget === "wishlist"
                      ? { scale: [1, 1.4, 0.85, 1.1, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon icon={faHeart} className="text-[#ec1212]" />
                </motion.div>
                {wishlistCount > 0 && (
                  <span
                    className="
                      absolute
                      top-1
                      right-1
                      bg-red-500
                      text-white
                      text-[10px]
                      w-4
                      h-4
                      rounded-full
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="
                  relative w-12 h-12 rounded-full
                  flex items-center justify-center
                  bg-[#e0e0e0] dark:bg-[#2a2d3a]
                  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
                  dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
                  transition-colors duration-300
                "
              >
                <div ref={(el) => registerTarget("cart", el)} className="absolute inset-0" aria-hidden="true" />
                <motion.div
                  animate={
                    bouncingTarget === "cart"
                      ? { scale: [1, 1.4, 0.85, 1.1, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon icon={faCartShopping} className="text-[#040b5d] dark:text-[#7d8fff]" />
                </motion.div>
                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      top-1
                      right-1
                      bg-red-500
                      text-white
                      text-[10px]
                      w-4
                      h-4
                      rounded-full
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* THEME TOGGLE — mobile */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="
                w-12 h-12
                rounded-full
                flex items-center justify-center
                bg-[#e0e0e0] dark:bg-[#2a2d3a]
                shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
                dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
                transition-colors duration-300
              "
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon
                icon={theme === "dark" ? faSun : faMoon}
                className="text-[#2196F3] dark:text-yellow-300 text-lg"
              />
            </button>
          )}

          {/* PROFILE */}
          <Link
            href="/profile"
            className="
              w-12 h-12
              rounded-full
              flex items-center justify-center
              bg-[#e0e0e0] dark:bg-[#2a2d3a]
              shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
              dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
              transition-colors duration-300
            "
          >
            <FontAwesomeIcon
              icon={faUser}
              className="text-[#5d6475] dark:text-gray-300 text-lg"
            />
          </Link>

          {/* MENU BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="
              w-12 h-12
              rounded-full
              flex items-center justify-center
              bg-[#e0e0e0] dark:bg-[#2a2d3a]
              shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
              dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
              transition-colors duration-300
            "
          >
            <FontAwesomeIcon
              icon={mobileMenu ? faXmark : faBars}
              className="text-[#2196F3] text-lg"
            />
          </button>

        </div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={blurGone ? { opacity: 1, y: 0 } : {}}
          className="
            hidden lg:flex
            ml-6
            items-center gap-5
            bg-[#e0e0e0] dark:bg-[#2a2d3a]
            px-5
            rounded-full
            shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
            dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
            transition-colors duration-300
          "
        >

          {showCartWishlist && (
            <>
              <Link
                href="/wishlist"
                className="relative rounded-full flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-[45px] md:h-[45px]
                                            text-[#1687D6] text-lg
                                            shadow-[-2px_-2px_8px_rgba(255,255,255,1),-2px_-2px_12px_rgba(255,255,255,0.5),inset_2px_2px_4px_rgba(255,255,255,0.1),2px_2px_8px_rgba(0,0,0,0.3)]
                                            dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),-2px_-2px_12px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.2),2px_2px_8px_rgba(0,0,0,0.5)]
                                            hover:scale-110
                                            hover:shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF]
                                            transition cursor-pointer"
              >
                <div ref={(el) => registerTarget("wishlist", el)} className="absolute inset-0 rounded-full" aria-hidden="true" />
                <motion.div
                  animate={
                    bouncingTarget === "wishlist"
                      ? { scale: [1, 1.4, 0.85, 1.1, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon icon={faHeart} className="text-[#1233ec] dark:text-[#7d8fff]" />
                </motion.div>
                {wishlistCount > 0 && (
                  <span
                    className="
                      absolute
                      top-1
                      right-1
                      bg-red-500
                      text-white
                      text-[10px]
                      w-4
                      h-4
                      rounded-full
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative rounded-full flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-[45px] md:h-[45px]
                                            text-[#1687D6] text-lg
                                            shadow-[-2px_-2px_8px_rgba(255,255,255,1),-2px_-2px_12px_rgba(255,255,255,0.5),inset_2px_2px_4px_rgba(255,255,255,0.1),2px_2px_8px_rgba(0,0,0,0.3)]
                                            dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),-2px_-2px_12px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.2),2px_2px_8px_rgba(0,0,0,0.5)]
                                            hover:scale-110
                                            hover:shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF]
                                            transition cursor-pointer"
              >
                <div ref={(el) => registerTarget("cart", el)} className="absolute inset-0 rounded-full" aria-hidden="true" />
                <motion.div
                  animate={
                    bouncingTarget === "cart"
                      ? { scale: [1, 1.4, 0.85, 1.1, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon icon={faCartShopping} className="text-[#040b5d] dark:text-[#7d8fff]" />
                </motion.div>
                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      top-1
                      right-1
                      bg-red-500
                      text-white
                      text-[10px]
                      w-4
                      h-4
                      rounded-full
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* THEME TOGGLE — desktop */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="
                relative rounded-full flex items-center justify-center
                w-10 h-10 sm:w-11 sm:h-11 md:w-[45px] md:h-[45px]
                text-[#1687D6] text-lg
                shadow-[-2px_-2px_8px_rgba(255,255,255,1),-2px_-2px_12px_rgba(255,255,255,0.5),inset_2px_2px_4px_rgba(255,255,255,0.1),2px_2px_8px_rgba(0,0,0,0.3)]
                dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),-2px_-2px_12px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.2),2px_2px_8px_rgba(0,0,0,0.5)]
                hover:scale-110
                hover:shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF]
                transition cursor-pointer
              "
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon
                icon={theme === "dark" ? faSun : faMoon}
                className="text-[#1687D6] dark:text-yellow-300"
              />
            </button>
          )}

          {/* USER + AUTH MENU */}
          <div className="relative ">

            {/* USER ICON */}
            <button
              onClick={() => setShowAuthMenu(!showAuthMenu)}
              className="
                w-14 h-14 rounded-full
                flex items-center justify-center
                text-[#0b4f87] dark:text-[#6fa8dc]
                hover:scale-105
                transition-all duration-300
              "
            >
              <FontAwesomeIcon
                icon={faUser}
                className="text-xl"
              />
            </button>

            {showAuthMenu && (
              <div
                className="
                  absolute right-0 top-20
                  w-72
                  rounded-[30px]
                  bg-[#e0e0e0] dark:bg-[#2a2d3a]
                  overflow-hidden
                  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
                  dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
                  transition-colors duration-300
                "
              >

                {isAuthinticated && userInfo ? (
                  <>
                    {/* Header */}
                    <div className="p-5 border-b border-gray-300 dark:border-gray-600">
                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-12 h-12 rounded-full
                            bg-[#d9d9d9] dark:bg-[#383c4d]
                            flex items-center justify-center
                          "
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            className="text-[#2196F3]"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-100">
                            {userInfo.name}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">

                      <Link
                        href="/profile"
                        onClick={() => setShowAuthMenu(false)}
                        className="
                          flex items-center gap-3
                          px-5 py-3
                          text-gray-700 dark:text-gray-200
                          hover:bg-white/40 dark:hover:bg-white/10
                          transition-all
                        "
                      >
                        <FontAwesomeIcon icon={faUser} />
                        My Profile
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setShowAuthMenu(false)}
                        className="
                          flex items-center gap-3
                          px-5 py-3
                          text-gray-700 dark:text-gray-200
                          hover:bg-white/40 dark:hover:bg-white/10
                          transition-all
                        "
                      >
                        <FontAwesomeIcon icon={faUser} />
                        Settings
                      </Link>

                      <Link
                        href="/DermaScan"
                        onClick={() => setShowAuthMenu(false)}
                        className="
                          flex items-center gap-3
                          px-5 py-3
                          text-gray-700 dark:text-gray-200
                          hover:bg-white/40 dark:hover:bg-white/10
                          transition-all
                        "
                      >
                        <FontAwesomeIcon icon={faUser} />
                        Retake Skin Test
                      </Link>

                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-300 dark:border-gray-600">

                      <button
                        onClick={() => {
                          logout();
                          setShowAuthMenu(false);
                        }}
                        className="
                          flex items-center gap-3
                          px-5 py-4
                          text-red-500
                          w-full
                          hover:bg-red-50 dark:hover:bg-red-500/10
                        "
                      >
                        <FontAwesomeIcon
                          icon={faRightFromBracket}
                        />
                        Logout
                      </button>

                    </div>
                  </>
                ) : (
                  <div className="p-5 flex flex-col gap-4">

                    <Link
                      href="/login"
                      onClick={() => setShowAuthMenu(false)}
                      className="
                        w-full py-4 rounded-2xl
                        bg-[#4e2405]
                        text-white text-xl font-medium
                        flex items-center justify-center
                      "
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/signup"
                      onClick={() => setShowAuthMenu(false)}
                      className="
                        w-full py-4 rounded-2xl
                        border-2 border-[#2196F3]
                        text-[#2196F3]
                        text-xl font-medium
                        flex items-center justify-center
                      "
                    >
                      Create Account
                    </Link>

                  </div>
                )}

              </div>
            )}

          </div>

        </motion.div>

      </div>
      {/* MOBILE MENU */}
      {mobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            lg:hidden
            mt-4
            mx-auto
            w-[95%]
            bg-[#e0e0e0] dark:bg-[#2a2d3a]
            rounded-3xl
            p-5
            shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
            dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
            flex flex-col gap-4
            transition-colors duration-300
          "
        >
          {links.map((item, idx) => (
            <Link
              key={idx}
              href={item.path}
              onClick={() => setMobileMenu(false)}
              className={`
                py-3 rounded-2xl
                text-center
                font-medium
                text-gray-700 dark:text-gray-200
                transition-all
                ${
                  pathname === item.path
                    ? "text-[#2196F3] shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#1c1e27,inset_-4px_-4px_8px_#383c4d]"
                    : ""
                }
              `}
            >
              {item.name === "DermaBot" ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    px-5 py-2 rounded-full transition-all duration-300
                    ${pathname === item.path ? "text-[#2196F3]" : ""}
                  `}
                >
                  {item.name}
                </motion.button>
              ) : (
                <Link
                  href={item.path}
                  className={`
                    px-5 py-2 rounded-full transition-all duration-300
                  `}
                >
                  {item.name}
                </Link>
              )}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>

  );
}
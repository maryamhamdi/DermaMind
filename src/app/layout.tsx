import { ReactNode } from "react";
import '../styles/globals.css';
import fav from '../assets/images/logo.png'
import NavbarWrapper from "../components/shared/NavbarWrapper";
import '../lib/fontawesome'
import { Exo } from "next/font/google"
import Providers from "../components/providers/providers";
import { verifyToken } from "../features/auth/server/auth.action";
import { getSkinTestResult } from "../features/profile/server/profile.actions";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getWishlist } from "../features/wishlist/server/wishlist.actions";
import { getCart } from "../features/cart/server/cartPage.action";
import { FlyToCartProvider } from "../context/FlyToCartContext";
import { ThemeProvider } from "../components/providers/theme-provider";
import { CartState } from "../features/cart/store/cart.slice";
const exo = Exo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: "--font-exo"
})

export default async function RouteLayout({ children }: { children: ReactNode }) {

let cartState: CartState = {
  count: 0,
};

let wishlistState = {
  count: 0,
};

const response = await verifyToken();
let skinType = null;
if (response.isAuthinticated) {
  try {
    const cartResponse = await getCart();



    cartState.count =
  cartResponse.data.cartItems?.reduce(
    (sum, item) => sum + item.quantity,
    0
  ) || 0;

  } catch (error) {
    console.log("CART ERROR =>", error);
  }

  try {
    const wishlistResponse = await getWishlist();



   wishlistState.count =
  wishlistResponse.data.wishlistItems?.length || 0;

  } catch (error) {
    console.log("WISHLIST ERROR =>", error);
  }

  try {
    const skinResult = await getSkinTestResult();
    skinType = skinResult.skinType;
  } catch (error) {
    console.log(error);
  }
}

  return <html lang="en" suppressHydrationWarning>
    <head>

      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>DermaMind | Where AI Meets Skin Health</title>

      <meta name="description"
  content="DermaMind combines Artificial Intelligence and skincare expertise to analyze skin conditions, generate personalized recommendations, and connect users with the most suitable skincare products."/>

      <meta name="keywords"
content="DermaMind, AI Skin Analysis, Skin Care, Skincare Products, Artificial Intelligence, Skin Scan, Skin Health, Personalized Recommendations, Beauty Tech, Dermatology"/>
      <meta name="author" content="Mariam Hamdy" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta
  property="og:title"
  content="DermaMind | AI-Powered Skin Analysis & Skincare Platform"
/>

<meta
  property="og:description"
  content="DermaMind combines AI-powered skin analysis with personalized skincare recommendations to help users understand their skin and discover the most suitable skincare products."
/>
      <meta property="og:image" content={fav.src} />
      <meta property="og:url" content="" />
      <meta property="og:type" content="website" />

      {/* Twitter  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
  name="twitter:title"
  content="DermaMind | AI-Powered Skin Analysis & Skincare Platform"
/>
<meta
  name="twitter:description"
  content="AI-powered skin analysis, personalized skincare insights, and smart product recommendations with DermaMind."
/>
      <meta name="twitter:image" content={fav.src} />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href={fav.src} />

      {/* Theme color */}
      <meta name="theme-color" content="#1687D6" />



    </head>
  <body className={` ${exo.className}`}>

 <ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem={false}
>

 <Providers
  preloadedState={{
  auth: response,
  cart: cartState,
  wishlist: wishlistState,
}}
>
  <FlyToCartProvider>
    <NavbarWrapper />

    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
    >
      {children}
    </GoogleOAuthProvider>
  </FlyToCartProvider>
  </Providers>
 
  </ThemeProvider>

</body>
  </html>
}
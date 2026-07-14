// import Image from "next/image";
// import logo from '../../assets/images/freshcart-logo.svg'
// import semilogo from '../../assets/images/mini-logo.png'
// import Link from "next/link";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { 
//     faFacebook, 
//     faTwitter, 
//     faInstagram, 
//     faLinkedin, 
//     faYoutube,
//     faCcVisa,
//     faCcMastercard,
//     faCcPaypal,
//     faCcApplePay,
//     faGooglePay
// } from "@fortawesome/free-brands-svg-icons";
// import { 
//     faEnvelope, 
//     faPhone, 
//     faLocationDot, 
//     faPaperPlane,
//     faShieldHalved,
//     faTruck,
//     faHeadset,
//     faRotate
// } from "@fortawesome/free-solid-svg-icons";

// export default function Footer() {
//     return (
//         <footer className="bg-gray-900 text-gray-300">

//             {/* Main Footer Content */}
//             <div className="container mx-auto px-4 py-10 sm:py-12">
//                 <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-12">
//                     {/* Brand Section */}
//                     <div className="lg:col-span-4">
//                         <Link href="/" className="inline-block mb-4">
//                             <Image src={logo} alt="FreshCart Logo" className="h-8 sm:h-10 w-auto brightness-0 invert" />
//                         </Link>
//                         <p className="text-gray-400 text-sm leading-relaxed mb-6">
//                             Your one-stop destination for fresh groceries, fashion, electronics, and more. 
//                             Quality products delivered to your doorstep with love.
//                         </p>
                        
//                         {/* Contact Info */}
//                         <div className="space-y-3">
//                             <a href="tel:+201234567890" className="flex items-center gap-3 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
//                                 <FontAwesomeIcon icon={faPhone} className="text-emerald-500" />
//                                 <span>+20 123 456 7890</span>
//                             </a>
//                             <a href="mailto:support@freshcart.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
//                                 <FontAwesomeIcon icon={faEnvelope} className="text-emerald-500" />
//                                 <span>support@freshcart.com</span>
//                             </a>
//                             <div className="flex items-start gap-3 text-sm text-gray-400">
//                                 <FontAwesomeIcon icon={faLocationDot} className="text-emerald-500 mt-0.5" />
//                                 <span>123 Commerce Street, Cairo, Egypt</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Categories */}
//                     <div className="lg:col-span-2">
//                         <h3 className="text-white font-semibold mb-4 text-base">Categories</h3>
//                         <ul className="space-y-2.5">
//                             <li>
//                                 <Link href="/mens-fashion" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Men's Fashion
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/womens-fashion" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Women's Fashion
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/electronics" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Electronics
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/beauty-healthy" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Beauty & Health
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/categories" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Baby & Toys
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* Quick Links */}
//                     <div className="lg:col-span-2">
//                         <h3 className="text-white font-semibold mb-4 text-base">Quick Links</h3>
//                         <ul className="space-y-2.5">
//                             <li>
//                                 <Link href="/about" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     About Us
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/contact" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Contact Us
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Privacy Policy
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/terms" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Terms of Service
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/shop" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Shop All
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* My Account */}
//                     <div className="lg:col-span-2">
//                         <h3 className="text-white font-semibold mb-4 text-base">My Account</h3>
//                         <ul className="space-y-2.5">
//                             <li>
//                                 <Link href="/profile" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     My Profile
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/allorders" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     My Orders
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/wishlist" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Wishlist
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/cart" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Shopping Cart
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/checkout" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
//                                     Checkout
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* Newsletter */}
//                     <div className="lg:col-span-2 md:col-span-2">
//                         <h3 className="text-white font-semibold mb-4 text-base">Newsletter</h3>
//                         <p className="text-sm text-gray-400 mb-4">
//                             Subscribe to get updates on new arrivals, special offers and more!
//                         </p>
//                         <form className="space-y-3">
//                             <div className="relative">
//                                 <input
//                                     type="email"
//                                     placeholder="Enter your email"
//                                     className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
//                             >
//                                 <FontAwesomeIcon icon={faPaperPlane} />
//                                 Subscribe
//                             </button>
//                         </form>

//                         {/* Social Links */}
//                         <div className="mt-6">
//                             <h4 className="text-white font-medium mb-3 text-sm">Follow Us</h4>
//                             <div className="flex gap-2">
//                                 <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors group">
//                                     <FontAwesomeIcon icon={faFacebook} className="text-gray-400 group-hover:text-white transition-colors" />
//                                 </a>
//                                 <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors group">
//                                     <FontAwesomeIcon icon={faTwitter} className="text-gray-400 group-hover:text-white transition-colors" />
//                                 </a>
//                                 <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors group">
//                                     <FontAwesomeIcon icon={faInstagram} className="text-gray-400 group-hover:text-white transition-colors" />
//                                 </a>
//                                 <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors group">
//                                     <FontAwesomeIcon icon={faLinkedin} className="text-gray-400 group-hover:text-white transition-colors" />
//                                 </a>
//                                 <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors group">
//                                     <FontAwesomeIcon icon={faYoutube} className="text-gray-400 group-hover:text-white transition-colors" />
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Bottom Bar */}
//             <div className="border-t border-gray-800">
//                 <div className="container mx-auto px-4 py-5">
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                         {/* Copyright */}
//                         <div className="flex items-center gap-3">
//                             <Image src={semilogo} alt="FreshCart" className="w-6 h-6" />
//                             <p className="text-gray-500 text-sm">
//                                 © {new Date().getFullYear()} FreshCart. All rights reserved.
//                             </p>
//                         </div>

//                         {/* Payment Methods */}
//                         <div className="flex items-center gap-3">
//                             <span className="text-xs text-gray-500 hidden sm:inline">We Accept:</span>
//                             <div className="flex items-center gap-2">
//                                 <FontAwesomeIcon icon={faCcVisa} className="text-2xl text-gray-500 hover:text-blue-500 transition-colors" />
//                                 <FontAwesomeIcon icon={faCcMastercard} className="text-2xl text-gray-500 hover:text-orange-500 transition-colors" />
//                                 <FontAwesomeIcon icon={faCcPaypal} className="text-2xl text-gray-500 hover:text-blue-400 transition-colors" />
//                                 <FontAwesomeIcon icon={faCcApplePay} className="text-2xl text-gray-500 hover:text-white transition-colors" />
//                                 <FontAwesomeIcon icon={faGooglePay} className="text-2xl text-gray-500 hover:text-white transition-colors" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// }

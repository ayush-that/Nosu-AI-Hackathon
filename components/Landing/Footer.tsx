import React from "react";
import {
  FaHeart,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaStethoscope,
  FaFirstAid,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-background/80 border-t border-muted/20">
      {/* Main Footer Content */}
      <div className="w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
                <FaHeart className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
                  MediConnect
                </span>
                <span className="text-xs text-muted-foreground">
                  Healthcare Excellence
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Your trusted partner in healthcare, providing comprehensive
              medical services with cutting-edge technology and compassionate
              care.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-rose-500 transition-colors duration-200"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-rose-500 transition-colors duration-200"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-rose-500 transition-colors duration-200"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-rose-500 transition-colors duration-200"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Medical Services */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FaStethoscope className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-semibold">Medical Services</h3>
            </div>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <Link
                  href="/soon"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Emergency Care
                </Link>
              </li>
              <li>
                <Link
                  href="/soon"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Primary Care
                </Link>
              </li>
              <li>
                <Link
                  href="/soon"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Specialist Consultations
                </Link>
              </li>
              <li>
                <Link
                  href="/soon"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Laboratory Services
                </Link>
              </li>
              <li>
                <Link
                  href="/soon"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Radiology & Imaging
                </Link>
              </li>
            </ul>
          </div>

          {/* Patient Resources */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FaUser className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-semibold">Patient Resources</h3>
            </div>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <Link
                  href="/auth"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/soon"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link
                  href="/soon"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Medical Records
                </Link>
              </li>
              <li>
                <Link
                  href="/soon"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Insurance Information
                </Link>
              </li>
              <li>
                <Link
                  href="/soon"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Patient Education
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FaFirstAid className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-semibold">Contact & Hours</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <FaMapMarkerAlt className="w-5 h-5 text-rose-500 shrink-0" />
                <span>
                  123 Healthcare Avenue
                  <br />
                  Medical District
                  <br />
                  MD 12345
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <FaPhone className="w-5 h-5 text-rose-500" />
                <a
                  href="tel:+1-800-MED-HELP"
                  className="hover:text-rose-500 transition-colors duration-200"
                >
                  1-800-MED-HELP
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <FaEnvelope className="w-5 h-5 text-rose-500" />
                <a
                  href="mailto:care@mediconnect.com"
                  className="hover:text-rose-500 transition-colors duration-200"
                >
                  care@mediconnect.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <FaCalendarAlt className="w-5 h-5 text-rose-500" />
                <div>
                  <p>Mon-Fri: 8:00 AM - 8:00 PM</p>
                  <p>Sat-Sun: 9:00 AM - 5:00 PM</p>
                  <p className="text-rose-500 font-semibold">Emergency: 24/7</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} MediConnect. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Emergency Banner */}
      <div className="w-full bg-rose-500 py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <FaPhone className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-semibold">
                24/7 Emergency: 1-800-MED-HELP
              </span>
            </div>
            <span className="text-sm hidden sm:block">
              Always Available for Your Care
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}



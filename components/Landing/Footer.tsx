import React from "react";
import { Heart, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full bg-background/80 border-t border-muted/20 py-16">
      {" "}
      {/* Increased padding */}
      <div className="container px-4 mx-auto">
        {" "}
        {/* Added a container for better content control */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {" "}
          {/* Adjusted grid for better responsiveness */}
          {/* Company Info Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
                MediConnect
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Your trusted partner in healthcare. We provide innovative
              solutions to connect patients with the care they need.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-rose-500">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-rose-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-rose-500">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-rose-500">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* Sitemap / Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-rose-500 block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-rose-500 block"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-muted-foreground hover:text-rose-500 block"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-rose-500 block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* Key Features / Highlights */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Key Features
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/hospitals"
                  className="text-sm text-muted-foreground hover:text-rose-500 block"
                >
                  Find Hospitals
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-assistant"
                  className="text-sm text-muted-foreground hover:text-rose-500 block"
                >
                  AI Health Assistant
                </Link>
              </li>
              <li>
                <Link
                  href="/appointments"
                  className="text-sm text-muted-foreground hover:text-rose-500 block"
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact & Legal */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Need Help?
            </h3>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-muted-foreground">
                Email:{" "}
                <a
                  href="mailto:support@mediconnect.com"
                  className="hover:text-rose-500"
                >
                  support@mediconnect.com
                </a>
              </li>
              <li className="text-sm text-muted-foreground">
                Phone:{" "}
                <a href="tel:+11234567890" className="hover:text-rose-500">
                  +1 (123) 456-7890
                </a>
              </li>
              {/* Removed Address for brevity, can be added back */}
            </ul>
            <div>
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-rose-500 mr-4"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-rose-500"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
        {/* Copyright Section */}
        <div className="border-t border-muted/20 mt-12 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

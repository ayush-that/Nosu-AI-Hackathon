"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Heart, Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";

export default function Header() {
  const navigationItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Services",
      description: "Find healthcare services and support near you",
      items: [
        {
          title: "Find Hospitals",
          href: "/soon",
        },
        {
          title: "AI Health Assistant",
          href: "/soon",
        },
        {
          title: "Emergency Services",
          href: "/soon",
        },
        {
          title: "Book Appointment",
          href: "/soon",
        },
      ],
    },
    {
      title: "Resources",
      description: "Access healthcare information and support",
      items: [
        {
          title: "Health Articles",
          href: "/soon",
        },
        {
          title: "FAQs",
          href: "/soon",
        },
        {
          title: "Support",
          href: "/soon",
        },
        {
          title: "Contact",
          href: "/soon",
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);
  const router = useRouter();

  const handlePatientLoginMobile = () => {
    setOpen(false); // Close the mobile menu
    router.push("/auth");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
      <nav className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:rotate-3">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <Link
            href="/"
            className="text-lg font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            MediConnect
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex justify-center">
          <NavigationMenuList className="gap-1">
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.href ? (
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className="inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 rounded-md">
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                ) : (
                  <>
                    <NavigationMenuTrigger className="h-9 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 data-[state=open]:bg-rose-500/10 data-[state=open]:text-rose-600 dark:data-[state=open]:text-rose-400">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <div className="grid gap-1">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              legacyBehavior
                              passHref
                            >
                              <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 focus:bg-rose-500/10 focus:text-rose-600 dark:focus:text-rose-400">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    {subItem.title}
                                  </span>
                                  <MoveRight className="h-4 w-4" />
                                </div>
                              </NavigationMenuLink>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-transparent hover:text-accent-foreground"
              onClick={() => router.push("/auth")} // Desktop login
            >
              Patient Login
            </Button>
            <Button
              size="sm"
              className="bg-rose-500 hover:bg-rose-600 text-white"
              onClick={() => router.push("/auth")}
            >
              Find Care
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-transparent"
            onClick={() => setOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (          <div className="fixed inset-x-0 top-16 bottom-0 bg-background/95 backdrop-blur-md"
          >
            <div className="border-t">
              <div className="grid divide-y px-4">
                <div className="text-center p-4 text-white">
                  <h2 className="text-lg font-bold">
                    Your health journey begins with
                  </h2>
                  <h3 className="text-xl font-semibold">24/7 support</h3>
                </div>
                {navigationItems.map((item) => (
                  <div key={item.title} className="py-3">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center justify-between py-1.5 text-sm font-medium text-white"
                        onClick={() => setOpen(false)} // Close menu on navigation
                      >
                        {item.title}
                        <MoveRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <div className="space-y-2">
                        <div className="font-medium text-sm text-white">
                          {item.title}
                        </div>
                        <div className="grid gap-1 pl-3">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="flex items-center justify-between py-1.5 text-sm text-muted-foreground hover:text-foreground"
                              onClick={() => setOpen(false)} // Close menu on navigation
                            >
                              {subItem.title}
                              <MoveRight className="h-4 w-4" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="grid gap-2 p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handlePatientLoginMobile} // Use the new handler
                  >
                    Patient Login
                  </Button>
                  <Button
                    className="w-full justify-start"
                    onClick={() => router.push("/auth")}
                  >
                    Find Care
                  </Button>
                </div>
              </div>
            </div>
          </div>
        
      )}
    </header>
  );
}

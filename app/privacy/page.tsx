"use client"

import React from "react"
import Footer from "@/components/Landing/Footer"
import { motion } from "framer-motion"
import { Shield, Lock, UserCheck, Bell, RefreshCw, Mail } from "lucide-react"

const PrivacyPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const sections = [
    {
      title: "Information We Collect",
      icon: Shield,
      content:
        "We collect information that you provide directly to us when you register on MediConnect, use our services, or interact with the platform. This may include personal information such as your name, email address, phone number, and health-related data.",
    },
    {
      title: "How We Use Your Information",
      icon: UserCheck,
      content:
        "The information we collect is used to provide, improve, and personalize your experience with MediConnect. This includes offering tailored healthcare recommendations, sending notifications, and maintaining the security of our platform.",
    },
    {
      title: "Data Security",
      icon: Lock,
      content:
        "We implement strong security measures to protect your data from unauthorized access, disclosure, or destruction. Our platform uses encryption technologies to safeguard sensitive information during transmission and storage.",
    },
    {
      title: "Your Rights",
      icon: Bell,
      content:
        "You have the right to access, update, or delete your personal information. If you wish to exercise any of these rights, please contact us at the provided support channels. We are committed to providing you with full control over your data.",
    },
    {
      title: "Changes to This Privacy Policy",
      icon: RefreshCw,
      content:
        "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we protect your information.",
    },
    {
      title: "Contact Us",
      icon: Mail,
      content:
        "If you have any questions or concerns about our Privacy Policy or how we handle your personal information, please reach out to us at <a href='mailto:care@mediconnect.com' className='text-[#f43f5e]'>care@mediconnect.com</a>.",
    },
  ]

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="flex flex-col items-center text-center gap-8"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#f43f5e]">Privacy Policy</h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            At MediConnect, we value your privacy and are committed to protecting your personal information. This
            Privacy Policy outlines how we collect, use, and safeguard your data to ensure you have a safe and secure
            experience while using our platform.
          </p>

          <div className="w-full max-w-4xl space-y-12 text-left">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg"
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <section.icon className="w-8 h-8 text-[#f43f5e]" />
                  <h2 className="text-2xl font-semibold text-[#f43f5e]">{section.title}</h2>
                </div>
                <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: section.content }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPage
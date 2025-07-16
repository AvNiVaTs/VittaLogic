import { Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">VittaLogic</h3>
            <p className="text-gray-300 leading-relaxed">
              Your all-in-one business management platform for tracking, managing, and growing your business
              efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/services" className="block text-gray-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="#contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div id="contact-details">
            {" "}
            {/* Added a specific ID for contact details if needed for direct linking */}
            <h4 className="text-lg font-semibold mb-4">Contact Details</h4>
            <div className="space-y-3">
              <p className="text-gray-300">Address: Manipal University Jaipur</p>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a
                  href="mailto:funcodes.deloitte@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  funcodes.deloitte@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-white transition-colors">
                  +91 9876543210
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">Copyright © VittaLogic 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

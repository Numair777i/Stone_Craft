import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2D5240] text-[#F7F4EC] py-16 px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Top section: Brand + Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Stone._.Craft
            </h2>
            <p className="text-sm text-[#F7F4EC]/80">
              Handcrafted stone art and DIY kits for creative minds.
            </p>
            <p className="text-xs text-[#F7F4EC]/60">
              Based in New Delhi, India
            </p>
          </div>

          {/* Shop column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#F7F4EC]">
              Shop
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-[#F7F4EC]/80 hover:text-white transition"
              >
                All Kits
              </Link>
              <Link
                to="/product/1"
                className="text-sm text-[#F7F4EC]/80 hover:text-white transition"
              >
                Featured
              </Link>
              <a
                href="#new"
                className="text-sm text-[#F7F4EC]/80 hover:text-white transition"
              >
                New Arrivals
              </a>
            </nav>
          </div>

          {/* Company column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#F7F4EC]">
              Company
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                href="#about"
                className="text-sm text-[#F7F4EC]/80 hover:text-white transition"
              >
                About Us
              </a>
              <Link
                to="/contact"
                className="text-sm text-[#F7F4EC]/80 hover:text-white transition"
              >
                Contact
              </Link>
              <a
                href="#faq"
                className="text-sm text-[#F7F4EC]/80 hover:text-white transition"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Connect column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#F7F4EC]">
              Connect
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#F7F4EC]/80 hover:text-white transition"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#F7F4EC]/80 hover:text-white transition"
              >
                YouTube
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#F7F4EC]/80 hover:text-white transition"
              >
                X / Twitter
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F7F4EC]/20 my-12" />

        {/* Bottom section: Legal + Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-6 text-xs text-[#F7F4EC]/70">
            <a href="#privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#returns" className="hover:text-white transition">
              Returns & Refunds
            </a>
          </div>

          <p className="text-xs text-[#F7F4EC]/60 text-center md:text-right">
            © {currentYear} Stone._.Craft. All rights reserved.
          </p>
        </div>

        {/* Minimal newsletter signup */}
        <div className="mt-12 pt-12 border-t border-[#F7F4EC]/20">
          <div className="max-w-sm">
            <h4 className="font-semibold text-sm mb-3">
              Get updates on new releases
            </h4>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-white/10 border border-[#F7F4EC]/20 rounded-lg text-sm text-white placeholder-[#F7F4EC]/50 focus:outline-none focus:border-[#F7F4EC]/50 transition"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C24B38] text-white text-sm font-semibold rounded-lg hover:bg-[#A83E2D] transition cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}


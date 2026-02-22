export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">Smart Warehouse</h3>
            <p className="text-slate-400 text-sm">
              Advanced warehouse management system with real-time monitoring and optimization.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <p className="text-slate-400 text-sm">
              Email: support@smartwarehouse.com<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
          © 2026 Smart Warehouse Digital Twin. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
